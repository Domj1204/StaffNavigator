# StaffNavigator - Employee Management System

## Introduction
Staff Navigator is a comprehensive command-line employee management system designed to facilitate the tracking and organization of employee information within a company. This system allows for easy management of employee details, roles, departments, and salaries, offering a user-friendly interface through the inquirer package for interactions. It is built on Node.js and uses MySQL for data persistence, ensuring efficient and reliable handling of company data.

## Table of Contents
Introduction
Features
Installation
Prerequisites
Setup
Usage
Starting the Application
Navigating the Menu
Application Structure
Database Schema
Server Logic
Technologies Used
Contributing
License
Contact

## Features
Staff Navigator offers a multitude of features that allow for detailed and organized employee management:

View All Employees: Displays a complete list of employees, including their IDs, first and last names, roles, departments, salaries, and managers.
Add Employee: Adds a new employee record to the database with details such as name, role, and assigned manager.
Update Employee Role: Allows changing the role of an existing employee, which can affect their department and salary.
View All Roles: Lists all available roles within the company along with associated salaries and department IDs.
Add Role: Introduces a new role to the company, requiring a title, salary, and associated department.
View All Departments: Shows a list of all departments within the organization.
Add Department: Creates a new department, expanding the organizational structure.
Quit: Exits the application.

## Installation
## Prerequisites
Before setting up Staff Navigator, ensure you have the following installed:

Node.js - Download & Install Node.js and the npm package manager.
MySQL - Download & Install MySQL, and make sure it's running on your system.
Setup
To get Staff Navigator up and running on your local machine, follow these steps:

1. Clone the Repository
2. Install Node Modules
3. Create a .env File
    Copy the .env.example file to a new file named .env and fill in your MySQL database credentials:
4. Initialize the Database
    Run the provided schema.sql in your MySQL workbench or command line to set up the database schema. Then, populate the database with initial data using seeds.sql.
5. Start the Application

## Usage

## Starting the Application
To start Staff Navigator, navigate to the application directory in your terminal and run node server.js. The main menu will prompt you with options to manage your employee database.

## Navigating the Menu
Use the arrow keys to navigate up and down through the action list. Press Enter to select an action, and follow the subsequent prompts to view data or input new information.

## Application Structure
## Database Schema
The Staff Navigator database consists of three main tables:

department: Stores department names and their unique IDs.
role: Contains roles, associated salaries, and links to departments through department_id.
employee: Holds employee information, including their role (linked through role_id) and their manager (linked through manager_id).

## Server Logic
The server.js file contains the logic for:

Establishing a connection to the MySQL database.
Presenting the main menu using inquirer.
Handling user input and performing SQL queries based on the selected action.

## Technologies Used
Node.js: Runtime environment for executing JavaScript code server-side.
MySQL: Relational database management system for storing and retrieving data.
Inquirer.js: Library for creating interactive command-line interfaces.
console.table: Plugin to print MySQL rows to the console in a table format.
dotenv: Module to load environment variables from a .env file.
## Contributing
Contributions to Staff Navigator are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit them (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

Please ensure your code adheres to the existing style of the project to maintain consistency.

## License
Staff Navigator is released under the [MIT License](LICENSE). By contributing to the project, you agree to abide by its terms.

## Contact
For support or queries regarding Staff Navigator, please contact [Your Name](your-email@example.com).

---

## Application Structure
Staff Navigator is structured into several components for modularity and ease of understanding:

- **Database Schema (`/db`)**: Contains SQL files for defining the database structure and initial seed data.
- **Server Logic (`server.js`)**: Core application logic for initiating the database connection and handling user interaction.
- **Package Files (`package.json` & `package-lock.json`)**: Define project metadata and dependencies.

### Database Schema
The database schema is essential to how Staff Navigator functions. Here are the primary tables and their roles:

- **`department` Table**: Stores department data with `id` and `name` columns.
- **`role` Table**: Contains role details, with each role having an `id`, `title`, `salary`, and a `department_id` that references the `department` table.
- **`employee` Table**: Lists employees, each with an `id`, `first_name`, `last_name`, a `role_id` linking to the `role` table, and a `manager_id` that is also a reference to the `employee` table itself for cases where an employee is also a manager.

### Server Logic
The server logic is designed around asynchronous JavaScript, using async/await syntax for clear, linear flow despite the underlying asynchronous nature of database operations. It is organized into several key functions, each corresponding to a feature of the application:

- **`start()`**: Displays the main menu and handles the user's choice.
- **`viewallEmployees()`**: Retrieves and displays a formatted table of all employees.
- **`addEmployee()`**: Guides the user through adding a new employee.
- **`updateEmployeeRole()`**: Facilitates updating an employee's role.
- **`viewallRoles()`**: Shows all roles in a table format.
- **`addRole()`**: Allows the user to add a new role to the database.
- **`viewallDepartments()`**: Lists all departments.
- **`addDepartment()`**: Enables the creation of a new department.
- **`quit()`**: Closes the database connection and exits the application.

For each action, a corresponding SQL query is crafted and executed to interact with the MySQL database, ensuring that user input is reflected in real-time in the persistent data store.

## Technologies Used
- **[Node.js](https://nodejs.org/)**: The runtime environment for the entire application.
- **[MySQL](https://www.mysql.com/)**: Used for storing and managing all application data.
- **[Inquirer.js](https://www.npmjs.com/package/inquirer)**: Powers the interactive command-line user interface.
- **[console.table](https://www.npmjs.com/package/console.table)**: Enhances the output of SQL query results, making them easy to read and understand.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Manages environment variables for MySQL database configuration.

Each of these technologies plays a role in ensuring that Staff Navigator is both powerful and user-friendly, providing a robust backend with a simple and intuitive interface for users.
