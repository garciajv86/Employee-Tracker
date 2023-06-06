const inquirer = require('inquirer');
const connection = require('../db/connection');

//* WHEN I choose to view all employees
//* THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// TODO: Create the function to view all employees
function viewAllEmployees() {
    connection.query(`
      SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees AS e
      INNER JOIN roles AS r ON e.role_id = r.id
      INNER JOIN departments AS d ON r.department_id = d.id
      LEFT JOIN employees AS m ON e.manager_id = m.id
    `, (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp();
    });
  }

//* WHEN I choose to add an employee
//* THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// TODO: Create the function to add an employees
function addEmployee() {
    //* Fetch roles and employees for prompt choices
    Promise.all([fetchRoles(), fetchEmployees()])
      .then(([roles, employees]) => {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'Enter the first name of the employee:'
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'Enter the last name of the employee:'
            },
            {
              type: 'list',
              name: 'role_id',
              message: 'Select the role of the employee:',
              choices: roles.map(role => ({
                name: role.title,
                value: role.id
              }))
            },
            {
              type: 'list',
              name: 'manager_id',
              message: 'Select the manager of the employee:',
              choices: [
                { name: 'None', value: null },
                ...employees.map(employee => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id
                }))
              ]
            }
          ])
          .then(answer => {
            connection.query('INSERT INTO employees SET ?', answer, (err, results) => {
              if (err) throw err;
              console.log('Employee added successfully!');
              startApp();
            });
          });
      })
      .catch(err => {
        console.error('Error fetching roles and employees:', err);
        startApp();
      });
  }
  
  // Helper function to fetch roles from the database
  function fetchRoles() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM roles', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

//* WHEN I choose to update an employee role
//* THEN I am prompted to select an employee to update and their new role and this information is updated in the database


// TODO: Helper function to fetch roles from the database
function fetchRoles() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM roles', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
  
  // Helper function to fetch employees from the database
  function fetchEmployees() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employees', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
  
  //* exports the functions
  module.exports = { viewAllEmployees, addEmployee };