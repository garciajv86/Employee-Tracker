-- Insert departments
INSERT INTO departments (name)
VALUES ("Software Development"),
       ("IT"),
       ("Cyber Security");

-- Insert roles
INSERT INTO roles (department_id, title, salary)
VALUES (1, "IT Manager", 250000),
       (2, "Software Developer", 280000),
       (3, "Cyber Security Specialist", 200000);

-- Insert employees
INSERT INTO employees(manager_id, role_id, first_name, last_name)
VALUES (NULL, 1, "Jane", "Smith" ),
       (1, 2, "John", "Doe" ),
       (1, 3, "Michael", "Johnson" );