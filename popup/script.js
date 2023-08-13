let lc_api = "https://leetcode-stats-api.herokuapp.com/";

let no_of_users = 0,
  users_rendered = 0;

function update_loader() {
  var loader = document.getElementById("loader");
  var content = document.getElementById("content");
  console.log(no_of_users, users_rendered);
  if (no_of_users === users_rendered) {
    loader.style.display = "none";
    content.style.display = "block";
  } else {
    loader.style.display = "block";
    content.style.display = "none";
  }
}

async function set_to_ls(users) {
  var obj = { lc_users: [] };
  obj.lc_users = users;
  await browser.storage.local.set(obj);
}
async function enter_user(user) {
  let localStorageItems = await browser.storage.local.get();
  var users = [];
  if (typeof localStorageItems.lc_users !== "undefined") {
    users.push(...localStorageItems.lc_users);
  }
  if (!users.includes(user)) {
    users.push(user);
    set_to_ls(users);
    no_of_users++;
    render_table_row(user);
  }
}

async function delete_user(event) {
  var user = event.target.getAttribute("data-field");
  let localStorageItems = await browser.storage.local.get();
  var users = localStorageItems.lc_users;
  if (users.includes(user)) {
    users = users.filter((e) => e !== user);
    set_to_ls(users);
    no_of_users--;
    document.getElementById(user).remove();
    users_rendered--;
  }
}

function render_table_row(user) {
  var table = document.getElementById("tableBody");
  fetch(lc_api + user)
    .then((rsp) => rsp.json())
    .then((jsdata) => {
      $(function () {
        row = document.createElement("tr");
        row.setAttribute("id", user);
        row.classList =
          "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
        c0 = document.createElement("td");
        a = document.createElement("a");
        a.textContent = user;
        a.href = "https://leetcode.com/".concat(user);
        a.target = "_blank";
        c0.appendChild(a);
        row.appendChild(c0);
        c1 = document.createElement("td");
        c1.textContent = jsdata.totalSolved;
        row.appendChild(c1);
        c2 = document.createElement("td");
        c2.textContent = jsdata.hardSolved;
        row.appendChild(c2);
        c3 = document.createElement("td");
        c3.textContent = jsdata.mediumSolved;
        row.appendChild(c3);
        c4 = document.createElement("td");
        c4.textContent = jsdata.easySolved;
        row.appendChild(c4);
        c5 = document.createElement("td");
        let btn = document.createElement("button");
        btn.innerHTML = "Delete";
        btn.setAttribute("data-field", user);
        btn.setAttribute("type", "button");
        btn.onclick = delete_user;
        c5.appendChild(btn);
        row.appendChild(c5);
        table.appendChild(row);
        users_rendered++;
        update_loader();
      });
    })
    .catch((err) => {
      throw err;
    });
}

document.getElementById("add-user-btn").addEventListener("click", (event) => {
  var input = document.getElementById("add-user-input");
  enter_user(input.value);
  input.value = "";
});

$(document).ready(async function () {
  const localStorageItems = await browser.storage.local.get();
  var users = [];
  if (typeof localStorageItems.lc_users !== "undefined") {
    users.push(...localStorageItems.lc_users);
    no_of_users = users.length;
    console.log(no_of_users);
  }
  for (const user of users) {
    render_table_row(user);
  }
  update_loader();
});
