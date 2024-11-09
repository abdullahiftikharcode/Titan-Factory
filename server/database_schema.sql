CREATE DATABASE IF NOT EXISTS titan_factory;
USE titan_factory;

-- Table 1: Department
CREATE TABLE IF NOT EXISTS Department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100),
    location VARCHAR(255),
    description TEXT
);

-- Table 2: User (without foreign key to Department for now)
CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'manager', 'employee','maintenance_staff ', 'sales'),
    phone_number VARCHAR(15),
    department_id INT,
    currently_employed BOOLEAN,
    address VARCHAR(255),
    hire_date DATE,
    termination_date DATE,
    job_title VARCHAR(100)
);

-- Add the foreign key constraint after the User table is created


-- Table 3: Factory
CREATE TABLE IF NOT EXISTS Factory (
    factory_id INT AUTO_INCREMENT PRIMARY KEY,
    factory_name VARCHAR(100),
    location VARCHAR(255),
    manager_id INT,
    established_date DATE,
    capacity INT,
    description TEXT,
    FOREIGN KEY (manager_id) REFERENCES User(user_id)
);

-- Table 4: Machine
CREATE TABLE IF NOT EXISTS Machine (
    machine_id INT AUTO_INCREMENT PRIMARY KEY,
    machine_name VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    status ENUM('active', 'maintenance', 'decommissioned'),
    last_maintenance_date DATE,
    next_maintenance_due DATE,
    purchase_date DATE,
    warranty_expiry DATE,
    factory_id INT,
    location VARCHAR(255),
    FOREIGN KEY (factory_id) REFERENCES Factory(factory_id)
);

-- Table 5: Machine Maintenance History
CREATE TABLE IF NOT EXISTS Machine_Maintenance_History (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id INT,
    performed_by INT,
    maintenance_date DATE,
    maintenance_details TEXT,
    maintenance_type ENUM('scheduled', 'unscheduled', 'emergency'),
    maintenance_cost DECIMAL(10, 2),
    manager_approval_id INT,
    next_maintenance_date DATE,
    FOREIGN KEY (machine_id) REFERENCES Machine(machine_id),
    FOREIGN KEY (performed_by) REFERENCES User(user_id),
    FOREIGN KEY (manager_approval_id) REFERENCES User(user_id)
);

-- Table 6: Attendance
CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('present', 'absent', 'leave', 'late', 'early_leave'),
    remarks TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
-- Table 9: Supplier
CREATE TABLE IF NOT EXISTS Supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(100),
    address VARCHAR(255),
    product_supplied TEXT
);
-- Table 8: Inventory
CREATE TABLE IF NOT EXISTS Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100),
    item_type ENUM('raw_material', 'finished_product'),
    quantity INT,
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id)
);
-- Table 7: Product
CREATE TABLE IF NOT EXISTS Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    stock_quantity INT,
    inventory_id INT,
    FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id)
);





-- Table 10: Sales Report
CREATE TABLE IF NOT EXISTS Sales_Report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    salesperson_id INT,
    product_id INT,
    sales_amount DECIMAL(10, 2),
    report_date DATE,
    notes TEXT,
    target_achievement BOOLEAN,
    FOREIGN KEY (salesperson_id) REFERENCES User(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- Table 11: Notification
CREATE TABLE IF NOT EXISTS Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    created_at DATETIME,
    target_role ENUM('admin', 'manager', 'employee', 'maintenance_staff', 'sales', 'all'),
    notification_type ENUM('alert', 'reminder', 'info', 'warning'),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


-- Table 12: Payroll
CREATE TABLE IF NOT EXISTS Payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    basic_salary DECIMAL(10, 2),
    overtime_hours INT,
    overtime_rate DECIMAL(10, 2),
    bonuses DECIMAL(10, 2),
    deductions DECIMAL(10, 2),
    tax DECIMAL(10, 2),
    net_salary DECIMAL(10, 2),
    payment_date DATE,
    bank_account_number VARCHAR(50),
    payment_method ENUM('bank_transfer', 'cash', 'check'),
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Table 13: Chatbot Interaction
CREATE TABLE IF NOT EXISTS Chatbot_Interaction (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    interaction_id INT,
    user_message TEXT,
    chatbot_response TEXT,
    user_id INT,
    timestamp DATETIME,
    user_feedback ENUM('very_helpful', 'helpful', 'neutral', 'unhelpful', 'very_unhelpful') DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
