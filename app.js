const STORAGE="people-organizer-v2";
const DEFAULTS={
 relationships:["Family","Relative","Friend","Classmate","Teacher / Mentor","Online friend","Acquaintance","Professional contact","Neighbor"],
 categories:["Close circle","School","Family","Networking","Mentor","Collaborator","Online","Sports","Business"],
 traits:["Honest","Loyal","Respectful","Kind","Helpful","Ambitious","Disciplined","Confident","Calm","Funny","Curious","Competitive","Selfish","Arrogant","Manipulative","Jealous","Unreliable","Negative","Controlling","Impulsive"],
 interests:["Coding","Business","Sports","Fitness","Gaming","Science","Art","Reading","Technology","Entrepreneurship","Academics"]
};
let state=JSON.parse(localStorage.getItem(STORAGE)||"null")||{
 people:[],categories:[...DEFAULTS.categories],traits:[...DEFAULTS.traits],interests:[...DEFAULTS.interests],theme:"dark",lastSaved:null
};
let picks={categories:[],traits:[],interests:[]};

const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
function persist(){state.lastSaved=new Date().toISOString();localStorage.setItem(STORAGE,JSON.stringify(state));updateAll();}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function initials(n){return n.split(/\s+/).filter(Boolean).map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function toast(m){let t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function applyTheme(){document.documentElement.dataset.theme=state.theme;$("themeBtn").textContent=state.theme==="dark"?"☀ Light mode":"☾ Dark mode"}
function populateSelects(){
 $("relationship").innerHTML=DEFAULTS.relationships.map(x=>`<option>${esc(x)}</option>`).join("");
 $("relationshipFilter").innerHTML='<option value="">All relationships</option>'+DEFAULTS.relationships.map(x=>`<option>${esc(x)}</option>`).join("");
 $("categoryFilter").innerHTML='<option value="">All categories</option>'+state.categories.map(x=>`<option>${esc(x)}</option>`).join("");
}
function renderPickers(){
 $("categoryPicker").innerHTML=state.categories.map(x=>chip("categories",x)).join("");
 $("traitPicker").innerHTML=state.traits.map(x=>chip("traits",x)).join("");
 $("interestPicker").innerHTML=state.interests.map(x=>chip("interests",x)).join("");
}
function chip(type,x){return `<button type="button" class="chip ${picks[type].includes(x)?"selected":""}" onclick="togglePick('${type}',${JSON.stringify(x)})">${esc(x)}</button>`}
window.togglePick=(type,x)=>{let a=picks[type],i=a.indexOf(x);i>=0?a.splice(i,1):a.push(x);renderPickers()}
function showView(v){
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===v));
 document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));
 $(v+"View").classList.remove("hidden");
 const titles={dashboard:["Dashboard","A clear overview of your people and relationships."],people:["People","Search, filter and manage every person."],categories:["Categories","Separate reusable categories from traits and interests."],traits:["Traits","Build the trait library you actually use."],interests:["Interests","Build the interest library you actually use."],backup:["Backup & Data","Export, import and protect your local data."]};
 $("pageTitle").textContent=titles[v][0];$("pageSubtitle").textContent=titles[v][1];
}
window.showView=showView;
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showView(n.dataset.view));
document.querySelectorAll("[data-go]").forEach(n=>n.onclick=()=>showView(n.dataset.go));
function openPerson(person=null){
 picks={categories:[...(person?.categories||[])],traits:[...(person?.traits||[])],interests:[...(person?.interests||[])]};
 $("dialogTitle").textContent=person?"Edit person":"Add person";
 $("personId").value=person?.id||"";$("name").value=person?.name||"";
 $("relationship").value=person?.relationship||DEFAULTS.relationships[0];$("trust").value=person?.trust||"Medium";
 $("closeness").value=person?.closeness||3;$("reliability").value=person?.reliability||"Medium";$("influence").value=person?.influence||"Neutral";
 $("met").value=person?.met||"";$("lastInteraction").value=person?.lastInteraction||"";$("followUp").value=person?.followUp||"";
 $("favorite").value=String(person?.favorite||false);$("contact").value=person?.contact||"";$("strengths").value=person?.strengths||"";
 $("goals").value=person?.goals||"";$("notes").value=person?.notes||"";renderPickers();$("personDialog").showModal();
}
window.openPerson=openPerson;
function closeDialog(id){$(id).close()}
window.closeDialog=closeDialog;
$("personForm").onsubmit=e=>{
 e.preventDefault();let id=$("personId").value;
 let p={id:id||crypto.randomUUID(),name:$("name").value.trim(),relationship:$("relationship").value,trust:$("trust").value,closeness:+$("closeness").value,
 reliability:$("reliability").value,influence:$("influence").value,met:$("met").value.trim(),lastInteraction:$("lastInteraction").value,
 followUp:$("followUp").value,favorite:$("favorite").value==="true",contact:$("contact").value.trim(),categories:[...picks.categories],
 traits:[...picks.traits],interests:[...picks.interests],strengths:$("strengths").value.trim(),goals:$("goals").value.trim(),
 notes:$("notes").value.trim(),updatedAt:new Date().toISOString()};
 if(!p.name)return;
 let i=state.people.findIndex(x=>x.id===id);i>=0?state.people[i]=p:state.people.unshift(p);
 persist();$("personDialog").close();toast(id?"Person updated":"Person added");
};
function personCard(p){
 let overdue=p.followUp&&p.followUp<=today();
 return `<article class="person-card"><div class="person-top"><div class="person-head"><div class="avatar">${esc(initials(p.name))}</div><div><h3 class="person-name">${esc(p.name)}</h3><div class="meta">${esc(p.relationship)} · ${p.closeness}/5 closeness</div></div></div>${p.favorite?'<span class="badge fav">★ Favorite</span>':''}</div>
 <div class="card-section"><div class="label">Trust · Reliability · Influence</div><div class="meta">${esc(p.trust)} · ${esc(p.reliability)} · ${esc(p.influence)}</div></div>
 <div class="card-section"><div class="label">Categories</div>${p.categories?.length?p.categories.map(x=>`<span class="badge">${esc(x)}</span>`).join(""):"<span class=meta>None</span>"}</div>
 <div class="card-section"><div class="label">Traits</div>${p.traits?.length?p.traits.map(x=>`<span class="badge">${esc(x)}</span>`).join(""):"<span class=meta>None</span>"}</div>
 <div class="card-section"><div class="label">Interests</div>${p.interests?.length?p.interests.map(x=>`<span class="badge">${esc(x)}</span>`).join(""):"<span class=meta>None</span>"}</div>
 ${p.followUp?`<div class="card-section"><div class="label">Follow-up</div><div class="meta">${esc(p.followUp)} ${overdue?'<span style="color:var(--danger)">· due</span>':''}</div></div>`:""}
 ${p.notes?`<div class="card-section"><div class="label">Notes</div><div class="notes">${esc(p.notes)}</div></div>`:""}
 <div class="card-actions"><button class="small-btn" onclick="editPerson('${p.id}')">Edit</button><button class="small-btn delete" onclick="deletePerson('${p.id}')">Delete</button></div></article>`;
}
window.editPerson=id=>openPerson(state.people.find(x=>x.id===id));
window.deletePerson=id=>{if(confirm("Delete this person?")){state.people=state.people.filter(x=>x.id!==id);persist();toast("Person deleted")}};
function filteredPeople(){
 let q=$("search").value.trim().toLowerCase(),r=$("relationshipFilter").value,t=$("trustFilter").value,c=$("categoryFilter").value;
 let arr=state.people.filter(p=>{let hay=JSON.stringify(p).toLowerCase();return(!q||hay.includes(q))&&(!r||p.relationship===r)&&(!t||p.trust===t)&&(!c||(p.categories||[]).includes(c))});
 let s=$("sortFilter").value;
 arr.sort((a,b)=>s==="name"?a.name.localeCompare(b.name):s==="closeness"?b.closeness-a.closeness:s==="trust"?({High:0,Medium:1,Low:2,"Do not trust":3}[a.trust]-({High:0,Medium:1,Low:2,"Do not trust":3}[b.trust])):s==="followup"?(a.followUp||"9999").localeCompare(b.followUp||"9999"):b.updatedAt.localeCompare(a.updatedAt));
 return arr;
}
function renderPeople(){let arr=filteredPeople();$("peopleGrid").innerHTML=arr.map(personCard).join("");$("resultCount").textContent=`${arr.length} of ${state.people.length} people`;$("empty").classList.toggle("hidden",arr.length>0)}
["search","relationshipFilter","trustFilter","categoryFilter","sortFilter"].forEach(id=>$(id).addEventListener("input",renderPeople));
$("clearFilters").onclick=()=>{["search","relationshipFilter","trustFilter","categoryFilter"].forEach(id=>$(id).value="");$("sortFilter").value="updated";renderPeople()};
function updateDashboard(){
 $("statTotal").textContent=state.people.length;$("statTrust").textContent=state.people.filter(p=>p.trust==="High").length;
 $("statClose").textContent=state.people.filter(p=>+p.closeness>=4).length;$("statFollow").textContent=state.people.filter(p=>p.followUp&&p.followUp<=today()).length;
 let counts={};state.people.forEach(p=>counts[p.relationship]=(counts[p.relationship]||0)+1);let max=Math.max(1,...Object.values(counts));
 $("relationshipMix").innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>`<div class="mix-row"><div class="mix-label"><span>${esc(k)}</span><b>${v}</b></div><div class="bar"><i style="width:${v/max*100}%"></i></div></div>`).join("")||'<p class="meta">Add people to see your relationship mix.</p>';
 $("recentPeople").innerHTML=state.people.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,5).map(p=>`<div class="mini-person"><div class="avatar">${esc(initials(p.name))}</div><div><b>${esc(p.name)}</b><div class="mini-meta">${esc(p.relationship)} · ${esc(p.trust)} trust</div></div></div>`).join("")||'<p class="meta">No people yet.</p>';
}
function renderManager(type){
 let list=state[type];$(type+"List").innerHTML=list.map((x,i)=>`<div class="manager-card"><div><span>${esc(x)}</span><small>${state.people.filter(p=>(p[type]||[]).includes(x)).length} people</small></div><div class="manager-actions"><button class="icon-btn" title="Rename" onclick="renameItem('${type}',${i})">✎</button><button class="icon-btn" title="Delete" onclick="removeItem('${type}',${i})">×</button></div></div>`).join("");
}
function openManager(type){$("managerType").value=type;$("managerTitle").textContent="Add "+type.slice(0,-1);$("managerName").value="";$("managerDialog").showModal()}
window.openManager=openManager;
$("managerForm").onsubmit=e=>{e.preventDefault();let type=$("managerType").value,n=$("managerName").value.trim();if(!n)return;if(state[type].some(x=>x.toLowerCase()===n.toLowerCase())){toast("Already exists");return}state[type].push(n);persist();$("managerDialog").close();toast("Added "+n)};
window.removeItem=(type,i)=>{let item=state[type][i];if(confirm(`Delete "${item}" from the library? Existing people will keep their saved label.`)){state[type].splice(i,1);persist();toast("Removed")}};
window.renameItem=(type,i)=>{let old=state[type][i],n=prompt("Rename item:",old);if(!n||!n.trim()||state[type].includes(n.trim()))return;n=n.trim();state[type][i]=n;state.people.forEach(p=>{if((p[type]||[]).includes(old)){p[type]=p[type].map(x=>x===old?n:x)}});persist();toast("Renamed")};
function updateAll(){applyTheme();populateSelects();renderPickers();renderPeople();updateDashboard();renderManager("categories");renderManager("traits");renderManager("interests");$("peopleCount").textContent=state.people.length;$("lastSaved").textContent=state.lastSaved?new Date(state.lastSaved).toLocaleString():"—"}
function exportData(){let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="people-organizer-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup downloaded")}
window.exportData=exportData;
function csvCell(x){return `"${String(x??"").replace(/"/g,'""')}"`}
function exportCSV(){let cols=["Name","Relationship","Trust","Closeness","Reliability","Influence","Favorite","Categories","Traits","Interests","How met","Last interaction","Next follow-up","Contact","Strengths","Goals","Notes"];let rows=state.people.map(p=>[p.name,p.relationship,p.trust,p.closeness,p.reliability,p.influence,p.favorite?"Yes":"No",(p.categories||[]).join("; "),(p.traits||[]).join("; "),(p.interests||[]).join("; "),p.met,p.lastInteraction,p.followUp,p.contact,p.strengths,p.goals,p.notes].map(csvCell).join(","));let blob=new Blob([[cols.map(csvCell).join(","),...rows].join("\n")],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="people-organizer.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV downloaded")}
window.exportCSV=exportCSV;
$("importInput").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!Array.isArray(x.people)||!Array.isArray(x.categories)||!Array.isArray(x.traits)||!Array.isArray(x.interests))throw 0;state=x;persist();toast("Backup restored")}catch{alert("Invalid People Organizer backup.")}};r.readAsText(f)};
function clearEverything(){if(confirm("Delete ALL people, categories, traits, interests and settings? Export a backup first if needed.")){let theme=state.theme;state={people:[],categories:[...DEFAULTS.categories],traits:[...DEFAULTS.traits],interests:[...DEFAULTS.interests],theme,lastSaved:null};persist();toast("All data cleared")}}
window.clearEverything=clearEverything;
$("themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";persist()};
$("addBtn").onclick=()=>openPerson();
$("lockBtn").onclick=()=>{ $("app").classList.add("hidden");$("lockScreen").classList.remove("hidden");$("pinInput").value="";$("pinInput").focus() };
function unlock(){if($("pinInput").value==="0000"){$("lockScreen").classList.add("hidden");$("app").classList.remove("hidden");$("pinError").textContent="";updateAll()}else $("pinError").textContent="Incorrect PIN."}
$("unlockBtn").onclick=unlock;$("pinInput").addEventListener("keydown",e=>{if(e.key==="Enter")unlock()});
applyTheme();updateAll();$("pinInput").focus();
