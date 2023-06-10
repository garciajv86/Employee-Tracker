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
  const appTitle = `
  _______________________________________________________________________________
  |                                                                             |
  |                                                                             |
  |     EEEEE   M       M  PPPPPP   L      OOOOOOOOO  Y     Y  EEEEE  EEEEE     |               
  |     E       M M   M M  P    P   L      O       O   Y   Y   E      E         |
  |     EEEE    M  M M  M  PPPPPP   L      O       O     Y     EEEE   EEEE      |  
  |     E       M   M   M  P        L      O       O     Y     E      E         |
  |     EEEEE   M       M  P        LLLLL  OOOOOOOOO     Y     EEEEE  EEEEE     |           
  |                                                                             |
  |                                                                             |
  |     M       M  AAAAA  N     N  AAAAA   GGGG  EEEEE  RRRR                    |
  |     MM     MM  A   A  NN    N  A   A  G      E      R   R                   |
  |     M M   M M  AAAAA  N N   N  AAAAA  G  GG  EEEE   RRRR                    |
  |     M  M M  M  A   A  N  N  N  A   A  G   G  E      R  R                    |
  |     M   M   M  A   A  N   N N  A   A   GGG   EEEEE  R   R                   |
  |                                                                             |
  |                                                                             |
  | ____________________________________________________________________________|                                                 
`;

  console.log(appTitle);
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
        department.viewAllDepartments(connection, startApp);
        break;
      case "Add a department":
        await department.addDepartment(connection, startApp);
        break;
      case "View all employees":
        employee.viewAllEmployees(connection), startApp;
        break;
      case "Add an employee":
        await employee.addEmployee(connection, startApp);
        break;
      case "Update an employee role":
        await employee.updateEmployeeRole(connection, startApp);
        break;
      case "View all roles":
        role.viewAllRoles(connection, startApp);
        break;
      case "Add a role":
        await role.addRole(connection, startApp);
        break;
      case "Exit":
        console.log("Goodbye!");
        process.exit(0);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    //* Close the database connection
    connection.end();
  }
}

startApp();
