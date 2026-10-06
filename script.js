// Karyam - Project Management System
// Syllabus topics used are tagged in comments: [Variables] [Loops] [Functions] [Arrays] [Objects] [Classes]
// [Closure] [Destructuring] [Spread] [DOM] [Events] [Bootstrap]

// ---------- [Variables] const, let, data types ----------
const KEY = "karyam";
const STATUS = { todo: "To do", sub: "In verification", done: "Completed", pend: "Pending" };   // [Objects]
const BADGE = { todo: "secondary", sub: "info", done: "success", pend: "warning" };
const session = { user: null, view: "dash", mode: "login", pid: 0, uid: 0 };
let db;        // all users, projects and tasks
let nextId;    // id generator (closure)
let dialog;    // Bootstrap modal

// ---------- [Objects] object with methods and "this" ----------
const store = {
  data: null,
  load() { const raw = sessionStorage.getItem(KEY); this.data = raw ? JSON.parse(raw) : seed(); },
  save() { sessionStorage.setItem(KEY, JSON.stringify(this.data)); }
};

function seed() {
  const co = "Acme Tech", pw = "1234";
  return {
    users: [
      { id: 1, name: "Maya Shah", email: "maya@acme.com", pass: pw, role: "Manager", company: co, ok: true },
      { id: 2, name: "Liam Patel", email: "liam@acme.com", pass: pw, role: "Team Leader", company: co, ok: true },
      { id: 3, name: "Aria Khan", email: "aria@acme.com", pass: pw, role: "Team Member", company: co, ok: true },
      { id: 4, name: "Ben Roy", email: "ben@acme.com", pass: pw, role: "Team Member", company: co, ok: true },
      { id: 5, name: "Noah Lee", email: "noah@nova.com", pass: pw, role: "Manager", company: "Nova Labs", ok: true }
    ],
    projects: [{ id: 6, name: "Company Website", co: co, lead: 2, mem: [{ u: 3, duty: "HTML and CSS pages" }, { u: 4, duty: "JavaScript features" }] }],
    tasks: [
      { id: 7, p: 6, u: 3, t: "Create homepage", s: "done", link: "https://github.com/example/homepage" },
      { id: 8, p: 6, u: 3, t: "Create contact us page", s: "sub", link: "https://github.com/example/contact-page" },
      { id: 9, p: 6, u: 3, t: "Create about page", s: "todo" },
      { id: 10, p: 6, u: 4, t: "Add form validation", s: "done", link: "https://github.com/example/form-validation" },
      { id: 11, p: 6, u: 4, t: "Build image slider", s: "pend", note: "Slider breaks on mobile screens" }
    ]
  };
}

// ---------- [Classes] class, constructor, extends, super, [Destructuring] ----------
class Person {
  constructor({ id, name, email, pass, role, company, ok }) {
    this.id = id; this.name = name; this.email = email; this.pass = pass;
    this.role = role; this.company = company; this.ok = ok;
  }
  canManage(p) { return false; }
  isLeaderOf(p) { return false; }
}
class Manager extends Person {
  constructor(raw) { super(raw); this.isAdmin = true; }
  canManage(p) { return p.co === this.company; }
}
class TeamLeader extends Person {
  canManage(p) { return p.lead === this.id; }
  isLeaderOf(p) { return p.lead === this.id; }
}
class TeamMember extends Person {}

function makeUser(raw) {            // [Conditionals] switch
  switch (raw.role) {
    case "Manager": return new Manager(raw);
    case "Team Leader": return new TeamLeader(raw);
    default: return new TeamMember(raw);
  }
}
const currentUser = () => makeUser(byId(db.users, session.user));   // [Functions] arrow function

// ---------- [Closure] counter remembers n ----------
function makeCounter(n) { return () => ++n; }
function maxId() {
  let m = 0;
  for (const list of [db.users, db.projects, db.tasks]) {          // [Loops] for-of
    for (const x of list) { if (x.id > m) m = x.id; }
  }
  return m;
}

// ---------- [Loops] while, for, for-of, for-in ----------
function byId(list, id) {
  let i = 0;
  while (i < list.length) { if (list[i].id === Number(id)) return list[i]; i++; }
  return null;
}
function tasksOf(pid, uid) {
  const out = [];
  for (const t of db.tasks) { if (t.p === pid && (uid === undefined || t.u === uid)) out.push(t); }   // [Arrays] push
  return out;
}
function isMember(p, id) { for (const m of p.mem) { if (m.u === id) return true; } return false; }
function visibleProjects(u) {
  const out = [];
  for (const p of db.projects) {
    if (u.role === "Manager" ? p.co === u.company : u.role === "Team Leader" ? p.lead === u.id : isMember(p, u.id)) out.push(p);
  }
  return out;
}
function countStatus(list, s) { let n = 0; for (const t of list) { if (t.s === s) n += 1; } return n; }

// ---------- [Functions] recursion ----------
function countDone(list, i = 0) {
  if (i >= list.length) return 0;
  return (list[i].s === "done" ? 1 : 0) + countDone(list, i + 1);
}
const percent = list => (list.length ? Math.round(countDone(list) * 100 / list.length) : 0);

// ---------- [DOM] helpers ----------
const esc = s => String(s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");
const val = id => document.getElementById(id).value.trim();
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
// [Bootstrap] progress bar
const bar = pc => `<div class="progress mt-2" style="height:10px"><div class="progress-bar bg-success" style="width:${pc}%"></div></div><small class="text-muted">${pc}% completed</small>`;
// [Bootstrap] card inside a responsive grid column
function col(html, act, id) {
  const wrap = el("div", "col-12 col-md-6 col-lg-4");
  const card = el("div", "card h-100 shadow-sm card-hover");
  card.innerHTML = `<div class="card-body d-flex flex-column">${html}</div>`;
  card.dataset.act = act; card.dataset.id = id;
  wrap.appendChild(card);
  return wrap;
}
// [Bootstrap] breadcrumb, [Destructuring] const [label, act]
function crumbs(items) {
  let h = '<nav><ol class="breadcrumb">';
  for (let i = 0; i < items.length; i++) {
    const [label, act] = items[i];
    h += i === items.length - 1 ? `<li class="breadcrumb-item active">${esc(label)}</li>` : `<li class="breadcrumb-item"><a href="#" data-act="${act}">${esc(label)}</a></li>`;
  }
  return h + "</ol></nav>";
}
function showMsg(text, type = "danger") {
  const box = document.getElementById("msg");
  box.innerHTML = "";
  box.insertAdjacentHTML("beforeend", `<div class="alert alert-${type} py-2" role="alert">${esc(text)}</div>`);   // [Bootstrap] alert
}
function finish() { store.save(); render(); }

// ---------- Rendering ----------
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  window.scrollTo(0, 0);
  if (session.user === null) { authView(app); return; }
  const u = currentUser();
  app.insertAdjacentHTML("beforeend", `<nav class="navbar navbar-dark bg-dark mb-4"><div class="container">
    <span class="navbar-brand">Karyam</span><span class="navbar-text ms-auto me-3 text-white-50">${esc(u.name)}, ${u.role} at ${esc(u.company)}</span>
    <button class="btn btn-outline-light btn-sm" data-act="logout">Log out</button></div></nav>`);
  const main = el("main", "container pb-5");
  app.appendChild(main);
  switch (session.view) {
    case "proj": projView(main); break;
    case "prof": profView(main); break;
    default: dashView(main);
  }
}

function authView(app) {
  const reg = session.mode === "reg";
  const companies = [];
  for (const u of db.users) { if (!companies.includes(u.company)) companies.push(u.company); }
  let opts = "";
  for (const c of companies) opts += `<option value="${esc(c)}">`;
  const regFields = reg ? `<label class="form-label">Full name</label><input id="n" class="form-control mb-3">
    <label class="form-label">Role</label><select id="r" class="form-select mb-3"><option>Team Member</option><option>Team Leader</option><option>Manager</option></select>
    <label class="form-label">Company</label><input id="c" class="form-control mb-3" list="cl"><datalist id="cl">${opts}</datalist>` : "";
  app.insertAdjacentHTML("beforeend", `<div class="row g-0 min-vh-100">
    <div class="col-lg-6 d-none d-lg-flex auth-art flex-column justify-content-between p-5 text-white">
      <div class="brand"><svg viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#2dd4bf"/><path d="M10 19l6 6 11-13" fill="none" stroke="#0b1730" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>Karyam</div>
      <div><svg class="hero" viewBox="0 0 520 370" role="img" aria-label="Karyam project board illustration" font-family="system-ui,Arial,sans-serif"><g transform="translate(0,24)"><rect x="10" y="10" width="500" height="320" rx="20" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".2"/><circle cx="34" cy="34" r="4" fill="#fff" fill-opacity=".35"/><circle cx="50" cy="34" r="4" fill="#fff" fill-opacity=".35"/><circle cx="66" cy="34" r="4" fill="#fff" fill-opacity=".35"/><text x="88" y="38" font-size="12" fill="#fff" fill-opacity=".8">Company Website</text><rect x="28" y="58" width="148" height="256" rx="12" fill="#fff" fill-opacity=".06"/><circle cx="40" cy="76" r="4" fill="#f59e0b"/><text x="50" y="80" font-size="11" fill="#fff" fill-opacity=".8">To do</text><rect x="188" y="58" width="148" height="256" rx="12" fill="#fff" fill-opacity=".06"/><circle cx="200" cy="76" r="4" fill="#38bdf8"/><text x="210" y="80" font-size="11" fill="#fff" fill-opacity=".8">In verification</text><rect x="348" y="58" width="148" height="256" rx="12" fill="#fff" fill-opacity=".06"/><circle cx="360" cy="76" r="4" fill="#22c55e"/><text x="370" y="80" font-size="11" fill="#fff" fill-opacity=".8">Completed</text><rect x="40" y="94" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="52" y="116" font-size="11" font-weight="700" fill="#14213d">Create about page</text><text x="52" y="134" font-size="10" fill="#5f6b7a">Due 14 Oct</text><circle cx="148" cy="136" r="8" fill="#0f766e"/><rect x="40" y="164" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="52" y="186" font-size="11" font-weight="700" fill="#14213d">Add search bar</text><text x="52" y="204" font-size="10" fill="#5f6b7a">Due 18 Oct</text><circle cx="148" cy="206" r="8" fill="#14213d"/><rect x="200" y="94" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="212" y="116" font-size="11" font-weight="700" fill="#14213d">Contact us page</text><text x="212" y="134" font-size="10" fill="#5f6b7a">GitHub link added</text><circle cx="308" cy="136" r="8" fill="#c2410c"/><rect x="360" y="94" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="372" y="116" font-size="11" font-weight="700" fill="#14213d">Homepage</text><text x="372" y="134" font-size="10" fill="#5f6b7a">Verified by leader</text><circle cx="468" cy="136" r="8" fill="#0f766e"/><path d="M464 136l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="360" y="164" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="372" y="186" font-size="11" font-weight="700" fill="#14213d">Navbar</text><text x="372" y="204" font-size="10" fill="#5f6b7a">Verified by leader</text><circle cx="468" cy="206" r="8" fill="#14213d"/><path d="M464 206l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="360" y="234" width="124" height="58" rx="8" fill="#fff" fill-opacity=".96"/><text x="372" y="256" font-size="11" font-weight="700" fill="#14213d">Form validation</text><text x="372" y="274" font-size="10" fill="#5f6b7a">Verified by leader</text><circle cx="468" cy="276" r="8" fill="#c2410c"/><path d="M464 276l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><rect x="372" y="0" width="148" height="46" rx="12" fill="#fff"/><text x="388" y="31" font-size="21" font-weight="700" fill="#0f766e">72%</text><text x="436" y="30" font-size="12" fill="#5f6b7a">complete</text></svg>
        <div id="feat" class="carousel slide mt-4"><div class="carousel-inner">
          <div class="carousel-item active"><h2>Plan it. Assign it. Verify it.</h2><p class="opacity-75">One workspace for every project and every task.</p></div>
          <div class="carousel-item"><h2>Role based access</h2><p class="opacity-75">Separate views for Managers, Team Leaders and Team Members.</p></div>
          <div class="carousel-item"><h2>Leader verified tasks</h2><p class="opacity-75">A task counts only after the Team Leader checks the submitted work link.</p></div>
        </div></div></div><div></div></div>
    <div class="col-12 col-lg-6 d-flex align-items-center bg-white"><div class="w-100 p-4 p-md-5 mx-auto" style="max-width:480px">
      <div class="brand text-primary d-lg-none mb-3">Karyam</div>
      <h2>${reg ? "Create your account" : "Welcome back"}</h2>
      <p class="text-muted mb-4">${reg ? "Managers set up their company. Everyone else joins once their manager approves." : "Log in to your workspace."}</p>
      ${regFields}
      <label class="form-label">Email</label><input id="e" type="email" class="form-control mb-3">
      <label class="form-label">Password</label><input id="p" type="password" class="form-control mb-3">
      <div id="msg"></div>
      <button class="btn btn-primary w-100 py-2 mb-3" data-act="${reg ? "register" : "login"}">${reg ? "Register" : "Log in"}</button>
      <p class="text-muted small">${reg ? "Already registered?" : "New user?"} <a href="#" data-act="${reg ? "tologin" : "toreg"}">${reg ? "Log in" : "Register here"}</a></p>
      ${reg ? "" : '<div class="alert alert-secondary small">Demo accounts (password 1234): maya@acme.com (Manager), liam@acme.com (Team Leader), aria@acme.com (Team Member)</div>'}
    </div></div></div>`);
  new bootstrap.Carousel(document.getElementById("feat"), { interval: 3500, ride: "carousel" });   // [Bootstrap] carousel
}

function dashView(main) {
  const u = currentUser(), isMgr = u.role === "Manager";
  if (isMgr) {
    let reqs = "", leaders = '<option value="">Select Team Leader</option>';
    for (const x of db.users) {
      if (x.company !== u.company) continue;
      if (!x.ok) {
        reqs += `<li class="list-group-item d-flex justify-content-between align-items-center"><span>${esc(x.name)} <span class="badge text-bg-secondary">${x.role}</span></span>
          <span><button class="btn btn-success btn-sm me-1" data-act="approve" data-id="${x.id}">Approve</button><button class="btn btn-outline-danger btn-sm" data-act="reject" data-id="${x.id}">Reject</button></span></li>`;
      } else if (x.role === "Team Leader") {
        leaders += `<option value="${x.id}">${esc(x.name)}</option>`;
      }
    }
    if (!reqs) reqs = '<li class="list-group-item text-muted">No pending requests</li>';
    main.insertAdjacentHTML("beforeend", `<div class="row g-3 mb-4">
      <div class="col-lg-6"><div class="card h-100"><div class="card-header fw-semibold">Join requests</div><ul class="list-group list-group-flush">${reqs}</ul></div></div>
      <div class="col-lg-6"><div class="card h-100"><div class="card-header fw-semibold">Create a project</div><div class="card-body">
        <input id="pn" class="form-control mb-2" placeholder="Project name"><select id="pl" class="form-select mb-3">${leaders}</select>
        <button class="btn btn-primary" data-act="newproj">Create project</button></div></div></div></div>`);
  }
  main.insertAdjacentHTML("beforeend", `<h3 class="mb-3">${isMgr ? "Company projects" : "Your projects"}</h3><div class="row g-3" id="grid"></div>`);
  const list = visibleProjects(u), frag = document.createDocumentFragment();    // [DOM] fragment
  for (const p of list) {
    frag.appendChild(col(`<h5>${esc(p.name)}</h5><p class="text-muted small mb-0">Led by ${esc(byId(db.users, p.lead).name)}, ${p.mem.length} members</p>${bar(percent(tasksOf(p.id)))}`, "open", p.id));
  }
  document.getElementById("grid").appendChild(frag);
  if (!list.length) main.insertAdjacentHTML("beforeend", '<div class="alert alert-info">No projects yet.</div>');
}

function projView(main) {
  const u = currentUser(), p = byId(db.projects, session.pid), tasks = tasksOf(p.id), ed = u.canManage(p);
  let chips = "";
  for (const key in STATUS) { chips += `<span class="badge text-bg-${BADGE[key]} me-2">${STATUS[key]}: ${countStatus(tasks, key)}</span>`; }   // [Loops] for-in
  main.insertAdjacentHTML("beforeend", `${crumbs([["Projects", "home"], [p.name]])}<h2>${esc(p.name)}</h2>
    <p class="text-muted">Team Leader: ${esc(byId(db.users, p.lead).name)}</p>
    <div class="card mb-4"><div class="card-body"><b>Overall project progress</b>${bar(percent(tasks))}<div class="mt-3">${chips}</div></div></div>
    <h4 class="mb-3">Team members</h4><div class="row g-3 mb-4" id="grid"></div>`);
  const frag = document.createDocumentFragment();
  for (const m of p.mem) {
    const x = byId(db.users, m.u);
    const rm = ed ? `<div class="mt-auto pt-3 text-end"><button class="btn btn-outline-danger btn-sm" data-act="remm" data-id="${x.id}">Remove member</button></div>` : "";
    frag.appendChild(col(`<div class="avatar mb-2">${esc(x.name[0])}</div><h5>${esc(x.name)}</h5><p class="text-muted small mb-1">${x.role}</p><p class="mb-0">Duty: ${esc(m.duty)}</p>${bar(percent(tasksOf(p.id, x.id)))}${rm}`, "profile", x.id));
  }
  document.getElementById("grid").appendChild(frag);
  if (!p.mem.length) main.insertAdjacentHTML("beforeend", '<div class="alert alert-info">No members yet.</div>');
  if (!ed) return;
  let free = '<option value="">Select Team Member</option>', mine = free;
  for (const x of db.users) { if (x.company === p.co && x.ok && x.role === "Team Member" && !isMember(p, x.id)) free += `<option value="${x.id}">${esc(x.name)}</option>`; }
  for (const m of p.mem) mine += `<option value="${m.u}">${esc(byId(db.users, m.u).name)}</option>`;
  main.insertAdjacentHTML("beforeend", `<div class="row g-3">
    <div class="col-lg-6"><div class="card"><div class="card-header fw-semibold">Add a member</div><div class="card-body">
      <select id="am" class="form-select mb-2">${free}</select><input id="ad" class="form-control mb-3" placeholder="Duty in this project">
      <button class="btn btn-primary" data-act="addm">Add member</button></div></div></div>
    <div class="col-lg-6"><div class="card"><div class="card-header fw-semibold">Assign a task</div><div class="card-body">
      <select id="tm" class="form-select mb-2">${mine}</select><input id="tt" class="form-control mb-2" placeholder="Task, for example Create homepage">
      <input id="td" type="date" class="form-control mb-3"><button class="btn btn-primary" data-act="addt">Assign task</button></div></div></div></div>`);
}

function profView(main) {
  const u = currentUser(), p = byId(db.projects, session.pid), x = byId(db.users, session.uid);
  const tasks = tasksOf(p.id, x.id), today = new Date().toISOString().slice(0, 10);
  // When a Team Member opens their own task list they have seen the tasks, so "To do" becomes "Pending" (work in progress)
  let seen = false;
  if (u.id === x.id) { for (const t of tasks) { if (t.s === "todo") { t.s = "pend"; seen = true; } } }
  if (seen) store.save();
  let duty = "";
  for (const m of p.mem) { if (m.u === x.id) duty = m.duty; }
  main.insertAdjacentHTML("beforeend", `${crumbs([["Projects", "home"], [p.name, "backproj"], [x.name]])}
    <div class="card mb-4"><div class="card-body"><div class="avatar mb-2">${esc(x.name[0])}</div><h2 class="mb-0">${esc(x.name)}</h2>
    <p class="text-muted mb-1">${x.role} on ${esc(p.name)}</p><p class="mb-0">Duty: ${esc(duty)}</p>${bar(percent(tasks))}</div></div><h4 class="mb-3">Assigned tasks</h4>`);
  let items = "";
  for (const t of tasks) {
    const late = t.due && t.s !== "done" && t.due < today;
    let extra = "", btns = "";
    if (t.due) extra += `<div class="small ${late ? "text-danger" : "text-muted"}">Due ${esc(t.due)}${late ? " (overdue)" : ""}</div>`;
    if (t.link) extra += `<div class="small">${t.s === "done" ? "Completed work" : "Submitted work"}: <a href="${esc(t.link)}" target="_blank" rel="noopener">${esc(t.link)}</a></div>`;
    else if (t.s === "done") extra += '<div class="small text-muted">No work link was added.</div>';
    if (t.note && t.s === "pend") extra += `<div class="small text-danger">Pending reason: ${esc(t.note)}</div>`;
    if (u.id === t.u && (t.s === "todo" || t.s === "pend")) btns += `<button class="btn btn-primary btn-sm" data-act="submit" data-id="${t.id}">Submit for verification</button>`;
    if (u.isLeaderOf(p) && t.s === "sub") btns += `<button class="btn btn-success btn-sm" data-act="verify" data-id="${t.id}">Verify and complete</button>`;
    if (u.canManage(p)) {
      if (t.s === "sub" || t.s === "done") btns += `<button class="btn btn-warning btn-sm" data-act="pend" data-id="${t.id}">Mark pending</button>`;
      btns += `<button class="btn btn-outline-danger btn-sm" data-act="delt" data-id="${t.id}">Delete</button>`;
    }
    items += `<li class="list-group-item"><div class="d-flex justify-content-between flex-wrap gap-2"><div><b>${esc(t.t)}</b> <span class="badge text-bg-${BADGE[t.s]}">${STATUS[t.s]}</span>${extra}</div><div class="d-flex gap-2 flex-wrap align-items-start">${btns}</div></div></li>`;
  }
  main.insertAdjacentHTML("beforeend", items ? `<ul class="list-group">${items}</ul>` : '<div class="alert alert-info">No tasks assigned yet.</div>');
}

// ---------- [Bootstrap] modal used for the work link and the pending reason ----------
function ask(title, label, initial, onOk) {
  const input = document.getElementById("dlgInput"), ok = document.getElementById("dlgOk"), err = document.getElementById("dlgErr");
  document.getElementById("dlgTitle").textContent = title;
  document.getElementById("dlgLabel").textContent = label;
  input.value = initial; err.textContent = "";
  const sync = () => { if (input.value.trim()) ok.removeAttribute("disabled"); else ok.setAttribute("disabled", ""); };
  input.oninput = sync; sync();                                  // [Events] property handler
  ok.onclick = () => { const problem = onOk(input.value.trim()); if (problem) { err.textContent = problem; } else { dialog.hide(); } };
  dialog.show();
}

// ---------- Actions ----------
function doLogin() {
  const email = val("e").toLowerCase(), pass = document.getElementById("p").value;
  let u = null;
  for (const x of db.users) { if (x.email === email) u = x; }
  if (!u || u.pass !== pass) return showMsg("Email or password is incorrect.");
  if (!u.ok) return showMsg("Your manager has not approved you yet.", "warning");
  session.user = u.id; session.view = "dash";
  sessionStorage.setItem("karyam_u", u.id);
  render();
}
function doRegister() {
  const name = val("n"), role = val("r"), company = val("c"), email = val("e").toLowerCase(), pass = document.getElementById("p").value;
  if (!name || !company || !email || !pass) return showMsg("Fill in every field.");
  let hasManager = false;
  for (const x of db.users) {
    if (x.email === email) return showMsg("This email is already registered.");
    if (x.role === "Manager" && x.company === company) hasManager = true;
  }
  const isMgr = role === "Manager";
  if (!isMgr && !hasManager) return showMsg("No manager has set up this company yet.");
  db.users.push({ id: nextId(), name, email, pass, role, company, ok: isMgr });
  store.save(); session.mode = "login"; render();
  showMsg(isMgr ? "Account created. Log in now." : "Registered. Log in after your manager approves you.", "success");
}
function createProject() {
  const name = val("pn"), lead = Number(document.getElementById("pl").value);
  if (!name || !lead) { alert("Enter a project name and select a Team Leader."); return; }
  db.projects.unshift({ id: nextId(), name, co: currentUser().company, lead, mem: [] });   // [Arrays] unshift
  finish();
}
function addMember() {
  const uid = Number(document.getElementById("am").value), duty = val("ad");
  if (!uid || !duty) { alert("Select a Team Member and enter their duty."); return; }
  byId(db.projects, session.pid).mem.push({ u: uid, duty });
  finish();
}
function addTask() {
  const uid = Number(document.getElementById("tm").value), title = val("tt");
  if (!uid || !title) { alert("Select a Team Member and enter the task."); return; }
  const base = { s: "todo", link: "", note: "" };                                       // [Spread] defaults
  db.tasks.push({ ...base, id: nextId(), p: session.pid, u: uid, t: title, due: document.getElementById("td").value });
  finish();
}
function removeFrom(list, test) {                  // [Arrays] splice, looping backwards
  for (let i = list.length - 1; i >= 0; i--) { if (test(list[i])) list.splice(i, 1); }
}
function removeMember(uid) {
  if (!confirm("Remove this member and their tasks from the project?")) return;
  const p = byId(db.projects, session.pid);
  removeFrom(p.mem, m => m.u === uid);
  removeFrom(db.tasks, t => t.p === p.id && t.u === uid);
  finish();
}

// ---------- [Events] one listener on #app handles every button (event delegation) ----------
function onAppClick(e) {
  let node = e.target;
  while (node && !(node.dataset && node.dataset.act)) node = node.parentElement;   // climb with parentElement
  if (!node) return;
  e.preventDefault();
  const act = node.dataset.act, id = Number(node.dataset.id);
  switch (act) {
    case "login": doLogin(); break;
    case "register": doRegister(); break;
    case "toreg": session.mode = "reg"; render(); break;
    case "tologin": session.mode = "login"; render(); break;
    case "logout": session.user = null; session.mode = "login"; sessionStorage.removeItem("karyam_u"); render(); break;
    case "home": session.view = "dash"; render(); break;
    case "backproj": session.view = "proj"; render(); break;
    case "open": session.pid = id; session.view = "proj"; render(); break;
    case "profile": session.uid = id; session.view = "prof"; render(); break;
    case "approve": byId(db.users, id).ok = true; finish(); break;
    case "reject": removeFrom(db.users, x => x.id === id); finish(); break;
    case "newproj": createProject(); break;
    case "addm": addMember(); break;
    case "addt": addTask(); break;
    case "remm": removeMember(id); break;
    case "delt": if (confirm("Delete this task?")) { removeFrom(db.tasks, t => t.id === id); finish(); } break;
    case "verify": byId(db.tasks, id).s = "done"; finish(); break;
    case "submit": {
      const t = byId(db.tasks, id);
      ask("Submit work for verification", "Link to your work (GitHub or hosted page)", t.link || "", v => {
        if (!/^https?:\/\/[^\s.]+\.\S+$/i.test(v)) return "Enter a valid link starting with http:// or https://";
        t.link = v; t.s = "sub"; finish(); return "";
      });
      break;
    }
    case "pend": {
      const t = byId(db.tasks, id);
      ask("Mark task pending", "Reason (the team member will see this)", "", v => { t.note = v; t.s = "pend"; finish(); return ""; });
      break;
    }
  }
}

function init() {
  store.load(); db = store.data;
  nextId = makeCounter(maxId());
  session.user = Number(sessionStorage.getItem("karyam_u")) || null;
  if (session.user && !byId(db.users, session.user)) session.user = null;
  dialog = new bootstrap.Modal(document.getElementById("dlg"));
  const app = document.getElementById("app");
  app.addEventListener("click", onAppClick);
  app.addEventListener("keydown", e => {            // [Events] keyboard event, event.key
    if (e.key === "Enter" && session.user === null) { session.mode === "reg" ? doRegister() : doLogin(); }
  });
  console.log("Karyam started with", db.users.length, "users");
  render();
}
document.addEventListener("DOMContentLoaded", init);   // [Events] DOMContentLoaded
