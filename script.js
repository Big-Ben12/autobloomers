const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
const video=document.querySelector('video'),motion=matchMedia('(prefers-reduced-motion: reduce)');function updateVideo(){if(motion.matches)video.pause();else video.play().catch(()=>{})}updateVideo();motion.addEventListener('change',updateVideo);
document.querySelectorAll('[data-choice]').forEach(a=>a.addEventListener('click',()=>document.querySelector('[name=condition]').value=a.dataset.choice));
document.querySelector('#enquiry-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const body=`Hello Autobloomers,\n\nMy name is ${f.get('name')}.\nI am interested in: ${f.get('condition')}\nMake / model: ${f.get('vehicle')}\n\n${f.get('message')}\n\nPlease contact me to discuss the next steps.`;location.href=`mailto:autobloomers@gmail.com?subject=${encodeURIComponent('Vehicle enquiry — '+f.get('vehicle'))}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='Your email draft is ready in your email app. If it did not open, email autobloomers@gmail.com directly.'});
document.querySelector('#year').textContent=new Date().getFullYear();
// Add real Autobloomers photos here. Paths are relative to index.html.
// Example: {title:'Vehicle name',before:'assets/before1.jpg',after:'assets/after1.jpg'}
const repairProjects=Array.from({length:3},(_,i)=>({title:`Repair showcase ${String(i+1).padStart(2,'0')}`,before:'assets/placeholder-before.svg',after:'assets/placeholder-after.svg',placeholder:true}));
// Example: {title:'Vehicle name',image:'assets/finished1.jpg'}
const finishedVehicles=[];
const repairRoot=document.querySelector('#comparison-gallery');
if(repairProjects.length){repairRoot.className='comparison-grid';repairProjects.forEach((p,i)=>{const card=document.createElement('article');const view=document.createElement('div');view.className='comparison';for(const side of ['after','before']){const img=document.createElement('img');img.src=p[side];img.alt=`${p.title} — ${side}`;img.className=side;img.loading='lazy';view.append(img)}const labels=document.createElement('div');labels.className='compare-labels';labels.innerHTML='<span>Before</span><span>After</span>';view.append(labels);const handle=document.createElement('span');handle.className='compare-handle';handle.setAttribute('aria-hidden','true');handle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m8 7-5 5 5 5m8-10 5 5-5 5M12 5v14"/></svg>';view.append(handle);const range=document.createElement('input');range.type='range';range.min=0;range.max=100;range.value=50;range.setAttribute('aria-label',`Compare before and after: ${p.title}`);range.addEventListener('input',()=>view.style.setProperty('--split',range.value+'%'));view.append(range);const title=document.createElement('h3');title.className='project-title';title.textContent=p.title;card.append(view,title);repairRoot.append(card)})}
const finishedRoot=document.querySelector('#finished-gallery');if(finishedVehicles.length){document.querySelector('.finished-note').hidden=true;finishedRoot.className='finished-grid';finishedVehicles.forEach(p=>{const a=document.createElement('a');a.href=p.image;a.target='_blank';a.rel='noopener';const img=document.createElement('img');img.src=p.image;img.alt=p.title;img.loading='lazy';const title=document.createElement('h3');title.textContent=p.title;title.className='project-title';a.append(img,title);finishedRoot.append(a)})}

// Replace sample records with confirmed stock. Set sample:false and supply real photos/details.
const carsForSale=[
 {id:'SAMPLE-01',title:'2022 Honda Accord',condition:'used',location:'Ghana',sample:true},
 {id:'SAMPLE-02',title:'2023 Toyota RAV4',condition:'used',location:'USA',sample:true},
 {id:'SAMPLE-03',title:'2021 Hyundai Elantra',condition:'repairable',location:'USA',sample:true}
];
const labels={new:'New',used:'Used',repairable:'Repairable'};
const choices={new:'New vehicle',used:'Clean used vehicle',repairable:'Repairable vehicle'};
const saleRoot=document.querySelector('#sale-grid'),dialog=document.querySelector('#vehicle-dialog');
let lastDetailButton;
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el}
function enquire(car){dialog.close();document.querySelector('[name=condition]').value=choices[car.condition]||'Help me decide';document.querySelector('[name=vehicle]').value=car.title;document.querySelector('[name=message]').value=car.sample?`I am interested in a vehicle like the ${car.title} example. Please let me know what is available.`:`Please send more information about ${car.title} (reference ${car.id}), including availability and pricing.`;location.hash='enquiry';document.querySelector('[name=name]').focus({preventScroll:true})}
function details(car,button){
 lastDetailButton=button;const root=document.querySelector('#vehicle-detail-content');root.replaceChildren();
 const image=element('img','detail-image');image.src=car.image||'assets/vehicle-placeholder.svg';image.alt=car.image?car.title:'Vehicle photograph not supplied';root.append(image);
 const body=element('div','detail-body');body.append(element('p','sale-tag',car.sample?'Sample listing · Not confirmed stock':'Vehicle details'));
 const title=element('h2','',car.title);title.id='vehicle-title';body.append(title);
 body.append(element('p','detail-summary',car.sample?'This example demonstrates the listing layout. Vehicle availability, location, condition, and specifications must be confirmed by Autobloomers.':car.description||'Contact our team for further information.'));
 const list=element('dl','vehicle-specs');
 for(const [name,value] of [['Location',car.location],['Condition',labels[car.condition]],['Price',car.price],['Mileage',car.mileage],['Transmission',car.transmission],['Fuel type',car.fuel],['Engine',car.engine],['Exterior colour',car.colour],['Stock reference',car.sample?'Sample only':car.id]]){list.append(element('dt','',name),element('dd','',value||'To be confirmed'))}
 body.append(list);
 if(car.condition==='repairable')body.append(element('p','repair-note',car.damage||'Damage details and repair requirements: to be confirmed.'));
 const ask=element('button','button',car.sample?'Ask about a similar car':'Enquire about this car');ask.type='button';ask.addEventListener('click',()=>enquire(car));body.append(ask);root.append(body);dialog.showModal();dialog.scrollTop=0;document.body.classList.add('dialog-open');
}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');lastDetailButton?.focus({preventScroll:true})});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function renderCars(filter='all'){
 const items=carsForSale.filter(car=>filter==='all'||car.condition===filter);
 document.querySelector('#inventory-note').textContent=carsForSale.some(c=>c.sample)?'Sample vehicle listings shown for preview. These are not confirmed vehicles for sale.':'Contact our team to confirm availability, condition, and pricing.';
 saleRoot.replaceChildren();items.forEach(car=>{
 const card=element('article','sale-card'),img=element('img');img.src=car.image||'assets/vehicle-placeholder.svg';img.alt=car.image?car.title:'Vehicle photograph coming soon';img.loading='lazy';card.append(img);
 const body=element('div','sale-card-body');body.append(element('p','sale-tag',car.sample?'Sample listing':'For sale'),element('h3','',car.title));
 const meta=element('div','vehicle-meta');meta.append(element('span','',car.location),element('span','',labels[car.condition]));body.append(meta,element('p','sale-price',car.price||'Price to be confirmed'));
 const button=element('button','full-details','Full Details');button.type='button';button.setAttribute('aria-label',`Full Details: ${car.title}`);button.addEventListener('click',()=>details(car,button));body.append(button);card.append(body);saleRoot.append(card);
 });document.querySelector('#sale-status').textContent=items.length?`${items.length} vehicle${items.length===1?'':'s'} shown.`:'No vehicles listed in this category yet. Contact us to discuss your preference.';
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCars(button.dataset.filter)}));renderCars();
