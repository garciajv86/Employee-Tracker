const inquirer = require("inquirer");
// const { viewAllRoles } = require("./role");
// const { connection } = require("../../config/dbConfig");

//* WHEN I choose to view all employees
//* THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// TODO: Create the function to view all employees
async function viewAllEmployees(connection) {
  try {
    const query = "SELECT * FROM employees";
    const [rows] = await connection.query(query);

    console.table(rows);
  } catch (error) {
    console.error("Failed to fetch employees from the database", error);
  }
}

//* WHEN I choose to add an employee
//* THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// TODO: Create the function to add an employees
async function addEmployee(connection) {
  try {
    const [roles] = await connection.query("SELECT id, title FROM roles");
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const [managers] = await connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees");
    const managerChoices = [
      { name: "None", value: null }, // Option for no manager
      ...managers.map((manager) => ({
        name: manager.full_name,
        value: manager.id,
      })),
    ];

    const prompt = inquirer.createPromptModule();

    const employeeData = await prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the employee's manager:",
        choices: managerChoices,
      },
    ]);

    const query = "INSERT INTO employees (manager_id, role_id, first_name, last_name) VALUES (?, ?, ?, ?)";
    await connection.query(query, [employeeData.managerId, employeeData.roleId, employeeData.firstName, employeeData.lastName]);

    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Failed to add employee:", error);
  }
}


//* WHEN I choose to update an employee role
//* THEN I am prompted to select an employee to update and their new role and this information is updated in the database

//* exports the functions
module.exports = { viewAllEmployees, addEmployee };
