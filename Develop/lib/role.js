const inquirer = require("inquirer");

//* WHEN I choose to view all roles
//* THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// TODO: Create the function to view all roles
async function viewAllRoles(connection, startApp) {
  try {
    const query = `
        SELECT roles.id, roles.title AS role_id, departments.name AS department, roles.salary
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id
      `;
    const [rows] = await connection.query(query);

    console.table(rows);
    startApp();
  } catch (error) {
    console.error("Failed to fetch roles from the database", error);
  }
}

//* WHEN I choose to add a role
//* THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// TODO: Create the function to add a role
async function addRole(connection, startApp) {
  try {
    const departments = await getDepartments(connection);

    const roleData = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the name of the role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary for the role:",
      },
      {
        type: "list",
        name: "department",
        message: "Select the department for the role:",
        choices: departments.map((department) => department.name),
      },
    ]);

    //* Find the selected department and get its ID
    const selectedDepartment = departments.find(
      (department) => department.name === roleData.department
    );
    const departmentId = selectedDepartment.id;

    //* Insert the new role into the database
    const query =
      "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
    const values = [roleData.title, roleData.salary, departmentId];
    await connection.query(query, values);

    console.log("Role added successfully!");
    startApp();
  } catch (error) {
    console.error("Failed to add role:", error);
  }
}

//* Helper function to retrieve departments from the database
async function getDepartments(connection) {
  const query = "SELECT id, name FROM departments";
  const [rows] = await connection.query(query);
  return rows;
}

//* exports the functions
module.exports = { viewAllRoles, addRole };
