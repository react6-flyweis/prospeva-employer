import {ProspevaClient,ApiError,minor,money} from './prospeva-client.mjs';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=s=>String(s).replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const portal=document.body.dataset.portal;
const names={mobile:'Personal wallet',business:'Business workspace',employer:'Employer payroll',admin:'Super Admin'};
let client,me,organizations=[],workspace={},view='overview',rows=[],busy=false,generation=0,refreshTimer;
const config=await fetch('/prospeva-config.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Connection settings are unavailable.');return r.json();}).catch(()=>({apiOrigin:''}));
client=new ProspevaClient(config,{storage:sessionStorage});
function notice(message,error=false){$('#notice').textContent=message;$('#notice').className=error?'notice error':'notice';$('#notice').hidden=!message;}
function status(text){$('#connection').textContent=text;}
function roles(){return (me?.memberships||[]).filter(x=>!client.organization||x.organization_id===client.organization||x.role==='admin').map(x=>x.role);}
function has(...r){return r.some(x=>roles().includes(x));}
function option(v,label){return `<option value="${esc(v)}">${esc(label)}</option>`;}
function amount(v,c){return esc(money(v,c));}
function fields(fs){return fs.map(f=>`<label>${esc(f.label)}${f.options?`<select name="${f.name}" ${f.required===false?'':'required'}>${f.options.map(x=>option(Array.isArray(x)?x[0]:x,Array.isArray(x)?x[1]:title(x))).join('')}</select>`:f.textarea?`<textarea name="${f.name}" maxlength="500" required>${esc(f.value||'')}</textarea>`:`<input name="${f.name}" type="${f.type||'text'}" ${f.required===false?'':'required'} ${f.numeric?'inputmode="decimal"':''} ${f.type==='number'?'min="1" step="1"':''} maxlength="255" value="${esc(f.value||'')}" autocomplete="off">`}</label>`).join('');}
function dialog(name,fs,submit,copy='Review the details before submitting. This action uses your signed-in account.'){
 const d=$('#dialog');$('#dialog-title').textContent=name;$('#dialog-copy').textContent=copy;$('#form-fields').innerHTML=fields(fs);$('#form-error').textContent='';$('#submit').textContent='Confirm';$('#submit').disabled=false;d.showModal();
 $('#action-form').onsubmit=async e=>{e.preventDefault();if(busy)return;const values=Object.fromEntries(new FormData(e.currentTarget));busy=true;$('#submit').disabled=true;$('#cancel').disabled=true;
 try{const result=await submit(values);d.close();notice(result?.status?`Saved · ${title(result.status)}. Refreshing current records.`:'Saved. Refreshing current records.');await loadView();}
 catch(error){$('#form-error').textContent=error.message;if(error.uncertain)$('#form-error').textContent+=' The outcome needs confirmation. Refresh your records before trying again.';}
 finally{busy=false;$('#submit').disabled=false;$('#cancel').disabled=false;}};
}
$('#cancel').onclick=()=>{if(!busy)$('#dialog').close();};$('#dialog').addEventListener('cancel',e=>{if(busy)e.preventDefault();});
function table(data,columns,click=null){
 if(!data?.length)return '<div class="empty">No records to show yet.</div>';
 const head=columns.map(c=>`<th scope="col">${esc(c[1])}</th>`).join('');
 return `<div class="table-wrap"><table><thead><tr>${head}${click?'<th>Details</th>':''}</tr></thead><tbody>${data.map((row,i)=>`<tr>${columns.map(([k,l])=>`<td>${k.endsWith('_minor')?amount(row[k],row.currency||'USD'):esc(typeof row[k]==='object'?JSON.stringify(row[k]):row[k]??'—')}</td>`).join('')}${click?`<td><button class="secondary" data-row="${i}">View</button></td>`:''}</tr>`).join('')}</tbody></table></div>`;
}
function bindRows(data,callback){document.querySelectorAll('[data-row]').forEach(b=>b.onclick=()=>Promise.resolve(callback(data[Number(b.dataset.row)])).catch(e=>notice(e.message,true)));}
function walletCards(wallets){return `<div class="cards">${(wallets||[]).map(w=>`<article class="wallet"><small>${esc(w.currency)} wallet</small><h2>${amount(w.balance_minor,w.currency)}</h2><span>${esc(w.status)}</span><p class="reference">${esc(w.id)}</p></article>`).join('')}</div>`;}
function nav(){
 let tabs=[['overview','Overview']];
 if(portal==='mobile')tabs.push(['transfer','Send money'],['cards','Cards'],['loans','Loans'],['bills','Bills'],['funding','Funding sources']);
 if(portal==='business')tabs.push(['financing','Financing'],['collections','Collections'],['invoices','Invoices'],['approvals','Approvals']);
 if(portal==='employer')tabs.push(['payroll','Payroll'],['employees','Employees'],['financing','Payroll financing'],['approvals','Approvals']);
 if(portal==='admin')tabs.push(['financing','Financing oversight'],['approvals','Approvals'],['transactions','Transactions'],['audit','Audit history'],['safeguarding','Safeguarding'],['rails','Payment services'],['delivery','Record updates']);
 $('#navigation').innerHTML=tabs.map(([id,label])=>`<button data-view="${id}" aria-current="${view===id?'page':'false'}">${label}</button>`).join('');
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{if(busy)return;view=b.dataset.view;loadView();});
}
async function boot(){
 const info=await client.request('/api/v1/me');me=info;client.userId=info.user.id;organizations=await client.request('/api/v1/organizations');
 const eligibleOrganizations=organizations.filter(o=>o.active&&(portal==='employer'?o.type==='employer':portal==='business'?['merchant','business','lender'].includes(o.type):true));
 if(portal==='employer'||portal==='business'){
  const eligible=eligibleOrganizations;
  client.organization=eligible[0]?.id||'';
  if(!client.organization)throw new Error('Your account has no organization for this workspace.');
 }
 if(portal==='admin'&&!has('admin'))throw new Error('This account does not have Super Admin access.');
 if(portal==='mobile'&&!has('mobile_user','admin'))throw new Error('This account does not have a personal wallet role.');
 $('#signin').hidden=true;$('#workspace').hidden=false;$('#account').textContent=info.user.full_name||info.user.email;
 const opts=(portal==='mobile'?[]:eligibleOrganizations).map(o=>option(o.id,`${o.name} · ${title(o.type)}`)).join('');
 $('#organization').innerHTML=(portal==='admin'?option('','All organizations'):'')+opts;$('#organization').value=client.organization;$('#organization').hidden=portal==='mobile';
 $('#organization').onchange=async e=>{if(busy)return;generation++;client.organization=e.target.value;workspace={};$('#content').replaceChildren();await loadView();};
 status(config.environment==='production'?'Connected':'Connected · Test environment');
 clearInterval(refreshTimer);refreshTimer=setInterval(()=>{if(!document.hidden&&!busy&&!$('#dialog').open&&navigator.onLine&&view!=='transfer')loadView(false);},60000);
 await loadView();
}
async function loadView(showLoading=true){
 const current=++generation;nav();$('#view-title').textContent=title(view);$('#actions').replaceChildren();if(showLoading)$('#content').innerHTML='<p class="empty">Loading current records…</p>';
 try{
  workspace=await client.request('/api/v1/workspace');if(current!==generation)return;if(workspace.api_version!==config.requiredApiVersion)throw new Error('The portal and service versions do not match. Contact support before submitting.');
  if(view==='transfer'){renderTransfer();return;}
  let path;
  if(view==='overview')path=portal==='mobile'?'/mobile/home':portal==='business'?(has('lender_user')?'/lending/lender/portfolio':'/business/overview'):portal==='employer'?'/employer/overview':'/admin/overview';
  else path=({cards:'/cards',loans:'/lending/applications/mine',bills:'/bills/catalog',funding:'/funding/sources',financing:portal==='admin'?'/financing/admin/operations':has('lender_user')?'/financing/lender/requests':'/financing/requests',payroll:'/employer/overview',employees:'/employer/employees',approvals:'/approvals',collections:'/merchant-payments/business/transactions',invoices:'/collections/business/invoices',transactions:'/admin/transactions',audit:'/admin/audit-events',safeguarding:'/admin/safeguarding/dashboard',rails:'/admin/payment-rails',delivery:'/admin/event-delivery'})[view];
  const data=await client.request('/api/v1'+path);if(current!==generation)return;
  renderData(data);$('#updated').textContent='Updated '+new Date().toLocaleTimeString();
 }catch(e){if(current!==generation)return;$('#content').innerHTML='<div class="empty">Records could not be loaded. Your previous records have not been replaced with demonstration data.</div>';notice(e.message,true);}
}
function renderData(data){
 if(view==='overview'){
  const ws=data.wallets||workspace.wallets||[];let metrics=Object.entries(data.metrics||{}).filter(([k,v])=>!k.endsWith('_minor')&&typeof v==='number');
  $('#content').innerHTML=walletCards(ws)+`<div class="cards">${metrics.map(([k,v])=>`<article><small>${esc(title(k))}</small><h2>${esc(v)}</h2></article>`).join('')}</div>`+table(data.recent_transactions||data.payroll_runs||[],[['id','Reference'],['status','Status'],['currency','Currency'],['amount_minor','Amount']]);return;
 }
 if(view==='financing'){
  rows=Array.isArray(data)?data:data.requests||[];
  $('#content').innerHTML=table(rows,[['id','Request'],['financing_type','Type'],['requested_amount_minor','Requested'],['currency','Currency'],['status','Status'],['eligibility_status','Eligibility']],true);
  bindRows(rows,financingDetail);
  if(portal!=='admin'&&!has('lender_user')&&has('business_user','payroll_manager','ceo','general_manager','operations_manager','finance_approver','payroll_approver'))action('Request financing',newFinancing);
  return;
 }
 if(view==='payroll'){
  rows=data.payroll_runs||[];$('#content').innerHTML=table(rows,[['id','Payroll'],['period','Period'],['employee_count','Employees'],['status','Status']],true);
  bindRows(rows,payrollDetail);if(has('payroll_manager','admin'))action('Create payroll draft',newPayroll);return;
 }
 if(view==='approvals'){
  rows=Array.isArray(data)?data:[];$('#content').innerHTML=table(rows,[['id','Approval'],['action','Action'],['status','Status'],['requester_user_id','Requested by']],true);bindRows(rows,approvalDetail);return;
 }
 const datasets=Array.isArray(data)?[['Records',data]]:Object.entries(data||{}).filter(([k,v])=>Array.isArray(v));
 if(datasets.length){$('#content').innerHTML=datasets.map(([name,list])=>`<h3>${esc(title(name))}</h3>`+table(list,columnsFor(list))).join('');}
 else{$('#content').innerHTML=`<article class="detail">${Object.entries(data||{}).map(([k,v])=>`<p><strong>${esc(title(k))}</strong><span>${esc(typeof v==='object'?Object.entries(v||{}).map(([a,b])=>`${title(a)}: ${b}`).join(' · '):v??'—')}</span></p>`).join('')}</article>`;}
 if(view==='bills')$('#content').insertAdjacentHTML('afterbegin','<p class="hint">Only services activated by your provider appear here. Bill-payment execution remains subject to provider availability.</p>');
}
function columnsFor(list){if(!list.length)return [['id','Reference']];const preferred=['id','name','title','employee_number','currency','amount_minor','status','action','created_at','event_type','enabled','implementation_status'];const keys=preferred.filter(k=>k in list[0]);return (keys.length?keys:Object.keys(list[0]).filter(k=>!['token','password','secret'].some(x=>k.includes(x))).slice(0,6)).map(k=>[k,title(k)]);}
function action(label,fn){const b=document.createElement('button');b.textContent=label;b.className='primary';b.onclick=()=>Promise.resolve(fn()).catch(e=>notice(e.message,true));$('#actions').append(b);}
function walletOptions(){return (workspace.wallets||[]).filter(w=>w.status==='active').map(w=>[w.id,`${w.currency} · ${money(w.balance_minor,w.currency)} · ${w.id}`]);}
function newFinancing(){
 const employer=portal==='employer';const fs=[{name:'amount',label:'Requested amount',numeric:true},{name:'currency',label:'Currency',options:['USD','LRD']},{name:'product_type',label:'Financing product',options:employer?['payroll_bridge','payroll_facility']:['working_capital','inventory_finance','revenue_based_finance']},{name:'purpose',label:'Purpose',textarea:true},{name:'repayment_source',label:'Repayment source',options:['verified_receivables','settlement_share','operating_income']},{name:'designated_wallet_id',label:'Receiving wallet',options:walletOptions()},{name:'facility_mode',label:'Facility',options:['single','recurring']}];
 if(employer)fs.push({name:'payroll_run_id',label:'Submitted payroll reference'});
 dialog('Request financing',fs,v=>client.command('/api/v1/financing/requests',{...v,financing_type:employer?'employer_payroll':'merchant',requested_amount_minor:minor(v.amount),amount:undefined,evidence:{},controls:{}},{retrySafe:true}),'Submitting a request is not credit approval. Your assigned lender reviews evidence and sets the terms.');
}
async function financingDetail(row){
 const data=await client.request('/api/v1/financing/requests/'+encodeURIComponent(row.id));view='financing';$('#view-title').textContent='Financing request';$('#actions').replaceChildren();
 $('#content').innerHTML=`<article class="detail"><h2>${esc(data.purpose)}</h2><p><strong>Reference</strong><span>${esc(data.id)}</span></p><p><strong>Requested</strong><span>${amount(data.requested_amount_minor,data.currency)}</span></p><p><strong>Status</strong><span>${esc(title(data.status))}</span></p><p><strong>Evidence access</strong><span>${esc(title(data.evidence_access))}</span></p><p><strong>Assigned lender</strong><span>${esc(data.assigned_lender_org_id||'Awaiting assignment')}</span></p></article><h3>Offers</h3>${(data.offers||[]).map((o,i)=>`<article class="detail"><h3>${amount(o.principal_minor,o.currency)} · ${esc(o.term_days)} days</h3><p>Total repayment: ${amount(o.total_repayment_minor,o.currency)}</p><p>Lender charges: ${amount(o.lender_charges_minor,o.currency)} · Prospeva fee: ${amount(o.prospeva_fee_minor,o.currency)}</p><p>${esc(title(o.repayment_frequency))} · ${esc(title(o.status))}</p><p>Security: ${esc(o.security_description||'Not stated')}</p><p>Late treatment: ${esc(o.late_treatment||'Not stated')}</p><p>Early repayment: ${esc(o.early_repayment_terms||'Not stated')}</p><p>Expires: ${esc(o.expires_at)}</p>${!has('admin','lender_user')?`<button data-offer="${i}" class="secondary">Request acceptance approval</button>`:''}</article>`).join('')||'<p class="empty">No lender offer yet.</p>'}`;
 if(portal==='admin'){
  action('Assign lender',()=>dialog('Assign lender',[{name:'lender_org_id',label:'Approved lender',options:organizations.filter(o=>o.type==='lender').map(o=>[o.id,o.name])},{name:'reason',label:'Reason',textarea:true}],v=>client.command(`/api/v1/financing/requests/${data.id}/assign-lender`,v)));
  action('Review evidence',()=>dialog('Review verified evidence',[{name:'eligibility_status',label:'Eligibility decision',options:['review_required','eligible_to_request','restricted','ineligible']},{name:'evidence_reference',label:'Evidence review reference'},{name:'reason',label:'Review findings',textarea:true}],v=>client.command(`/api/v1/financing/requests/${data.id}/evidence-review`,{eligibility_status:v.eligibility_status,reason:v.reason,verified_evidence:{review_reference:v.evidence_reference},risk_controls:{}}),'Record only evidence you have independently verified. This decision does not approve a loan.'));
 }else if(has('lender_user')){
  action('Create offer',()=>newOffer(data));
 }else{
  action('Authorize evidence sharing',()=>dialog('Authorize evidence sharing',[{name:'purpose',label:'Purpose of sharing',value:'Assess this financing request'},{name:'evidence_categories',label:'Information to share',options:[['kyb,settlements,sales,risk_controls','Business verification, sales, settlements and risk controls'],['kyb,payroll,funding_history,reconciliation','Employer verification, payroll, funding and reconciliation']]},{name:'expires_in_days',label:'Consent duration (days)',type:'number',value:'30'}],v=>client.command(`/api/v1/financing/requests/${data.id}/consents`,{...v,evidence_categories:v.evidence_categories.split(','),expires_in_days:Number(v.expires_in_days)}),'Authorize the assigned lender to use the selected evidence for this request. Access is time limited.'));
 }
 document.querySelectorAll('[data-offer]').forEach(b=>b.onclick=()=>{const o=data.offers[Number(b.dataset.offer)];dialog('Request offer acceptance',[],()=>client.command(`/api/v1/financing/offers/${o.id}/request-acceptance`),`Total repayment ${money(o.total_repayment_minor,o.currency)}. A different authorized approver must approve acceptance.`);});
 if(data.facility){const f=data.facility;$('#content').insertAdjacentHTML('beforeend',`<article class="detail"><h3>Facility · ${esc(f.id)}</h3><p>Status: ${esc(title(f.status))}</p><p>Outstanding: ${amount(f.outstanding_minor,f.currency)}</p><p>Collected: ${amount(f.collected_minor,f.currency)}</p></article>`);
  if(has('lender_user')&&f.status==='approved_pending_disbursement')action('Disburse approved facility',()=>dialog('Confirm disbursement',[],()=>client.command(`/api/v1/financing/lender/facilities/${f.id}/disburse`,undefined,{retrySafe:true}),`Send ${money(f.principal_minor,f.currency)} to the approved receiving wallet. Additional verification may be required.`));
  if(!has('admin','lender_user')&&['active','past_due','hardship','disputed'].includes(f.status))action('Make repayment',()=>dialog('Repay facility',[{name:'source_wallet_id',label:'Payment wallet',options:walletOptions()},{name:'amount',label:`Amount (${f.currency})`,numeric:true}],v=>client.command(`/api/v1/financing/facilities/${f.id}/repay`,{source_wallet_id:v.source_wallet_id,amount_minor:minor(v.amount)},{retrySafe:true})));
 }
}
function newOffer(data){dialog('Create lender offer',[{name:'principal',label:`Principal (${data.currency})`,numeric:true},{name:'total',label:'Total repayment',numeric:true},{name:'charges',label:'Lender charges',numeric:true,value:'0'},{name:'fee',label:'Prospeva fee',numeric:true,value:'0'},{name:'term_days',label:'Term (days)',type:'number'},{name:'repayment_frequency',label:'Repayment schedule',options:['monthly','weekly','biweekly','daily','revenue_share','on_receivable']},{name:'security_description',label:'Security requirements',textarea:true},{name:'late_treatment',label:'Late payment treatment',textarea:true},{name:'early_repayment_terms',label:'Early repayment terms',textarea:true}],v=>client.command(`/api/v1/financing/lender/requests/${data.id}/offers`,{principal_minor:minor(v.principal),currency:data.currency,total_repayment_minor:minor(v.total),lender_charges_minor:minor(v.charges),prospeva_fee_minor:minor(v.fee),term_days:Number(v.term_days),repayment_frequency:v.repayment_frequency,security_description:v.security_description,late_treatment:v.late_treatment,early_repayment_terms:v.early_repayment_terms,expires_in_days:7,additional_terms:{}}));}
function newPayroll(){dialog('Create payroll draft',[{name:'period',label:'Payroll period',type:'month'},{name:'employee_count',label:'Employee count',type:'number'},{name:'usd',label:'USD payroll total',numeric:true,value:'0'},{name:'lrd',label:'LRD payroll total',numeric:true,value:'0'},{name:'exchange_rate_lrd_per_usd',label:'Approved LRD per USD rate (whole number)',type:'number'}],v=>client.command('/api/v1/employer/payroll-runs',{period:v.period,employee_count:Number(v.employee_count),total_usd_minor:minor(v.usd),total_lrd_minor:minor(v.lrd),exchange_rate_lrd_per_usd:Number(v.exchange_rate_lrd_per_usd)}),'This creates a draft only. Payroll must be validated and approved before money can move.');}
function payrollDetail(row){$('#view-title').textContent='Payroll · '+row.period;$('#actions').replaceChildren();$('#content').innerHTML=`<article class="detail"><h2>${esc(row.period)}</h2><p>${esc(row.id)}</p><p>Status: ${esc(title(row.status))}</p><p>${esc(row.employee_count)} employees</p><p>USD total: ${amount(row.total_usd_minor,'USD')}</p><p>LRD total: ${amount(row.total_lrd_minor,'LRD')}</p></article>`;
 if(row.status==='draft'&&has('payroll_manager','admin'))action('Submit for approval',()=>dialog('Submit payroll',[],()=>client.command(`/api/v1/employer/payroll-runs/${row.id}/submit`),'Submit this draft for funding and approval checks. This does not release payroll.'));
 action('View reconciliation',async()=>{const r=await client.request(`/api/v1/employer/payroll-runs/${row.id}/reconciliation`);$('#content').innerHTML='<article class="detail">'+Object.entries(r).map(([k,v])=>`<p><strong>${esc(title(k))}</strong><span>${esc(v)}</span></p>`).join('')+'</article>';});
 $('#content').insertAdjacentHTML('beforeend','<p class="hint">Payroll release is not enabled in this workspace until the complete employee-line and production funding checks are verified.</p>');
}
function approvalDetail(row){$('#content').innerHTML=`<article class="detail"><h2>${esc(title(row.action))}</h2><p>Reference: ${esc(row.id)}</p><p>Status: ${esc(title(row.status))}</p><p>Requested by: ${esc(row.requester_user_id)}</p><p>Record: ${esc(row.resource_id)}</p></article>`;$('#actions').replaceChildren();
 if(row.status!=='pending'||row.requester_user_id===me.user.id)return;
 const financing=row.action==='financing.offer.accept';
 const allowed=financing?has('ceo','general_manager','operations_manager','finance_approver','payroll_approver'):row.action==='payroll.release'&&has('payroll_approver','admin');
 if(!allowed)return;
 action('Record decision',()=>dialog('Approval decision',[{name:'decision',label:'Decision',options:[['no','Reject'],['yes','Approve']]},{name:'reason',label:'Reason',textarea:true}],v=>client.command(`/api/v1/${financing?'financing':'employer'}/approvals/${row.id}/decision`,{approve:v.decision==='yes',reason:v.reason}),'Review the source record and terms before approving. You cannot approve your own request.'));
}
function renderTransfer(){
 $('#content').innerHTML=`<article class="detail"><p>Send money to a verified Prospeva wallet. Both wallets must use the same currency.</p><form id="transfer-form">${fields([{name:'source',label:'From wallet',options:walletOptions()},{name:'destination',label:'Recipient wallet reference'},{name:'amount',label:'Amount',numeric:true},{name:'description',label:'Payment note',required:false}])}<button class="primary">Review transfer</button></form></article>`;
 $('#transfer-form').onsubmit=async e=>{e.preventDefault();if(busy)return;busy=true;const v=Object.fromEntries(new FormData(e.currentTarget));try{
  const source=workspace.wallets.find(w=>w.id===v.source);const recipient=await client.request('/api/v1/mobile/recipients/'+encodeURIComponent(v.destination));
  if(!source||recipient.currency!==source.currency)throw new Error('The receiving wallet must use the same currency.');
  const n=minor(v.amount);if(n<=0)throw new Error('Enter an amount greater than zero.');
  const quote=await client.request('/api/v1/pricing/quote',{method:'POST',body:{service:'internal_transfer',amount_minor:n,source_currency:source.currency,destination_currency:source.currency,classification:'internal'}});
  dialog('Confirm transfer',[],()=>client.command('/api/v1/mobile/transfers/quoted',{quote_id:quote.quote_id,source_wallet_id:source.id,destination_wallet_id:recipient.wallet_id,description:v.description},{retrySafe:true}),`Recipient: ${recipient.display_name} (${recipient.wallet_id}). Receives ${money(quote.recipient_amount_minor,source.currency)}. Fee: ${money(quote.fees.customer_fee_minor,source.currency)}. Total debit: ${money(quote.total_payer_debit_minor,source.currency)}. Quote expires ${new Date(quote.expires_at).toLocaleTimeString()}.`);
 }catch(err){notice(err.message,true);}finally{busy=false;}};
}
$('#refresh').onclick=()=>{notice('');loadView();};$('#logout').onclick=()=>{client.clearSession();clearInterval(refreshTimer);generation++;$('#workspace').hidden=true;$('#signin').hidden=false;$('#content').replaceChildren();status('Signed out');};
client.onSessionExpired=()=>{$('#workspace').hidden=true;$('#signin').hidden=false;clearInterval(refreshTimer);status('Sign-in required');};
window.addEventListener('offline',()=>{status('Offline · submissions paused');notice('Reconnect before submitting. No money movement is queued automatically.');});
window.addEventListener('online',()=>{status(client.token?'Connected':'Sign-in required');notice('Connection restored. Refresh records before submitting.');});
$('#portal-name').textContent=names[portal];document.title='Prospeva · '+names[portal];
if(!client.config.enabled){status('Awaiting activation');$('#login-button').disabled=true;$('#login-description').textContent='This workspace is prepared for the shared Prospeva service. Sign-in and financial actions will become available after the service is deployed and connected.';}
else{
 $('#login-button').onclick=()=>client.signIn().catch(e=>notice(e.message,true));
 if(client.localAuthAllowed()){$('#local-login').hidden=false;$('#login-button').hidden=true;$('#local-login').onsubmit=async e=>{e.preventDefault();try{const v=Object.fromEntries(new FormData(e.currentTarget));const challenge=await client.localLogin(v.email,v.password);$('#local-login').reset();dialog('Verify sign-in',[{name:'code',label:'Verification code'}],async v=>{await client.localMfa(challenge.challenge_id,v.code);await boot();return {};});}catch(e){notice(e.message,true);}};}
 try{if(await client.finishSignIn())await boot();}catch(e){client.clearSession();notice(e.message,true);}
}
