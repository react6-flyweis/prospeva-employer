export class ApiError extends Error {
  constructor(message,status=0,detail=null,uncertain=false){super(message);this.status=status;this.detail=detail;this.uncertain=uncertain;}
}
export function minor(value){
  const s=String(value).trim();
  if(!/^\d+(\.\d{1,2})?$/.test(s))throw new Error('Enter a positive amount with no more than two decimal places.');
  const [a,b='']=s.split('.'); const n=BigInt(a)*100n+BigInt(b.padEnd(2,'0'));
  if(n>BigInt(Number.MAX_SAFE_INTEGER))throw new Error('Amount is too large for this payment form.');
  return Number(n);
}
export function money(value,currency='USD'){
  if(!Number.isSafeInteger(value))return 'Amount unavailable';
  return new Intl.NumberFormat('en-US',{style:'currency',currency,minimumFractionDigits:2}).format(value/100);
}
export function validateConfig(config){
  if(!config.apiOrigin)return {...config,enabled:false};
  const url=new URL(config.apiOrigin);
  const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||!(url.protocol==='https:'||(local&&config.environment==='local'&&url.protocol==='http:')))throw new Error('Connection settings are invalid.');
  return {...config,apiOrigin:url.origin,enabled:true};
}
const id=()=>crypto.randomUUID();
const digest=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export class ProspevaClient {
  constructor(config,{fetcher=globalThis.fetch,storage=null}={}){this.config=validateConfig(config);this.fetcher=fetcher;this.storage=storage;this.token='';this.expires=0;this.organization='';this.userId='';this.pending=new Map();this.onSessionExpired=()=>{};}
  setSession(token,seconds=900){this.token=token;this.expires=Date.now()+Math.min(seconds,86400)*1000;}
  clearSession(){this.token='';this.expires=0;this.userId='';this.organization='';}
  scope(){return `${this.config.apiOrigin}|${this.userId}|${this.organization}`;}
  async request(path,{method='GET',body,key,correlation=id(),auth=true,timeout=15000}={}){
    if(!this.config.enabled)throw new ApiError('This workspace is awaiting activation.');
    if(!path.startsWith('/api/v1/')&&!['/health','/ready'].includes(path))throw new Error('Unsupported service path.');
    if(auth&&(!this.token||Date.now()>=this.expires)){this.clearSession();this.onSessionExpired();throw new ApiError('Your session has expired. Sign in again.',401);}
    if(globalThis.navigator?.onLine===false)throw new ApiError('You are offline. Reconnect before submitting.');
    const headers={'Accept':'application/json','X-Correlation-Id':correlation};
    if(auth)headers.Authorization=`Bearer ${this.token}`;
    if(auth&&this.organization)headers['X-Organization-Id']=this.organization;
    if(key)headers['Idempotency-Key']=key;
    if(body!==undefined)headers['Content-Type']='application/json';
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
    try{
      const response=await this.fetcher(this.config.apiOrigin+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,credentials:'omit',cache:'no-store',redirect:'error'});
      const data=await response.json().catch(()=>null);
      if(!response.ok){
        if(response.status===401){this.clearSession();this.onSessionExpired();}
        const detail=data?.detail;
        const message=typeof detail==='string'?detail:detail?.message||(Array.isArray(detail)?detail.map(x=>`${x.loc?.slice(1).join(' ')}: ${x.msg}`).join('; '):'The request could not be completed.');
        throw new ApiError(message,response.status,detail,method!=='GET'&&response.status>=500);
      }
      if(data===null)throw new ApiError("The service returned no readable confirmation. Refresh the record before submitting again.",response.status,null,method!=="GET");
      return data;
    }catch(e){if(e instanceof ApiError)throw e;throw new ApiError(method==='GET'?'Cannot reach the service. Please try again.':'Confirmation was not received. Check the record before starting another request.',0,null,method!=='GET');}
    finally{clearTimeout(timer);}
  }
  async command(path,body,{retrySafe=false}={}){
    const scope=this.scope();const storageKey='prospeva.pending.'+await digest(scope+'|'+path);
    const fingerprint=await digest(JSON.stringify(body??null));
    let saved=this.pending.get(storageKey);
    if(!saved&&this.storage){try{saved=JSON.parse(this.storage.getItem(storageKey)||'null');}catch{}}
    if(saved&&saved.fingerprint!==fingerprint)throw new ApiError('An earlier request is unresolved. Check its status before changing this action.');
    if(saved?.uncertain&&!retrySafe)throw new ApiError('This action may already have completed. Refresh and inspect the record; do not submit it again.');
    const ticket=saved||{key:id(),correlation:id(),fingerprint,uncertain:false};
    this.pending.set(storageKey,ticket);if(this.storage)this.storage.setItem(storageKey,JSON.stringify(ticket));
    try{
      const result=await this.request(path,{method:'POST',body,key:ticket.key,correlation:ticket.correlation});
      this.pending.delete(storageKey);this.storage?.removeItem(storageKey);return result;
    }catch(e){if(e.uncertain){ticket.uncertain=true;this.storage?.setItem(storageKey,JSON.stringify(ticket));}else{this.pending.delete(storageKey);this.storage?.removeItem(storageKey);}throw e;}
  }
  async signIn(){
    const domain=new URL(this.config.cognitoDomain);if(domain.protocol!=='https:'||domain.username||domain.password||domain.search||domain.hash||domain.pathname!=='/'||!this.config.clientId)throw new Error('Sign-in is awaiting activation.');
    const verifier=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const challenge=btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    const state=id();const redirect=location.origin+'/workspace.html';
    sessionStorage.setItem('prospeva.oauth',JSON.stringify({verifier,state,redirect,created:Date.now()}));
    const u=new URL('/oauth2/authorize',domain);u.search=new URLSearchParams({client_id:this.config.clientId,response_type:'code',scope:'openid email',redirect_uri:redirect,state,code_challenge:challenge,code_challenge_method:'S256'}).toString();location.assign(u.href);
  }
  async finishSignIn(){
    const params=new URLSearchParams(location.search);if(!params.has('code')&&!params.has('error'))return false;
    const attempt=JSON.parse(sessionStorage.getItem('prospeva.oauth')||'null');sessionStorage.removeItem('prospeva.oauth');history.replaceState(null,'',location.pathname);
    if(params.has('error'))throw new Error('Sign-in was not completed. Please try again.');
    if(!attempt||attempt.state!==params.get('state')||Date.now()-attempt.created>600000||attempt.redirect!==location.origin+'/workspace.html')throw new Error('Sign-in expired. Please start again.');
    const domain=new URL(this.config.cognitoDomain);if(domain.protocol!=='https:')throw new Error('Invalid sign-in service.');
    const r=await this.fetcher(new URL('/oauth2/token',domain),{method:'POST',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',client_id:this.config.clientId,code:params.get('code'),redirect_uri:attempt.redirect,code_verifier:attempt.verifier})});
    const data=await r.json();if(!r.ok||!data.access_token)throw new Error('Sign-in could not be verified.');
    this.setSession(data.access_token,data.expires_in);return true;
  }
  localAuthAllowed(){return this.config.environment==='local'&&['localhost','127.0.0.1','[::1]'].includes(new URL(this.config.apiOrigin).hostname)&&['localhost','127.0.0.1','[::1]'].includes(globalThis.location?.hostname||'localhost');}
  async localLogin(email,password){if(!this.localAuthAllowed())throw new Error('Local sign-in is disabled.');return this.request('/api/v1/auth/login',{method:'POST',body:{email,password},auth:false});}
  async localMfa(challenge,code){if(!this.localAuthAllowed())throw new Error('Local sign-in is disabled.');const r=await this.request('/api/v1/auth/mfa',{method:'POST',body:{challenge_id:challenge,code},auth:false});this.setSession(r.access_token,r.expires_in);return r;}
}
