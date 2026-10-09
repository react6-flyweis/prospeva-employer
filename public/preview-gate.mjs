export async function mountPreviewGate(){
 if(document.querySelector('#prospeva-preview-banner'))return;
 const config=await fetch('/prospeva-config.json',{cache:'no-store'}).then(r=>r.json()).catch(()=>({apiOrigin:''}));
 if(config.apiOrigin&&!new URLSearchParams(location.search).has('preview')){location.replace('/workspace.html');return;}
 const bar=document.createElement('aside');bar.id='prospeva-preview-banner';bar.setAttribute('aria-label','Preview status');
 bar.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#123f31;color:white;border:1px solid #98cbb2;border-radius:12px;padding:12px 18px;display:flex;gap:12px;align-items:center;justify-content:space-between;font:14px/1.4 system-ui;box-shadow:0 4px 20px #0002';
 const text=document.createElement('span');text.textContent='Product preview · Actions here use demonstration data.';
 const a=document.createElement('a');a.href='/workspace.html';a.textContent=config.apiOrigin?'Open workspace':'Workspace connection';a.style.cssText='color:white;font-weight:700;white-space:nowrap;text-decoration:underline';bar.append(text,a);document.body.append(bar);
 document.body.style.paddingBottom='80px';
}
if(typeof document!=='undefined')mountPreviewGate();
