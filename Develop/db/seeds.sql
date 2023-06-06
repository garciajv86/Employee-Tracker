--* Insert departments
INSERT INTO departments (name)
VALUES ("Software Development"),
       ("IT"),
       ("Cyber Security");

--* Insert roles
INSERT INTO roles (department_id, title, salary)
VALUES (1, "Software Developer", 280000),
       (2, "IT Manager", 250000),
       (3, "Cyber Security Specialist", 200000);

--* Insert employees
INSERT INTO employees(manager_id, role_id, first_name, last_name)
VALUES (2, 1, , "John", "Doe" )
       (NULL, 2, , "Jane", "Smith" )
       (2, 1, , "Michael", "Johnson" )