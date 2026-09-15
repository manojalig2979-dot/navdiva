const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
$('.menu')?.addEventListener('click',()=>$('.nav-links')?.classList.toggle('open'));
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>$('.nav-links')?.classList.remove('open')));
const path=location.pathname.replace(/\/$/,'')||'/'; $$('.nav-links a[data-page]').forEach(a=>{if(a.dataset.page===path.split('/').pop()|| (path==='/'&&a.dataset.page==='index'))a.classList.add('active')});
window.showToast=(msg)=>{const t=$('.toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)};
