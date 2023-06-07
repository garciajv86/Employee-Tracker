const inquirer = require("inquirer");
const connection = require("../../config/dbConfig");

//* WHEN I choose to view all roles
//* THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// TODO: Create the function to view all roles
function viewAllRoles() {
  connection.query(
    `
    SELECT r.id, r.title, d.name AS department, r.salary
    FROM roles AS r
    INNER JOIN departments AS d ON r.department_id = d.id
  `,
    (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp();
    }
  );
}

//* WHEN I choose to add a role
//* THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// TODO: Create the function to add a role
function addRole() {
  // Fetch departments for prompt choices
  fetchDepartments()
    .then((departments) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Enter the title of the role:",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter the salary for the role:",
          },
          {
            type: "list",
            name: "department_id",
            message: "Select the department for the role:",
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO roles SET ?",
            answer,
            (err, results) => {
              if (err) throw err;
              console.log("Role added successfully!");
              startApp();
            }
          );
        });
    })
    .catch((err) => {
      console.error("Error fetching departments:", err);
      startApp();
    });
}

// Helper function to fetch departments from the database
function fetchDepartments() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM departments", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

//* exports the functions
module.exports = { viewAllRoles, addRole };
