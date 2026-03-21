let articles=[
 {name:"OM4 fiberkabel",unit:"m",price:12.50,type:"fiber"},
 {name:"Cat6 kopparkabel",unit:"m",price:6.90,type:"koppar"},
 {name:"ODF 12",unit:"st",price:1450,type:"fiber"},
 {name:"Patchpanel Cat6",unit:"st",price:590,type:"koppar"}
];
let rows=[];

function render(){
 let app=document.getElementById('app');
 app.innerHTML='';

 app.innerHTML+=`<div>
 <button onclick="addRow()">Lägg till rad</button>
 <button onclick="saveNamed()">Spara som</button>
 <button onclick="loadNamed()">Ladda</button>
 <button onclick="resetCalc()">Reset</button>
 <button onclick="exportPDF()">PDF</button>
 </div>`;

 app.innerHTML+=`<h3>Fiber/Koppar</h3>
 <select id='techSel' onchange='render()'>
  <option value='fiber'>Fiber</option>
  <option value='koppar'>Koppar</option>
 </select>
 <h3>Nätklass</h3>
 <select id='netSel' onchange='render()'>
  <option value='gult'>Gult nät</option>
  <option value='rött'>Rött nät</option>
 </select>`;

 // Table
 let table=document.createElement('table');
 table.innerHTML='<tr><th>Artikel</th><th>Antal</th><th>Enhet</th><th>Pris</th><th>Summa</th><th></th></tr>';

 let total=0;
 let tech=document.getElementById('techSel').value;
 let filtered=articles.filter(a=>a.type===tech);

 rows.forEach((r,i)=>{
   let tr=document.createElement('tr');
   let opts=filtered.map(a=>`<option value="${a.name}" ${a.name===r.article?'selected':''}>${a.name}</option>`).join('');
   tr.innerHTML=`
     <td><select onchange="updateArt(${i}, this.value)"><option value=''>Välj</option>${opts}</select></td>
     <td><input type='number' value='${r.qty}' onchange="updateQty(${i}, this.value)"></td>
     <td>${r.unit||''}</td>
     <td>${r.price.toLocaleString('sv-SE',{minimumFractionDigits:2})} kr</td>
     <td>${(r.qty*r.price).toLocaleString('sv-SE',{minimumFractionDigits:2})} kr</td>
     <td><button onclick="delRow(${i})">X</button></td>
   `;
   total+=r.qty*r.price;
   table.appendChild(tr);
 });

 app.appendChild(table);
 app.innerHTML+=`<h2>Total: ${total.toLocaleString('sv-SE',{minimumFractionDigits:2})} kr</h2>`;

 renderEditor();
}

function addRow(){ rows.push({article:'',qty:0,unit:'',price:0}); render(); }
function delRow(i){ rows.splice(i,1); render(); }
function updateArt(i,name){ let a=articles.find(x=>x.name===name); if(!a){ rows[i]={article:'',qty:0,unit:'',price:0}; render(); return;} rows[i].article=a.name; rows[i].unit=a.unit; rows[i].price=a.price; render(); }
function updateQty(i,val){ rows[i].qty=Number(val); render(); }
function resetCalc(){ rows=[]; render(); }

function saveNamed(){ let n=prompt('Namn på kalkyl:'); if(!n)return; localStorage.setItem('calc_'+n,JSON.stringify(rows)); alert('Sparad.'); }
function loadNamed(){ let keys=Object.keys(localStorage).filter(k=>k.startsWith('calc_')); let n=prompt('Tillgängliga kalkyler:
'+keys.join('
')+'

Ange namn:'); if(!n)return; rows=JSON.parse(localStorage.getItem(n)); render(); }

function exportPDF(){ const {jsPDF}=window.jspdf; let pdf=new jsPDF(); pdf.text('Kalkyl v3 FIX',10,10); let y=20; rows.forEach(r=>{ pdf.text(`${r.article}  ${r.qty} ${r.unit} ${(r.qty*r.price).toFixed(2)} kr`,10,y); y+=8; }); pdf.save('kalkyl_v3.pdf'); }

function renderEditor(){
 let div=document.createElement('div'); div.id='editor';
 div.innerHTML='<h3>Artikelregister</h3>';
 articles.forEach((a,i)=>{ div.innerHTML+=`<div>${a.name} (${a.unit}) ${a.price} kr <button onclick="removeArt(${i})">Ta bort</button></div>`; });
 div.innerHTML+=`<h4>Lägg till ny artikel</h4>
 Namn: <input id='na'> Enhet: <input id='un'> Pris: <input id='pr' type='number' step='0.01'>
 <select id='ty'><option value='fiber'>Fiber</option><option value='koppar'>Koppar</option></select>
 <button onclick='addArt()'>Lägg till</button>`;
 document.getElementById('app').appendChild(div);
}
function addArt(){ let n=document.getElementById('na').value; let u=document.getElementById('un').value; let p=Number(document.getElementById('pr').value); let t=document.getElementById('ty').value; if(!n||!u||!p){alert('Fyll i allt');return;} articles.push({name:n,unit:u,price:p,type:t}); render(); }
function removeArt(i){ articles.splice(i,1); render(); }

window.onload=render;