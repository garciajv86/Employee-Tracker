require("dotenv").config();
const {
  buildConnectionOptions,
  createConnection,
} = require("./config/dbConfig");
const inquirer = require("inquirer");
const department = require("./Develop/lib/department");
const employee = require("./Develop/lib/employee");
const role = require("./Develop/lib/role");

//* Function to start the application
async function startApp() {
  const connection = await createConnection(buildConnectionOptions());

  const { createPromptModule } = inquirer;
  const prompt = createPromptModule();

  const selectedOption = await prompt([
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
  ]);

  try {
    switch (selectedOption.action) {
      case "View all departments":
        department.viewAllDepartments(connection);
        break;
      case "Add a department":
        await department.addDepartment(connection);
        break;
      case "View all employees":
        employee.viewAllEmployees(connection);
        break;
      case "Add an employee":
        await employee.addEmployee(connection);
        break;
      case "Update an employee role":
        await employee.updateEmployeeRole(connection);
        break;
      case "View all roles":
        role.viewAllRoles(connection);
        break;
      case "Add a role":
        await role.addRole(connection);
        break;
      case "Exit":
        console.log("Goodbye!");
        process.exit(0);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the database connection
    connection.end();
  }
}

startApp();
