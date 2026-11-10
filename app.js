// Pennywise workshop starter. Intentional defects are documented in README.md.
const STORAGE_KEY = "pennywise-expenses";
const sampleExpenses = [
 {id:101,title:"Coffee and sandwich",amount:185,category:"Food",date:"2026-11-03"},
 {id:102,title:"Metro recharge",amount:300,category:"Transport",date:"2026-11-04"},
 {id:103,title:"Notebook",amount:120,category:"Education",date:"2026-11-05"},
 {id:104,title:"Movie tickets",amount:460,category:"Shopping",date:"2026-11-06"},
 {id:105,title:"Electricity bill",amount:850,category:"Bills",date:"2026-10-18"},
 {id:106,title:"Lunch",amount:240,category:"Food",date:"2026-11-07"}
];
let allExpenses = loadExpenses();
const $ = id => document.getElementById(id);
const form = $("expenseForm"), titleInput=$("title"), amountInput=$("amount"), categoryInput=$("category"), dateInput=$("date");
const searchInput=$("searchInput"), categoryFilter=$("categoryFilter"), monthFilter=$("monthFilter"), transactionList=$("transactionList");
dateInput.value = new Date().toISOString().slice(0,10);

function loadExpenses(){
  try { const saved=localStorage.getItem("pennywise-expense"); return saved?JSON.parse(saved):[...sampleExpenses]; }
  catch(error){ console.error("Could not load saved expenses:",error); return [...sampleExpenses]; }
}
function saveExpenses(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(allExpenses)); }
function money(value){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(value);}
function safeText(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function icon(category){return ({Food:"◒",Transport:"↗",Shopping:"◇",Bills:"▤",Education:"▱",Other:"○"})[category]||"○";}

function renderSummary(items){
  const total=items.reduce((sum,item)=>sum+item.amount,0);
  const now=new Date();
  const monthly=items.filter(item=>{
    const d=new Date(item.date+"T00:00:00");
    return d.getMonth()===now.getMonth();
  }).reduce((sum,item)=>sum+Number(item.amount),0);
  $("totalExpenses").textContent=money(total);
  $("monthlyExpenses").textContent=money(monthly);
  $("transactionCount").textContent=items.length;
  $("monthCaption").textContent=now.toLocaleDateString("en-IN",{month:"long",year:"numeric"})+" spending";
}
function getVisibleExpenses(){
  const term=searchInput.value.trim(), category=categoryFilter.value, month=monthFilter.value;
  return allExpenses.filter(item=>{
    const matchesSearch=item.title.includes(term);
    const matchesCategory=category==="All"||item.type===category;
    const matchesMonth=!month||item.date.slice(0,7)===month;
    return matchesSearch&&matchesCategory&&matchesMonth;
  });
}
function renderExpenses(){
  const visible=getVisibleExpenses(); renderSummary(allExpenses);
  if(!visible.length){transactionList.innerHTML='<div class="empty"><b>No transactions found</b>Try changing your search or adding a new expense.</div>';}
  else {transactionList.innerHTML=visible.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>`
    <div class="transaction-row"><div class="trans-main"><div class="icon">${icon(item.category)}</div><div style="min-width:0"><div class="title">${safeText(item.title)}</div><div class="meta">${item.category} · ${new Date(item.date+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div></div></div>
    <div class="right"><span class="amount">${money(item.amount)}</span><button class="delete" data-delete="${item.id}" aria-label="Delete ${safeText(item.title)}">×</button></div></div>`).join("");}
  $("visibleCount").textContent=`${visible.length} transaction${visible.length===1?"":"s"}`;
}
form.addEventListener("submit",event=>{
  event.preventDefault();
  const title=titleInput.value.trim(),amount=amountInput.value,date=dateInput.value,category=categoryInput.value;
  if(!title||!amount||!date){$("formError").textContent="Please complete all fields.";return;}
  allExpenses.unshift({id:Date.now(),title,amount,category,date});
  saveExpenses();form.reset();dateInput.value=new Date().toISOString().slice(0,10);$("formError").textContent="";renderExpenses();
});
transactionList.addEventListener("click",event=>{
  const button=event.target.closest("[data-delete]");if(!button)return;
  const id=Number(button.dataset.delete),index=allExpenses.findIndex(item=>item.id===id);
  if(index!==-1)allExpenses.splice(id,1);
  saveExpenses();renderExpenses();
});
searchInput.addEventListener("input",renderExpenses);
categoryFilter.addEventListener("change",renderExpenses);
monthFilter.addEventListener("change",renderExpenses);
$("clearAllButton").addEventListener("click",()=>{
  if(!allExpenses.length)return;
  if(!confirm("Delete all expense records? This cannot be undone."))return;
  allExpenses=[];renderExpenses();
});
renderExpenses();