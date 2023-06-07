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
    const [roles] = await connection.query("SELECT title FROM roles");
    const roleTitles = roles.map((role) => role.title);

    if (roleTitles.length === 0) {
      console.error(
        "No roles found. Please add roles before adding an employee."
      );
      return;
    }

    const [managers] = await connection.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees"
    );
    const managerChoices = managers.map((manager) => ({
      name: manager.full_name,
      value: manager.id,
    }));

    const prompt = inquirer.createPromptModule();

    const employeeData = await prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name:",
      },
      {
        type: "list",
        name: "role",
        message: "Select employee's role:",
        choices: roleTitles,
      },
      {
        type: "list",
        name: "managerId",
        message: "Select employee's manager:",
        choices: managerChoices,
      },
    ]);

    // Get the ID of the selected role
    const [selectedRole] = await connection.query(
      "SELECT id FROM roles WHERE title = ?",
      [employeeData.role]
    );
    const roleId = selectedRole[0].id;

    const query =
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    await connection.query(query, [
      employeeData.firstName,
      employeeData.lastName,
      roleId,
      employeeData.managerId,
    ]);

    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Failed to add employee:", error);
  }
}

//* WHEN I choose to update an employee role
//* THEN I am prompted to select an employee to update and their new role and this information is updated in the database

//* exports the functions
module.exports = { viewAllEmployees, addEmployee };
