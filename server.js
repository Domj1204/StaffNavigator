import inquirer from 'inquirer';
import mysql from 'mysql2';
import 'console.table';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectTimeout: 10000
});

connection.connect ((err) =>{
    if (err) throw err;
    console.log("StaffNavigator Connected to the database!");
    start();
})

async function start() {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'Option',
            message: 'What would you like to do?',
            choices:[
                'View All Employees',
                'Add Employee',
                'Add Employee Manager',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'View Budget by Department',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        }
    ]).then(function(result) {
        console.log("you entered: " + result.Option);

        switch (result.Option) {
            case "View All Employees":
              viewallEmployees();
              break;
            case "Add Employee":
              addEmployee();
              break;
            case "Add Employee Manager":
              addEmployeeManager();
              break;
            case "Update Employee Role":
              updateemployeeRole();
              break;
            case "Update Employee Manager":
              updateEmployeeManager();
              break;
            case "View Employees by Manager":
              viewEmployeesByManager();
              break;
            case "View Employees by Department":
              viewEmployeesByDepartment();
              break;
            case "Delete Department":
              deleteDepartment();
              break;
            case "Delete Role":
              deleteRole();
              break;
            case "Delete Employee":
              deleteEmployee();
              break;
            case "View Budget by Department":
              viewBudgetByDepartment();
              break;
            case "View All Roles":
              viewallRoles();
              break;
            case "Add Role":
              addRole();
              break;
            case "View All Departments":
              viewallDepartments();
              break;
            case "Add Department":
              addDepartment();
              break;
            case "Quit":
              quit();
              break;
        }
    });
  }

async function viewallEmployees() {
    let query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id 
    LEFT JOIN department d ON r.department_id = d.id 
    LEFT JOIN employee m ON e.manager_id = m.id
`;
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

async function addEmployee() {
    inquirer
      .prompt([
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "eeFirstName"
        },
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "eeLastName"
          },
          {
            type: "input",
            message: "What is the employee's role id number?",
            name: "roleID"
          },
          {
            type: "input",
            message: "What is the manager id number?",
            name: "managerID"
          }
      ])
      .then(function(answer) {

      
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.eeFirstName, answer.eeLastName, answer.roleID, answer.managerID || null], function(err, res) {
          if (err) throw err;
          console.table(res);
          start();
        });
      });
}
async function addEmployeeManager() {
  connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NULL', (err, employeesWithoutManagers) => {
      if (err) {
          console.error("Error fetching employees without managers: ", err);
          return start();
      }

      inquirer.prompt([
          {
              name: 'employeeId',
              type: 'list',
              message: 'Select an employee to assign a manager to:',
              choices: employeesWithoutManagers.map(emp => ({ name: emp.name, value: emp.id }))
          }
      ]).then(answer => {
          const employeeId = answer.employeeId;

          // Fetch all possible managers (assuming any employee could be a manager)
          connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, potentialManagers) => {
              if (err) {
                  console.error("Error fetching potential managers: ", err);
                  return start();
              }

              // Exclude the employee being updated from the list of potential managers
              const managerChoices = potentialManagers.filter(manager => manager.value !== employeeId);

              inquirer.prompt([
                  {
                      name: 'managerId',
                      type: 'list',
                      message: 'Select the manager:',
                      choices: managerChoices.map(manager => ({ name: manager.name, value: manager.id }))
                  }
              ]).then(answer => {
                  // Assign the selected manager to the employee
                  connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [answer.managerId, employeeId], (err, res) => {
                      if (err) {
                          console.error("Error assigning manager to employee: ", err);
                          return start();
                      }

                      console.log("Manager assigned to employee successfully.");
                      start();
                  });
              });
          });
      });
  });
}

async function updateemployeeRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Which employee would you like to update?",
          name: "eeUpdate"
        },
  
        {
          type: "input",
          message: "What do you want to update to?",
          name: "updateRole"
        }
      ])
      .then(function(answer) {
        // let query = `INSERT INTO department (name) VALUES ("${answer.deptName}")`
        //let query = `'UPDATE employee SET role_id=${answer.updateRole} WHERE first_name= ${answer.eeUpdate}`;
        //console.log(query);
  
        connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',[answer.updateRole, answer.eeUpdate],function(err, res) {
          if (err) throw err;
          console.table(res);
          start();
        });
      });
  }

async function updateEmployeeManager() {
  connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, employees) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'employeeId',
              type: 'list',
              message: 'Select an employee to update their manager:',
              choices: employees.map(employee => ({ name: employee.name, value: employee.id }))
          },
          {
              name: 'managerId',
              type: 'list',
              message: 'Select the new manager:',
              choices: employees.map(manager => ({ name: manager.name, value: manager.id }))
          }
      ]).then(answers => {
          connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.managerId, answers.employeeId], (err, res) => {
              if (err) throw err;
              console.log('Employee manager updated successfully.');
              start();
          });
      });
  });
}

async function viewEmployeesByManager() {
  connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NOT NULL', (err, managers) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'managerId',
              type: 'list',
              message: 'Select a manager to view their employees:',
              choices: managers.map(manager => ({ name: manager.name, value: manager.id }))
          }
      ]).then(answer => {
          connection.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id = ?', [answer.managerId], (err, res) => {
              if (err) throw err;
              console.table(res);
              start();
          });
      });
  });
}

async function viewEmployeesByDepartment() {
  connection.query('SELECT id, name FROM department', (err, departments) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'departmentId',
              type: 'list',
              message: 'Select a department to view its employees:',
              choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
          }
      ]).then(answer => {
          connection.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.department_id = ?', [answer.departmentId], (err, res) => {
              if (err) throw err;
              console.table(res);
              start();
          });
      });
  });
}

async function deleteDepartment() {
  connection.query('SELECT id, name FROM department', (err, departments) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'departmentId',
              type: 'list',
              message: 'Select a department to delete:',
              choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
          }
      ]).then(answer => {
          connection.query('DELETE FROM department WHERE id = ?', [answer.departmentId], (err, res) => {
              if (err) throw err;
              console.log('Department deleted successfully.');
              start();
          });
      });
  });
}

async function deleteRole() {
  connection.query('SELECT id, title FROM role', (err, roles) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'roleId',
              type: 'list',
              message: 'Select a role to delete:',
              choices: roles.map(role => ({ name: role.title, value: role.id }))
          }
      ]).then(answer => {
          connection.query('DELETE FROM role WHERE id = ?', [answer.roleId], (err, res) => {
              if (err) throw err;
              console.log('Role deleted successfully.');
              start();
          });
      });
  });
}

async function deleteEmployee() {
  connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, employees) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'employeeId',
              type: 'list',
              message: 'Select an employee to delete:',
              choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
          }
      ]).then(answer => {
          connection.query('DELETE FROM employee WHERE id = ?', [answer.employeeId], (err, res) => {
              if (err) throw err;
              console.log('Employee deleted successfully.');
              start();
          });
      });
  });
}

async function viewBudgetByDepartment() {
  connection.query('SELECT id, name FROM department', (err, departments) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'departmentId',
              type: 'list',
              message: 'Select a department to view its total utilized budget:',
              choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
          }
      ]).then(answer => {
          connection.query('SELECT SUM(salary) AS totalBudget FROM role WHERE department_id = ?', [answer.departmentId], (err, res) => {
              if (err) throw err;
              console.log(`Total Utilized Budget: $${res[0].totalBudget}`);
              start();
          });
      });
  });
}


async function viewallRoles() {
    
    let query = "Select * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

async function addRole() {
    inquirer
      .prompt([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "roleName"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salaryTotal"
        },
        {
            type: "input",
            message: "What is the department id number",
            name: "deptID"
        }
      ])
      .then(function(answer) {

        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], function(err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
      });
}

async function viewallDepartments() {
    // select from the db
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
    // show the result to the user (console.table)
  }
  
async function addDepartment() {


    inquirer.prompt({
      
        type: "input",
        message: "What is the name of the department?",
        name: "deptName"

    }).then(function(answer){



        connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName] , function(err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
      });
}

async function quit() {
    await connection.end();
    console.log('Disconnected from database.');
    process.exit();
}
