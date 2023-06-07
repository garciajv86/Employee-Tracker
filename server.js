const inquirer = require("inquirer");
const department = require("./Develop/lib/department");
const employee = require("./Develop/lib/employee");
const role = require("./Develop/lib/role");

//* Function to start the application
function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "Add a department",
          "View all employees",
          "Add an employee",
          "Update an employee role",
          "View all roles",
          "Add a role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          department.viewAllDepartments();
          break;
        case "Add a department":
          department.addDepartment();
          break;
        case "View all employees":
          employee.viewAllEmployees();
          break;
        case "Add an employee":
          employee.addEmployee();
          break;
        case "Update an employee role":
          employee.updateEmployeeRole();
          break;
        case "View all roles":
          role.viewAllRoles();
          break;
        case "Add a role":
          role.addRole();
          break;
        case "Exit":
          console.log("Goodbye!");
          process.exit(0);
      }
    })
    .catch((err) => {
      console.error("Error occurred:", err);
    });
}

// Start the application
startApp();