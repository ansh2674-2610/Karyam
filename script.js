// ==========================================================
//  Karyam - Project Management System
//  script.js
//
//  Sections in this file:
//   1. Variables
//   2. Starting data
//   3. Classes (roles)
//   4. Helper functions
//   5. Saving and loading data
//   6. Showing and hiding screens
//   7. Login, register and logout
//   8. Dashboard
//   9. Project page
//  10. Member profile page
//  11. Pop-up box (Bootstrap modal)
//  12. Actions (what each button does)
//  13. Click and keyboard handling
//  14. Starting the app
// ==========================================================


// ---------- 1. VARIABLES ----------

const STORAGE_KEY = "karyam";

// Names and Bootstrap colours for each task status (object)
const statusNames = {
    todo: "To do",
    pend: "Pending",
    sub: "In verification",
    done: "Completed"
};
const statusColors = {
    todo: "secondary",
    pend: "warning",
    sub: "info",
    done: "success"
};

// Ids of the big screens and of the sections inside the app
const allScreens = ["loginPage", "registerPage", "appPage"];
const allSections = ["dashboardPage", "projectPage", "profilePage"];

// All our data lives in these three lists
let users = [];
let projects = [];
let tasks = [];

// What the user is currently looking at
let loggedInId = null;      // id of the logged in user (null = nobody)
let currentSection = "dashboardPage";
let currentProjectId = 0;
let currentMemberId = 0;

let nextId;                 // function that gives a new id (see makeCounter)
let dialogBox;              // the Bootstrap modal


// ---------- 2. STARTING DATA ----------

function getStartData() {
    const company = "Acme Tech";
    const password = "1234";

    const startUsers = [
        { id: 1, name: "Maya Shah", email: "maya@acme.com", pass: password, role: "Manager", company: company, ok: true },
        { id: 2, name: "Liam Patel", email: "liam@acme.com", pass: password, role: "Team Leader", company: company, ok: true },
        { id: 3, name: "Aria Khan", email: "aria@acme.com", pass: password, role: "Team Member", company: company, ok: true },
        { id: 4, name: "Ben Roy", email: "ben@acme.com", pass: password, role: "Team Member", company: company, ok: true },
        { id: 5, name: "Noah Lee", email: "noah@nova.com", pass: password, role: "Manager", company: "Nova Labs", ok: true }
    ];

    const startProjects = [
        {
            id: 6,
            name: "Company Website",
            co: company,
            lead: 2,
            mem: [
                { u: 3, duty: "HTML and CSS pages" },
                { u: 4, duty: "JavaScript features" }
            ]
        }
    ];

    const startTasks = [
        { id: 7, p: 6, u: 3, t: "Create homepage", s: "done", link: "https://github.com/example/homepage" },
        { id: 8, p: 6, u: 3, t: "Create contact us page", s: "sub", link: "https://github.com/example/contact-page" },
        { id: 9, p: 6, u: 3, t: "Create about page", s: "todo" },
        { id: 10, p: 6, u: 4, t: "Add form validation", s: "done", link: "https://github.com/example/form-validation" },
        { id: 11, p: 6, u: 4, t: "Build image slider", s: "pend", note: "Slider breaks on mobile screens" }
    ];

    return { users: startUsers, projects: startProjects, tasks: startTasks };
}


// ---------- 3. CLASSES (roles) ----------

// Every person has these details
class Person {
    constructor({ id, name, email, pass, role, company, ok }) {   // destructuring
        this.id = id;
        this.name = name;
        this.email = email;
        this.pass = pass;
        this.role = role;
        this.company = company;
        this.ok = ok;
    }

    // Can this person manage (add members, assign tasks) in this project?
    canManage(project) {
        return false;
    }

    // Is this person the Team Leader of this project?
    isLeaderOf(project) {
        return false;
    }
}

class Manager extends Person {
    constructor(data) {
        super(data);            // call the Person constructor first
        this.isAdmin = true;
    }

    canManage(project) {
        return project.co === this.company;
    }
}

class TeamLeader extends Person {
    canManage(project) {
        return project.lead === this.id;
    }

    isLeaderOf(project) {
        return project.lead === this.id;
    }
}

class TeamMember extends Person {
    // Team Members cannot manage anything, so nothing extra here
}

// Make the right kind of object for a user's role
function makeUser(data) {
    switch (data.role) {
        case "Manager":
            return new Manager(data);
        case "Team Leader":
            return new TeamLeader(data);
        default:
            return new TeamMember(data);
    }
}

function getCurrentUser() {
    return makeUser(findById(users, loggedInId));
}


// ---------- 4. HELPER FUNCTIONS ----------

// Closure: the inner function remembers the number n
function makeCounter(n) {
    function giveNext() {
        n = n + 1;
        return n;
    }
    return giveNext;
}

// Find the biggest id used so far
function getBiggestId() {
    let biggest = 0;
    const allLists = [users, projects, tasks];

    for (const list of allLists) {
        for (const item of list) {
            if (item.id > biggest) {
                biggest = item.id;
            }
        }
    }
    return biggest;
}

// Find an item in a list using its id (returns null if not found)
function findById(list, id) {
    let i = 0;
    while (i < list.length) {
        if (list[i].id === Number(id)) {
            return list[i];
        }
        i++;
    }
    return null;
}

// Remove an item from a list using its id
function removeById(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            list.splice(i, 1);
            return;
        }
    }
}

// Is this person a member of this project?
function isMember(project, userId) {
    for (const member of project.mem) {
        if (member.u === userId) {
            return true;
        }
    }
    return false;
}

// Projects this user is allowed to see
function getMyProjects(user) {
    const result = [];

    for (const project of projects) {
        if (user.role === "Manager") {
            if (project.co === user.company) {
                result.push(project);
            }
        } else if (user.role === "Team Leader") {
            if (project.lead === user.id) {
                result.push(project);
            }
        } else {
            if (isMember(project, user.id)) {
                result.push(project);
            }
        }
    }
    return result;
}

// Tasks of one project (and of one member, if memberId is given)
function getTasks(projectId, memberId) {
    const result = [];

    for (const task of tasks) {
        if (task.p === projectId) {
            if (memberId === undefined || task.u === memberId) {
                result.push(task);
            }
        }
    }
    return result;
}

// Recursion: a function that calls itself to count completed tasks
function countDone(list, i = 0) {
    if (i >= list.length) {
        return 0;
    }
    let thisOne = 0;
    if (list[i].s === "done") {
        thisOne = 1;
    }
    return thisOne + countDone(list, i + 1);
}

function countStatus(list, status) {
    let count = 0;
    for (const task of list) {
        if (task.s === status) {
            count += 1;
        }
    }
    return count;
}

// Percentage of completed tasks
function getPercent(list) {
    if (list.length === 0) {
        return 0;
    }
    return Math.round(countDone(list) * 100 / list.length);
}

// HTML for a Bootstrap progress bar
function makeBar(percent) {
    return '<div class="progress mt-2" style="height: 10px;">' +
        '<div class="progress-bar bg-success" style="width: ' + percent + '%;"></div>' +
        '</div>' +
        '<small class="text-muted">' + percent + '% completed</small>';
}

// Stops text typed by users from being treated as HTML
function safeText(text) {
    let result = String(text);
    result = result.replace(/&/g, "&amp;");
    result = result.replace(/</g, "&lt;");
    result = result.replace(/>/g, "&gt;");
    result = result.replace(/"/g, "&quot;");
    return result;
}

// Get the text from an input box (without spaces at the start and end)
function getValue(id) {
    return document.getElementById(id).value.trim();
}

// Show a Bootstrap alert message inside a box
function showMessage(boxId, text, type) {
    const box = document.getElementById(boxId);
    box.innerHTML = "";
    box.insertAdjacentHTML("beforeend",
        '<div class="alert alert-' + type + ' py-2">' + safeText(text) + '</div>');
}


// ---------- 5. SAVING AND LOADING DATA ----------

function loadData() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    let data;

    if (saved) {
        data = JSON.parse(saved);
    } else {
        data = getStartData();
    }

    [users, projects, tasks] = [data.users, data.projects, data.tasks];   // destructuring
}

function saveData() {
    const data = { users: users, projects: projects, tasks: tasks };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Save and then redraw the screen we are on
function saveAndRefresh() {
    saveData();
    refreshScreen();
}


// ---------- 6. SHOWING AND HIDING SCREENS ----------

function showScreen(name) {
    for (const id of allScreens) {
        document.getElementById(id).classList.add("d-none");
    }
    document.getElementById(name).classList.remove("d-none");
    window.scrollTo(0, 0);
}

function showSection(name) {
    for (const id of allSections) {
        document.getElementById(id).classList.add("d-none");
    }
    document.getElementById(name).classList.remove("d-none");
    currentSection = name;
    window.scrollTo(0, 0);
}

// Redraw whichever section is open
function refreshScreen() {
    switch (currentSection) {
        case "projectPage":
            refreshProject();
            break;
        case "profilePage":
            refreshProfile();
            break;
        default:
            refreshDashboard();
    }
}

function goToDashboard() {
    showScreen("appPage");
    showSection("dashboardPage");
    refreshDashboard();
}

function goToProject(projectId) {
    currentProjectId = projectId;
    showSection("projectPage");
    refreshProject();
}

function goToProfile(memberId) {
    currentMemberId = memberId;
    showSection("profilePage");
    refreshProfile();
}


// ---------- 7. LOGIN, REGISTER AND LOGOUT ----------

function fillCompanyList() {
    const list = document.getElementById("companyList");
    const companies = [];
    let options = "";

    for (const user of users) {
        if (!companies.includes(user.company)) {
            companies.push(user.company);
        }
    }
    for (const company of companies) {
        options += '<option value="' + safeText(company) + '">';
    }
    list.innerHTML = options;
}

function doLogin() {
    const email = getValue("loginEmail").toLowerCase();
    const password = document.getElementById("loginPassword").value;
    let foundUser = null;

    for (const user of users) {
        if (user.email === email) {
            foundUser = user;
        }
    }

    if (foundUser === null || foundUser.pass !== password) {
        showMessage("loginMessage", "Email or password is incorrect.", "danger");
        return;
    }
    if (!foundUser.ok) {
        showMessage("loginMessage", "Your manager has not approved you yet.", "warning");
        return;
    }

    loggedInId = foundUser.id;
    sessionStorage.setItem("karyam_u", foundUser.id);
    goToDashboard();
}

function doRegister() {
    const name = getValue("regName");
    const role = getValue("regRole");
    const company = getValue("regCompany");
    const email = getValue("regEmail").toLowerCase();
    const password = document.getElementById("regPassword").value;
    let companyHasManager = false;

    if (name === "" || company === "" || email === "" || password === "") {
        showMessage("registerMessage", "Fill in every field.", "danger");
        return;
    }

    for (const user of users) {
        if (user.email === email) {
            showMessage("registerMessage", "This email is already registered.", "danger");
            return;
        }
        if (user.role === "Manager" && user.company === company) {
            companyHasManager = true;
        }
    }

    const isManager = (role === "Manager");
    if (!isManager && !companyHasManager) {
        showMessage("registerMessage", "No manager has set up this company yet.", "danger");
        return;
    }

    // Managers are approved at once, everyone else waits for the manager
    users.push({
        id: nextId(),
        name: name,
        email: email,
        pass: password,
        role: role,
        company: company,
        ok: isManager
    });
    saveData();
    fillCompanyList();

    showScreen("loginPage");
    if (isManager) {
        showMessage("loginMessage", "Account created. Log in now.", "success");
    } else {
        showMessage("loginMessage", "Registered. Log in after your manager approves you.", "success");
    }
}

function doLogout() {
    loggedInId = null;
    sessionStorage.removeItem("karyam_u");
    document.getElementById("loginMessage").innerHTML = "";
    showScreen("loginPage");
}


// ---------- 8. DASHBOARD ----------

function refreshDashboard() {
    const user = getCurrentUser();
    const isManager = (user.role === "Manager");

    document.getElementById("navUser").textContent =
        user.name + ", " + user.role + " at " + user.company;

    // The manager panel is only for managers
    if (isManager) {
        document.getElementById("managerPanel").classList.remove("d-none");
        document.getElementById("dashTitle").textContent = "Company projects";
        showJoinRequests(user);
        fillLeaderSelect(user);
    } else {
        document.getElementById("managerPanel").classList.add("d-none");
        document.getElementById("dashTitle").textContent = "Your projects";
    }

    showProjects(user);
}

function showJoinRequests(user) {
    const list = document.getElementById("requestList");
    let html = "";

    for (const person of users) {
        if (person.company === user.company && !person.ok) {
            html += '<li class="list-group-item d-flex justify-content-between align-items-center">' +
                '<span>' + safeText(person.name) + ' <span class="badge text-bg-secondary">' + person.role + '</span></span>' +
                '<span>' +
                '<button class="btn btn-success btn-sm me-1" data-action="approve" data-id="' + person.id + '">Approve</button>' +
                '<button class="btn btn-outline-danger btn-sm" data-action="reject" data-id="' + person.id + '">Reject</button>' +
                '</span>' +
                '</li>';
        }
    }

    if (html === "") {
        html = '<li class="list-group-item text-muted">No pending requests</li>';
    }
    list.innerHTML = html;
}

function fillLeaderSelect(user) {
    const select = document.getElementById("leaderSelect");
    let html = '<option value="">Select Team Leader</option>';

    for (const person of users) {
        if (person.company === user.company && person.ok && person.role === "Team Leader") {
            html += '<option value="' + person.id + '">' + safeText(person.name) + '</option>';
        }
    }
    select.innerHTML = html;
}

function showProjects(user) {
    const list = document.getElementById("projectList");
    const noProjects = document.getElementById("noProjects");
    const myProjects = getMyProjects(user);
    const fragment = document.createDocumentFragment();

    list.innerHTML = "";

    for (const project of myProjects) {
        const leader = findById(users, project.lead);
        const percent = getPercent(getTasks(project.id));

        const column = document.createElement("div");
        column.className = "col-12 col-md-6 col-lg-4";
        column.innerHTML =
            '<div class="card h-100 shadow-sm card-hover" data-action="open" data-id="' + project.id + '">' +
            '<div class="card-body">' +
            '<h5>' + safeText(project.name) + '</h5>' +
            '<p class="text-muted small mb-0">Led by ' + safeText(leader.name) + ', ' + project.mem.length + ' members</p>' +
            makeBar(percent) +
            '</div>' +
            '</div>';
        fragment.appendChild(column);
    }
    list.appendChild(fragment);

    if (myProjects.length === 0) {
        noProjects.classList.remove("d-none");
    } else {
        noProjects.classList.add("d-none");
    }
}


// ---------- 9. PROJECT PAGE ----------

function refreshProject() {
    const user = getCurrentUser();
    const project = findById(projects, currentProjectId);
    const leader = findById(users, project.lead);
    const projectTasks = getTasks(project.id);

    document.getElementById("projectCrumb").textContent = project.name;
    document.getElementById("projectTitle").textContent = project.name;
    document.getElementById("projectLeader").textContent = "Team Leader: " + leader.name;
    document.getElementById("projectBar").innerHTML = makeBar(getPercent(projectTasks));

    showStatusSummary(projectTasks);
    showMembers(project, user);

    // Only the manager and this project's leader can add members and tasks
    if (user.canManage(project)) {
        document.getElementById("leaderPanel").classList.remove("d-none");
        fillMemberSelects(project);
    } else {
        document.getElementById("leaderPanel").classList.add("d-none");
    }
}

function showStatusSummary(projectTasks) {
    let html = "";

    for (const status in statusNames) {          // for...in goes through the object keys
        html += '<span class="badge text-bg-' + statusColors[status] + ' me-2">' +
            statusNames[status] + ': ' + countStatus(projectTasks, status) +
            '</span>';
    }
    document.getElementById("statusSummary").innerHTML = html;
}

function showMembers(project, user) {
    const list = document.getElementById("memberList");
    const noMembers = document.getElementById("noMembers");
    const fragment = document.createDocumentFragment();

    list.innerHTML = "";

    for (const member of project.mem) {
        const person = findById(users, member.u);
        const percent = getPercent(getTasks(project.id, person.id));

        // The remove button is only for managers and leaders
        let removeButton = "";
        if (user.canManage(project)) {
            removeButton = '<div class="mt-auto pt-3 text-end">' +
                '<button class="btn btn-outline-danger btn-sm" data-action="remove-member" data-id="' + person.id + '">Remove member</button>' +
                '</div>';
        }

        const column = document.createElement("div");
        column.className = "col-12 col-md-6 col-lg-4";
        column.innerHTML =
            '<div class="card h-100 shadow-sm card-hover" data-action="profile" data-id="' + person.id + '">' +
            '<div class="card-body d-flex flex-column">' +
            '<div class="avatar mb-2">' + safeText(person.name[0]) + '</div>' +
            '<h5>' + safeText(person.name) + '</h5>' +
            '<p class="text-muted small mb-1">' + person.role + '</p>' +
            '<p class="mb-0">Duty: ' + safeText(member.duty) + '</p>' +
            makeBar(percent) +
            removeButton +
            '</div>' +
            '</div>';
        fragment.appendChild(column);
    }
    list.appendChild(fragment);

    if (project.mem.length === 0) {
        noMembers.classList.remove("d-none");
    } else {
        noMembers.classList.add("d-none");
    }
}

function fillMemberSelects(project) {
    const placeholder = '<option value="">Select Team Member</option>';
    let freeMembers = placeholder;      // people who can still be added
    let projectMembers = placeholder;   // people already in this project

    for (const person of users) {
        if (person.company === project.co && person.ok && person.role === "Team Member" && !isMember(project, person.id)) {
            freeMembers += '<option value="' + person.id + '">' + safeText(person.name) + '</option>';
        }
    }
    for (const member of project.mem) {
        const person = findById(users, member.u);
        projectMembers += '<option value="' + person.id + '">' + safeText(person.name) + '</option>';
    }

    document.getElementById("memberSelect").innerHTML = freeMembers;
    document.getElementById("taskMemberSelect").innerHTML = projectMembers;
}


// ---------- 10. MEMBER PROFILE PAGE ----------

function refreshProfile() {
    const user = getCurrentUser();
    const project = findById(projects, currentProjectId);
    const person = findById(users, currentMemberId);
    const memberTasks = getTasks(project.id, person.id);
    let duty = "";

    // When a Team Member opens their own tasks they have seen them,
    // so every "To do" task becomes "Pending" (work in progress)
    if (user.id === person.id) {
        let changed = false;
        for (const task of memberTasks) {
            if (task.s === "todo") {
                task.s = "pend";
                changed = true;
            }
        }
        if (changed) {
            saveData();
        }
    }

    for (const member of project.mem) {
        if (member.u === person.id) {
            duty = member.duty;
        }
    }

    document.getElementById("profileProjectCrumb").textContent = project.name;
    document.getElementById("profileCrumb").textContent = person.name;
    document.getElementById("profileAvatar").textContent = person.name[0];
    document.getElementById("profileName").textContent = person.name;
    document.getElementById("profileRole").textContent = person.role + " on " + project.name;
    document.getElementById("profileDuty").textContent = "Duty: " + duty;
    document.getElementById("profileBar").innerHTML = makeBar(getPercent(memberTasks));

    showTasks(memberTasks, project, user);
}

function showTasks(memberTasks, project, user) {
    const list = document.getElementById("taskList");
    const noTasks = document.getElementById("noTasks");
    const today = new Date().toISOString().slice(0, 10);
    let html = "";

    for (const task of memberTasks) {
        let details = "";    // due date, work link, pending reason
        let buttons = "";    // buttons this user is allowed to see

        // Due date (red if it is late)
        if (task.due) {
            const isLate = (task.s !== "done" && task.due < today);
            if (isLate) {
                details += '<div class="small text-danger">Due ' + safeText(task.due) + ' (overdue)</div>';
            } else {
                details += '<div class="small text-muted">Due ' + safeText(task.due) + '</div>';
            }
        }

        // Work link
        if (task.link) {
            let label = "Submitted work";
            if (task.s === "done") {
                label = "Completed work";
            }
            details += '<div class="small">' + label + ': <a href="' + safeText(task.link) + '" target="_blank" rel="noopener">' + safeText(task.link) + '</a></div>';
        } else if (task.s === "done") {
            details += '<div class="small text-muted">No work link was added.</div>';
        }

        // Reason written by the manager or leader
        if (task.note && task.s === "pend") {
            details += '<div class="small text-danger">Pending reason: ' + safeText(task.note) + '</div>';
        }

        // Buttons for the Team Member who owns the task
        if (user.id === task.u && (task.s === "todo" || task.s === "pend")) {
            buttons += '<button class="btn btn-primary btn-sm" data-action="submit" data-id="' + task.id + '">Submit for verification</button>';
        }
        // Button for the Team Leader
        if (user.isLeaderOf(project) && task.s === "sub") {
            buttons += '<button class="btn btn-success btn-sm" data-action="verify" data-id="' + task.id + '">Verify and complete</button>';
        }
        // Buttons for the Manager and the Team Leader
        if (user.canManage(project)) {
            if (task.s === "sub" || task.s === "done") {
                buttons += '<button class="btn btn-warning btn-sm" data-action="pending" data-id="' + task.id + '">Mark pending</button>';
            }
            buttons += '<button class="btn btn-outline-danger btn-sm" data-action="delete-task" data-id="' + task.id + '">Delete</button>';
        }

        html += '<li class="list-group-item">' +
            '<div class="d-flex justify-content-between flex-wrap gap-2">' +
            '<div>' +
            '<b>' + safeText(task.t) + '</b> ' +
            '<span class="badge text-bg-' + statusColors[task.s] + '">' + statusNames[task.s] + '</span>' +
            details +
            '</div>' +
            '<div class="d-flex gap-2 flex-wrap align-items-start">' + buttons + '</div>' +
            '</div>' +
            '</li>';
    }

    list.innerHTML = html;

    if (memberTasks.length === 0) {
        noTasks.classList.remove("d-none");
    } else {
        noTasks.classList.add("d-none");
    }
}


// ---------- 11. POP-UP BOX (Bootstrap modal) ----------

// Shows the pop-up with one input box.
// onConfirm gets the typed text and returns "" if all is fine,
// or an error message to show in the pop-up.
function askInDialog(title, label, startText, onConfirm) {
    const input = document.getElementById("dialogInput");
    const okButton = document.getElementById("dialogOkBtn");
    const errorBox = document.getElementById("dialogError");

    document.getElementById("dialogTitle").textContent = title;
    document.getElementById("dialogLabel").textContent = label;
    input.value = startText;
    errorBox.textContent = "";

    // The Confirm button stays disabled while the input box is empty
    function updateButton() {
        if (input.value.trim() === "") {
            okButton.setAttribute("disabled", "");
        } else {
            okButton.removeAttribute("disabled");
        }
    }
    input.oninput = updateButton;
    updateButton();

    okButton.onclick = function () {
        const problem = onConfirm(input.value.trim());
        if (problem === "") {
            dialogBox.hide();
        } else {
            errorBox.textContent = problem;
        }
    };

    dialogBox.show();
}

function askForWorkLink(taskId) {
    const task = findById(tasks, taskId);
    let startText = "";
    if (task.link) {
        startText = task.link;
    }

    askInDialog("Submit work for verification", "Link to your work (GitHub or hosted page)", startText, function (text) {
        // The link must start with http:// or https://
        if (!/^https?:\/\/[^\s.]+\.\S+$/i.test(text)) {
            return "Enter a valid link starting with http:// or https://";
        }
        task.link = text;
        task.s = "sub";
        saveAndRefresh();
        return "";
    });
}

function askForPendingReason(taskId) {
    const task = findById(tasks, taskId);

    askInDialog("Mark task pending", "Reason (the team member will see this)", "", function (text) {
        task.note = text;
        task.s = "pend";
        saveAndRefresh();
        return "";
    });
}


// ---------- 12. ACTIONS (what each button does) ----------

function approveUser(userId) {
    findById(users, userId).ok = true;
    saveAndRefresh();
}

function rejectUser(userId) {
    removeById(users, userId);
    saveAndRefresh();
}

function createProject() {
    const name = getValue("projectName");
    const leaderId = Number(document.getElementById("leaderSelect").value);

    if (name === "" || leaderId === 0) {
        alert("Enter a project name and select a Team Leader.");
        return;
    }

    // unshift puts the new project at the start of the list
    projects.unshift({
        id: nextId(),
        name: name,
        co: getCurrentUser().company,
        lead: leaderId,
        mem: []
    });
    document.getElementById("projectName").value = "";
    saveAndRefresh();
}

function addMember() {
    const memberId = Number(document.getElementById("memberSelect").value);
    const duty = getValue("dutyInput");

    if (memberId === 0 || duty === "") {
        alert("Select a Team Member and enter their duty.");
        return;
    }

    const project = findById(projects, currentProjectId);
    project.mem.push({ u: memberId, duty: duty });
    document.getElementById("dutyInput").value = "";
    saveAndRefresh();
}

function addTask() {
    const memberId = Number(document.getElementById("taskMemberSelect").value);
    const title = getValue("taskTitle");

    if (memberId === 0 || title === "") {
        alert("Select a Team Member and enter the task.");
        return;
    }

    // Spread (...) copies the starting values into the new task
    const startValues = { s: "todo", link: "", note: "" };
    tasks.push({
        ...startValues,
        id: nextId(),
        p: currentProjectId,
        u: memberId,
        t: title,
        due: document.getElementById("taskDue").value
    });
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDue").value = "";
    saveAndRefresh();
}

function removeMember(memberId) {
    if (!confirm("Remove this member and their tasks from the project?")) {
        return;
    }

    const project = findById(projects, currentProjectId);

    // Remove the member from the project
    for (let i = 0; i < project.mem.length; i++) {
        if (project.mem[i].u === memberId) {
            project.mem.splice(i, 1);
            break;
        }
    }

    // Remove their tasks (going backwards so splice does not skip any)
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i].p === project.id && tasks[i].u === memberId) {
            tasks.splice(i, 1);
        }
    }
    saveAndRefresh();
}

function deleteTask(taskId) {
    if (confirm("Delete this task?")) {
        removeById(tasks, taskId);
        saveAndRefresh();
    }
}

function verifyTask(taskId) {
    findById(tasks, taskId).s = "done";
    saveAndRefresh();
}


// ---------- 13. CLICK AND KEYBOARD HANDLING ----------

// Every button in the HTML has data-action="something".
// One click listener on the whole page finds the button and runs the right function
// (this is called event delegation).
function handleClick(event) {
    let element = event.target;

    // Go up from the clicked thing until we find an element with data-action
    while (element && !(element.dataset && element.dataset.action)) {
        element = element.parentElement;
    }
    if (!element) {
        return;
    }

    event.preventDefault();
    const action = element.dataset.action;
    const id = Number(element.dataset.id);

    switch (action) {
        case "login":
            doLogin();
            break;
        case "register":
            doRegister();
            break;
        case "show-register":
            showScreen("registerPage");
            break;
        case "show-login":
            showScreen("loginPage");
            break;
        case "logout":
            doLogout();
            break;
        case "home":
            goToDashboard();
            break;
        case "back-project":
            goToProject(currentProjectId);
            break;
        case "open":
            goToProject(id);
            break;
        case "profile":
            goToProfile(id);
            break;
        case "approve":
            approveUser(id);
            break;
        case "reject":
            rejectUser(id);
            break;
        case "create-project":
            createProject();
            break;
        case "add-member":
            addMember();
            break;
        case "add-task":
            addTask();
            break;
        case "remove-member":
            removeMember(id);
            break;
        case "delete-task":
            deleteTask(id);
            break;
        case "verify":
            verifyTask(id);
            break;
        case "submit":
            askForWorkLink(id);
            break;
        case "pending":
            askForPendingReason(id);
            break;
    }
}

// Pressing Enter on the login or register page works like clicking the button
function handleKey(event) {
    if (event.key !== "Enter") {
        return;
    }
    const loginIsOpen = !document.getElementById("loginPage").classList.contains("d-none");
    const registerIsOpen = !document.getElementById("registerPage").classList.contains("d-none");

    if (loginIsOpen) {
        doLogin();
    } else if (registerIsOpen) {
        doRegister();
    }
}


// ---------- 14. STARTING THE APP ----------

function startApp() {
    loadData();
    nextId = makeCounter(getBiggestId());

    // If the user was already logged in (page refresh), keep them logged in
    loggedInId = Number(sessionStorage.getItem("karyam_u")) || null;
    if (loggedInId !== null && findById(users, loggedInId) === null) {
        loggedInId = null;
    }

    dialogBox = new bootstrap.Modal(document.getElementById("dialogBox"));
    fillCompanyList();

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);

    console.log("Karyam started with " + users.length + " users");

    if (loggedInId === null) {
        showScreen("loginPage");
    } else {
        goToDashboard();
    }
}

// Start when the page has finished loading
document.addEventListener("DOMContentLoaded", startApp);
