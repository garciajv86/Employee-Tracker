const inquirer = require('inquirer');
const connection = require('../db/connection');

//* WHEN I choose to view all departments
//* THEN I am presented with a formatted table showing department names and department ids

// TODO: Create the function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

//* WHEN I choose to add a department
//* THEN I am prompted to enter the name of the department and that department is added to the database

// TODO: Create the function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ])
    .then(answer => {
      connection.query('INSERT INTO department SET ?', answer, (err, results) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApp();
      });
    });
}

//* exports the functions
module.exports = { viewAllDepartments, addDepartment };
