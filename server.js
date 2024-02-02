require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: "process.env.DB_HOST",
    port: "3306",
    user: "process.env.DB_USER",
    password: "process.env.DB_PASS",
    database: "process.env.DB_DATABASE"
});

connection.connect ((err) =>{
    if (err) throw err;
    console.log(     StaffNavigator    );
    console.log("Connected to the database!");

    start();
})

function start() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'Option',
            message: 'What would you like to do?',
            choices:[
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        }
    ]).then(function(result) {
        console.log("you entered: " + result.option);

        switch (result.option) {
            case "View All Employees":
              viewallEmployees();
              break;
            case "Add Employee":
              addEmployee();
              break;
            case "Update Employee Role":
              updateemployeeRole();
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
            default:
              quit();
        }
    });
  }

function viewallEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addEmployee() {
    inquirer
      .prompt([
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "eeFirstNßame"
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

      
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.eeFirstName, answer.eeLastName, answer.roleID, answer.managerID], function(err, res) {
          if (err) throw err;
          console.table(res);
          start();
        });
      });
}

function updateemployeeRole() {
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

function viewallRoles() {
    
    let query = "Select * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addRole() {
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

function viewallDepartments() {
    // select from the db
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
    // show the result to the user (console.table)
  }
  
  function addDepartment() {


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

function quit() {
    connection.end();
    process.exit();
}
