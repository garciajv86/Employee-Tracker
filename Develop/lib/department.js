const inquirer = require("inquirer");

//* WHEN I choose to view all departments
//* THEN I am presented with a formatted table showing department names and department ids

// TODO: Create the function to view all departments
async function viewAllDepartments(connection, startApp) {
  try {
    //* Execute the SQL query to fetch all departments
    const query = "SELECT * FROM departments";
    const [rows] = await connection.query(query);

    //* Use console.table to display the departments
    console.table(rows);
    startApp();
  } catch (error) {
    throw new Error("Failed to fetch departments from the database");
  }
}

//* WHEN I choose to add a department
//* THEN I am prompted to enter the name of the department and that department is added to the database

// TODO: Create the function to add a department
async function addDepartment(connection, startApp) {
  try {
    //* Prompt for the department name
    const { departmentName } = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      },
    ]);

    //* Execute the SQL query to insert the new department into the database
    const query = "INSERT INTO departments (name) VALUES (?)";
    await connection.query(query, departmentName);

    console.log("Department added successfully!");
    startApp();
  } catch (error) {
    console.error("Failed to add department:", error);
  }
}

//* exports the functions
module.exports = { viewAllDepartments, addDepartment };
