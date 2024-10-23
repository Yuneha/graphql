let user;

let auditDone = 0;
let auditReceived = 0;
let piscineGoXp = 0;
let div01Xp = 0;
let piscineJsXp = 0;

let skillProg = 0;
let skillGo = 0;
let skillBackEnd = 0;
let skillFrontEnd = 0;
let skillAlgo = 0;
let skillJs = 0;

let auditDoneTransaction = [];
let auditReceivedTransaction = [];
let piscineGoTtransaction = [];
let div01Transaction = [];
let piscineJsTransaction = [];

const query_user = `
    {
      user {
          id
          login
          attrs
      }
    }
`;

const query_transaction = `
  {
    transaction(where: { userId: { _eq: 0}}) {
      type
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

async function login() {
  let usernameLogin = document.getElementById("username_login").value;
  let passwordLogin = document.getElementById("password_login").value;

  if (usernameLogin === "" || passwordLogin === "") {
    document.getElementById("wrong_user").innerHTML = "Field(s) empty";
    document.getElementById("wrong_user").style.display = "block";
  } else {
    return getUser(usernameLogin, passwordLogin, query_user)
      .then((data) => {
        if (data === "error") {
          return Promise.reject(new Error("Error in authentification"));
        }
        // Save the data of the user in user
        user = data.data.user[0];
        return query_transaction.replace("0", user.id);
      })
      .then(async (query) => {
        return getUser(usernameLogin, passwordLogin, query).then((data) => {
          data.data.transaction.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          // Get data in function of type
          data.data.transaction.forEach((data) => {
            switch (data.type) {
              // Get audit done
              case "up":
                auditDone += data.amount;
                auditDoneTransaction.push(data);
                break;
              // Get audit received
              case "down":
                auditReceived += data.amount;
                auditReceivedTransaction.push(data);
                break;
              // Get total XP
              case "xp":
                if (
                  data.createdAt.substring(0, 7) === "2023-06" ||
                  data.createdAt.substring(0, 7) === "2023-07"
                ) {
                  piscineGoXp += data.amount;
                  piscineGoTtransaction.push(data);
                } else if (
                  data.createdAt.substring(0, 7) === "2024-05" &&
                  (data.object.type === "raid" ||
                    data.object.type === "exercise")
                ) {
                  piscineJsXp += data.amount;
                  piscineJsTransaction.push(data);
                } else {
                  div01Xp += data.amount;
                  div01Transaction.push(data);
                }
                break;
              case "skill_prog":
                if (skillProg < data.amount) {
                  skillProg = data.amount;
                }
                break;
              case "skill_go":
                if (skillGo < data.amount) {
                  skillGo = data.amount;
                }
                break;
              case "skill_back-end":
                if (skillBackEnd < data.amount) {
                  skillBackEnd = data.amount;
                }
                break;
              case "skill_front-end":
                if (skillFrontEnd < data.amount) {
                  skillFrontEnd = data.amount;
                }
                break;
              case "skill_algo":
                if (skillAlgo < data.amount) {
                  skillAlgo = data.amount;
                }
                break;
              case "skill_js":
                if (skillJs < data.amount) {
                  skillJs = data.amount;
                }
                break;
            }
          });
          return Promise.resolve();
        });
      })
      .then(() => {
        document.getElementById("login_page").style.display = "none";
        document.getElementById("main_page").style.display = "block";
        document.getElementById(
          "dashboard"
        ).innerHTML = `${user.attrs.firstName} ${user.attrs.lastName}`;
        cursus();
      });
  }
}

function cursus() {
  // Display current XP
  document.getElementById("xp").innerHTML = `${
    xpFormat(div01Xp).Number + xpFormat(div01Xp).Unity
  }`;

  // Display audit done
  auditDoneFormatted = xpFormat(auditDone).Number + xpFormat(auditDone).Unity;
  document.getElementById(
    "audit_done"
  ).innerHTML = `Done: ${auditDoneFormatted}`;

  // Display audit received
  auditReceivedFormatted =
    xpFormat(auditReceived).Number + xpFormat(auditReceived).Unity;
  document.getElementById(
    "audit_received"
  ).innerHTML = `Received: ${auditReceivedFormatted}`;

  // Display ratio
  ratio = Math.round((auditDone / auditReceived) * 10) / 10;
  document.getElementById("audit_ratio").innerHTML = `${ratio}`;

  // Display charts
  renderAuditChart();
  skillsChart();
}

async function getUser(username, password, query) {
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);

  return fetch("https://zone01normandie.org/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  })
    .then((response) => {
      if (response.status != 200) {
        return Promise.reject(new Error("Status not 200"));
      }
      return response.json();
    })
    .then(async (data) => {
      return fetch(
        "https://zone01normandie.org/api/graphql-engine/v1/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data}`,
          },
          body: JSON.stringify({ query: query }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((_) => {
      // Display error message
      document.getElementById("wrong_user").innerHTML =
        "Wrong Username/Email or Password";
      document.getElementById("wrong_user").style.display = "block";
      return "error";
    });
}

function xpFormat(xp) {
  let unity = " B";
  let number = xp;
  if (xp >= 1000) {
    number = xp / 1000;
    unity = " kB";
  }
  if (number >= 1000) {
    number = number / 1000;
    unity = " MB";
  }
  const result = {
    Number: number.toFixed(2),
    Unity: unity,
  };
  return result;
}
