const K='karyam',$=s=>document.querySelector(s),E=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const L={todo:'To do',sub:'In verification',done:'Completed',pend:'Pending'};
function seed(){const a='Acme Tech',p='1234';return{
users:[{id:1,name:'Maya Shah',email:'maya@acme.com',pass:p,role:'Manager',company:a,ok:1},
{id:2,name:'Liam Patel',email:'liam@acme.com',pass:p,role:'Team Leader',company:a,ok:1},
{id:3,name:'Aria Khan',email:'aria@acme.com',pass:p,role:'Team Member',company:a,ok:1},
{id:4,name:'Ben Roy',email:'ben@acme.com',pass:p,role:'Team Member',company:a,ok:1},
{id:5,name:'Noah Lee',email:'noah@nova.com',pass:p,role:'Manager',company:'Nova Labs',ok:1}],
projects:[{id:1,name:'Company Website',co:a,lead:2,mem:[{u:3,duty:'HTML and CSS pages'},{u:4,duty:'JavaScript features'}]}],
tasks:[{id:1,p:1,u:3,t:'Create homepage',s:'done',link:'https://github.com/example/homepage'},{id:2,p:1,u:3,t:'Create contact us page',s:'sub',link:'https://github.com/example/contact-page'},{id:3,p:1,u:3,t:'Create about page',s:'todo'},{id:4,p:1,u:4,t:'Add form validation',s:'done',link:'https://github.com/example/form-validation'},{id:5,p:1,u:4,t:'Build image slider',s:'pend'}]}}
let D;try{D=JSON.parse(sessionStorage.getItem(K))}catch(e){}D=D||seed();
const S={u:+sessionStorage.getItem('karyam_u')||null,v:'dash',m:'in',p:0,x:0};
const save=()=>{try{sessionStorage.setItem(K,JSON.stringify(D))}catch(e){}app()};
const U=i=>D.users.find(x=>x.id==i),me=()=>U(S.u),P=i=>D.projects.find(p=>p.id==i);if(!U(S.u))S.u=null;
const T=(p,u)=>D.tasks.filter(t=>t.p==p&&(u==null||t.u==u));
const nid=a=>Math.max(0,...a.map(x=>x.id))+1,msg=t=>{$('#m').textContent=t};
const pct=a=>a.length?Math.round(a.filter(t=>t.s=='done').length*100/a.length):0;
const bar=p=>`<div class="bar"><i style="width:${p}%"></i></div><small class="mut">${p}% of tasks completed</small>`;
const go=(v,p,u)=>{S.v=v;if(p)S.p=p;if(u)S.x=u;app()};
const out=()=>{S.u=null;sessionStorage.removeItem('karyam_u');S.m='in';app()};

function auth(){const r=S.m=='reg',cs=[...new Set(D.users.map(u=>u.company))];
$('#app').innerHTML=`<div id="auth"><div class="art"><div class="brand"><svg viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#2dd4bf"/><path d="M10 19l6 6 11-13" fill="none" stroke="#0b1730" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>Karyam</div>
<div><svg class="hero" viewBox="0 0 520 370" role="img" aria-label="Karyam project board illustration" font-family="system-ui,Arial,sans-serif"><g transform="translate(0,24)"><rect x="10" y="10" width="500" height="320" rx="20" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".2"/><circle cx="34" cy="34" r="4" fill="#fff" fill-opacity=".35"/><circle cx="50" cy="34" r="4" fill="#fff" fill-opacity=".35"/><circle cx="66" cy="34" r="4" fill="#fff" fill-opacity=".35"/><text x="88" y="38" font-size="12" fill="#fff" fill-opacity=".8">Company Website</text><rect x="28" y="58" width="148" height="256" rx="12" fill="#fff" fill-opacity=".06"/><circle cx="40" cy="76" r="4" fill="#f59e0b"/><text x="50" y="80" font-size="11" fill="#fff" fill-opacity=".8">To do</text><rect x="188" y="58" width="148" height="256" rx="12" fill="#fff" fill-opacity=".06"/><circle cx="200" cy="76" r="4" fill="#38bdf8"/><text x="210" y="80" font-size="11" fill="#fff" fill-opacity=".8">In verification</text><rect x="348" y="58" width="148" height="256" rx="12" fill="#fff" fill-opacity=".06"/><circle cx="360" cy="76" r="4" fill="#22c55e"/><text x="370" y="80" font-size="11" fill="#fff" fill-opacity=".8">Completed</text><rect x="40" y="94" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="52" y="116" font-size="11" font-weight="700" fill="#14213d">Create about page</text><text x="52" y="134" font-size="10" fill="#5f6b7a">Due 14 Oct</text><circle cx="148" cy="136" r="8" fill="#0f766e"/><rect x="40" y="164" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="52" y="186" font-size="11" font-weight="700" fill="#14213d">Add search bar</text><text x="52" y="204" font-size="10" fill="#5f6b7a">Due 18 Oct</text><circle cx="148" cy="206" r="8" fill="#14213d"/><rect x="200" y="94" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="212" y="116" font-size="11" font-weight="700" fill="#14213d">Contact us page</text><text x="212" y="134" font-size="10" fill="#5f6b7a">GitHub link added</text><circle cx="308" cy="136" r="8" fill="#c2410c"/><rect x="360" y="94" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="372" y="116" font-size="11" font-weight="700" fill="#14213d">Homepage</text><text x="372" y="134" font-size="10" fill="#5f6b7a">Verified by leader</text><circle cx="468" cy="136" r="8" fill="#0f766e"/><path d="M464 136l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="360" y="164" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="372" y="186" font-size="11" font-weight="700" fill="#14213d">Navbar</text><text x="372" y="204" font-size="10" fill="#5f6b7a">Verified by leader</text><circle cx="468" cy="206" r="8" fill="#14213d"/><path d="M464 206l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="360" y="234" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="372" y="256" font-size="11" font-weight="700" fill="#14213d">Form validation</text><text x="372" y="274" font-size="10" fill="#5f6b7a">Verified by leader</text><circle cx="468" cy="276" r="8" fill="#c2410c"/><path d="M464 276l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><rect x="372" y="0" width="148" height="46" rx="12" fill="#fff"/><text x="388" y="31" font-size="21" font-weight="700" fill="#0f766e">72%</text><text x="436" y="30" font-size="12" fill="#5f6b7a">complete</text></svg><h1>Plan it. Assign it. Verify it.</h1><ul><li>Separate access for Managers, Team Leaders and Team Members</li><li>Tasks count only after the Team Leader verifies them</li><li>Live progress for every member and every project</li></ul></div><div></div></div>
<div class="box"><div class="mbrand">Karyam</div><h2>${r?'Create your account':'Welcome back'}</h2><p class="mut" style="margin-bottom:16px">${r?'Managers set up their company. Everyone else joins once their manager approves.':'Log in to your workspace.'}</p>
${r?`<label>Full name</label><input id="n"><label>Role</label><select id="r"><option>Team Member</option><option>Team Leader</option><option>Manager</option></select><label>Company</label><input id="c" list="cl"><datalist id="cl">${cs.map(c=>`<option value="${E(c)}">`).join('')}</datalist>`:''}
<label>Email</label><input id="e" type="email"><label>Password</label><input id="p" type="password">
<div id="m" class="err"></div><button class="btn" onclick="${r?'reg()':'login()'}">${r?'Register':'Log in'}</button>
<p class="mut">${r?'Already registered?':'New user?'} <a href="#" onclick="S.m='${r?'in':'reg'}';app();return false">${r?'Log in':'Register here'}</a></p>
${r?'':'<p class="mut" style="margin-top:14px">Demo accounts (password 1234): maya@acme.com (Manager), liam@acme.com (Team Leader), aria@acme.com (Team Member)</p>'}</div></div>`}

function login(){const e=$('#e').value.trim().toLowerCase(),u=D.users.find(x=>x.email==e&&x.pass==$('#p').value);
if(!u)return msg('Email or password is incorrect.');if(!u.ok)return msg('Your manager has not approved your request yet.');S.u=u.id;sessionStorage.setItem('karyam_u',u.id);S.v='dash';app()}
function reg(){const n=$('#n').value.trim(),r=$('#r').value,c=$('#c').value.trim(),e=$('#e').value.trim().toLowerCase(),p=$('#p').value;
if(!n||!c||!e||!p)return msg('Fill in every field.');if(D.users.some(u=>u.email==e))return msg('This email is already registered.');
const mg=r=='Manager';if(!mg&&!D.users.some(u=>u.role=='Manager'&&u.company==c))return msg('No manager has set up this company yet.');
D.users.push({id:nid(D.users),name:n,email:e,pass:p,role:r,company:c,ok:mg?1:0});S.m='in';save();
msg(mg?'Account created. Log in now.':'Registered. Log in after your manager approves you.')}

function app(){if(!S.u)return auth();const u=me();
$('#app').innerHTML=`<header><b>Karyam</b><span>${E(u.name)}, ${u.role} at ${E(u.company)}</span><button class="btn g s" style="color:#fff;border-color:#fff" onclick="out()">Log out</button></header><main>${S.v=='proj'?proj():S.v=='prof'?prof():dash()}</main>`}

function dash(){const u=me(),mg=u.role=='Manager',ld=u.role=='Team Leader',
ps=D.projects.filter(p=>mg?p.co==u.company:ld?p.lead==u.id:p.mem.some(m=>m.u==u.id));let h='';
if(mg){const rq=D.users.filter(x=>x.company==u.company&&!x.ok);
h+=`<h2>Join requests</h2><div class="card">${rq.map(x=>`<div class="row"><span>${E(x.name)} wants to join as ${x.role}</span><span><button class="btn ok s" onclick="appr(${x.id},1)">Approve</button> <button class="btn w s" onclick="appr(${x.id},0)">Reject</button></span></div>`).join('')||'<p class="mut">No pending requests.</p>'}</div>
<h2>Create a project</h2><div class="card row"><input id="pn" placeholder="Project name"><select id="pl"><option value="">Select Team Leader</option>${D.users.filter(x=>x.company==u.company&&x.ok&&x.role=='Team Leader').map(x=>`<option value="${x.id}">${E(x.name)}</option>`).join('')}</select><button class="btn" onclick="newP()">Create project</button></div>`}
return h+`<h2>${mg?'Company projects':'Your projects'}</h2><div class="grid">`+(ps.map(p=>`<div class="card click" onclick="go('proj',${p.id})"><h3>${E(p.name)}</h3><p class="mut">Led by ${E(U(p.lead).name)}, ${p.mem.length} members</p>${bar(pct(T(p.id)))}</div>`).join('')||'<p class="mut">No projects yet.</p>')+'</div>'}

function proj(){const u=me(),p=P(S.p),ts=T(p.id),ed=p.lead==u.id||u.role=='Manager',
free=D.users.filter(x=>x.company==p.co&&x.ok&&x.role=='Team Member'&&!p.mem.some(m=>m.u==x.id));
return `<button class="btn g s" style="margin-top:16px" onclick="go('dash')">Back to projects</button><h2>${E(p.name)}</h2><p class="mut">Team Leader: ${E(U(p.lead).name)}</p>
<div class="card"><b>Overall project progress</b>${bar(pct(ts))}</div><h3 style="margin:18px 0 10px">Team members</h3>
<div class="grid">${p.mem.map(m=>{const x=U(m.u);return `<div class="card click" onclick="go('prof',${p.id},${m.u})"><div class="av">${E(x.name[0])}</div><b>${E(x.name)}</b><p class="mut">${x.role}</p><p>Duty: ${E(m.duty)}</p>${bar(pct(T(p.id,m.u)))}${ed?`<div class="mfoot"><button class="btn dg s" onclick="event.stopPropagation();remM(${m.u})">Remove member</button></div>`:''}</div>`}).join('')||'<p class="mut">No members yet.</p>'}</div>
${ed?`<div class="card"><h3>Add a member</h3><div class="row"><select id="am"><option value="">Select Team Member</option>${free.map(x=>`<option value="${x.id}">${E(x.name)}</option>`).join('')}</select><input id="ad" placeholder="Duty in this project"><button class="btn" onclick="addM()">Add member</button></div></div>
<div class="card"><h3>Assign a task</h3><div class="row"><select id="tm"><option value="">Select Team Member</option>${p.mem.map(m=>`<option value="${m.u}">${E(U(m.u).name)}</option>`).join('')}</select><input id="tt" placeholder="Task, for example Create homepage"><input id="td" type="date" title="Due date" style="max-width:160px;flex:none"><button class="btn" onclick="addT()">Assign task</button></div></div>`:''}`}

function prof(){const u=me(),p=P(S.p),x=U(S.x),m=p.mem.find(m=>m.u==x.id),ts=T(p.id,x.id),ld=p.lead==u.id,mg=u.role=='Manager';
return `<button class="btn g s" style="margin-top:16px" onclick="go('proj')">Back to project</button>
<div class="card" style="margin-top:14px"><div class="av">${E(x.name[0])}</div><h2 style="margin:0">${E(x.name)}</h2><p class="mut">${x.role} on ${E(p.name)}</p><p>Duty: ${E(m.duty)}</p>${bar(pct(ts))}</div><h3 style="margin:18px 0 10px">Assigned tasks</h3>`+
(ts.map(t=>{const late=t.due&&t.s!='done'&&t.due<new Date().toISOString().slice(0,10);return `<div class="card row"><div><b>${E(t.t)}</b><em class="chip ${t.s}">${L[t.s]}</em>
${t.due?`<p class="mut${late?' late':''}">Due ${E(t.due)}${late?' (overdue)':''}</p>`:''}
${t.link?`<p class="mut">${t.s=='done'?'Completed work':'Submitted work'}: <a href="${E(t.link)}" target="_blank" rel="noopener">${E(t.link)}</a></p>`:t.s=='done'?'<p class="mut">No work link was added.</p>':''}
${t.note&&t.s=='pend'?`<p class="mut late">Pending reason: ${E(t.note)}</p>`:''}</div><span class="row">
${u.id==t.u&&(t.s=='todo'||t.s=='pend')?`<input id="l${t.id}" type="url" placeholder="GitHub or work link" value="${E(t.link||'')}" style="min-width:220px"><button class="btn s" onclick="sub(${t.id})">Submit for verification</button>`:''}
${ld&&t.s=='sub'?`<button class="btn ok s" onclick="st(${t.id},'done')">Verify and complete</button>`:''}
${(ld||mg)&&t.s!='pend'?`<button class="btn w s" onclick="pend(${t.id})">Mark pending</button>`:''}
${ld||mg?`<button class="btn g s" onclick="delT(${t.id})">Delete</button>`:''}</span></div>`}).join('')||'<p class="mut">No tasks assigned yet.</p>')}

function appr(id,ok){if(ok)U(id).ok=1;else D.users=D.users.filter(x=>x.id!=id);save()}
function newP(){const n=$('#pn').value.trim(),l=$('#pl').value;if(!n||!l)return alert('Enter a project name and choose a Team Leader. A Team Leader must be approved first.');
D.projects.push({id:nid(D.projects),name:n,co:me().company,lead:+l,mem:[]});save()}
function addM(){const a=$('#am').value,d=$('#ad').value.trim();if(!a||!d)return alert('Choose a member and enter their duty.');P(S.p).mem.push({u:+a,duty:d});save()}
function addT(){const a=$('#tm').value,t=$('#tt').value.trim();if(!a||!t)return alert('Choose a member and enter the task.');D.tasks.push({id:nid(D.tasks),p:S.p,u:+a,t:t,s:'todo',due:$('#td').value});save()}
function sub(id){const l=$('#l'+id).value.trim();if(!/^https?:\/\/[^\s.]+\.\S+$/i.test(l))return alert('Add a valid link to your work, for example a GitHub link starting with https://');const t=D.tasks.find(t=>t.id==id);t.link=l;t.s='sub';save()}
function pend(id){const n=prompt('Why is this task pending? The team member will see this note.');if(n===null)return;const t=D.tasks.find(t=>t.id==id);t.note=n.trim()||'No reason given';t.s='pend';save()}
function delT(id){if(confirm('Delete this task?')){D.tasks=D.tasks.filter(t=>t.id!=id);save()}}
function remM(u){if(confirm('Remove this member and their tasks from the project?')){const p=P(S.p);p.mem=p.mem.filter(m=>m.u!=u);D.tasks=D.tasks.filter(t=>!(t.p==p.id&&t.u==u));save()}}
function st(id,s){D.tasks.find(t=>t.id==id).s=s;save()}
app();
