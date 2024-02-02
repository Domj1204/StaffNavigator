
USE staffNavigator_db;

INSERT INTO department (name)
VALUES   ("Information Technology"), ("Human Resources"), ("Marketing"), ("Sales"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("System Administrator", 70000.00, 1), ("HR Manager", 65000.00, 2), ("Marketing Coordinator", 60000.00, 3), ("Sales Representative", 55000.00, 4), ("Financial Analyst", 75000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alice", "Johnson", 1, NULL),  ("Bob", "Smith", 2, NULL), ("Charlie", "Brown", 3, NULL), ("Diana", "Prince", 4, NULL), ("Ethan", "Hunt", 5, NULL);