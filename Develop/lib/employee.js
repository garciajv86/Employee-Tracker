const inquirer = require("inquirer");
//* WHEN I choose to view all employees
//* THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// TODO: Create the function to view all employees
async function viewAllEmployees(connection, startApp) {
  try {
    const query = `
      SELECT 
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title AS role,
        roles.salary,
        departments.name AS department,
        CONCAT(managers.first_name, ' ', managers.last_name) AS manager
      FROM 
        employees
      INNER JOIN roles ON employees.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees managers ON employees.manager_id = managers.id
    `;
    const [rows] = await connection.query(query);

    console.table(rows);
    startApp();
  } catch (error) {
    console.error("Failed to fetch employees from the database", error);
  }
}

//* WHEN I choose to add an employee
//* THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// TODO: Create the function to add an employees
async function addEmployee(connection, startApp) {
  try {
    const [roles] = await connection.query("SELECT id, title FROM roles");
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const [managers] = await connection.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees"
    );
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

    const query =
      "INSERT INTO employees (manager_id, role_id, first_name, last_name) VALUES (?, ?, ?, ?)";
    await connection.query(query, [
      employeeData.managerId,
      employeeData.roleId,
      employeeData.firstName,
      employeeData.lastName,
    ]);

    console.log("Employee added successfully!");
    startApp();
  } catch (error) {
    console.error("Failed to add employee:", error);
  }
}

//* WHEN I choose to update an employee role
//* THEN I am prompted to select an employee to update and their new role and this information is updated in the database

async function updateEmployeeRole(connection, startApp) {
  try {
    const [employees] = await connection.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees"
    );
    const employeeChoices = employees.map((employee) => ({
      name: employee.full_name,
      value: employee.id,
    }));

    const [roles] = await connection.query("SELECT id, title FROM roles");
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const prompt = inquirer.createPromptModule();

    const getUpdateData = async () => {
      return prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee to update:",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "roleId",
          message: "Select the new role for the employee:",
          choices: roleChoices,
        },
      ]).then((answers) => {
        return prompt([
          {
            type: "list",
            name: "managerId",
            message: "Select the new manager for the employee:",
            choices: [
              { name: "None", value: null },
              ...employeeChoices.filter(
                (employee) => employee.value !== answers.employeeId
              ),
            ],
          },
        ]).then((managerAnswer) => {
          return {
            ...answers,
            managerId: managerAnswer.managerId,
          };
        });
      });
    };

    const updateData = await getUpdateData();

    const query =
      "UPDATE employees SET role_id = ?, manager_id = ? WHERE id = ?";
    await connection.query(query, [
      updateData.roleId,
      updateData.managerId,
      updateData.employeeId,
    ]);

    console.log("Employee role and manager updated successfully!");
    startApp();
  } catch (error) {
    console.error("Failed to update employee role and manager:", error);
  }
}

//* exports the functions
module.exports = { viewAllEmployees, addEmployee, updateEmployeeRole };
