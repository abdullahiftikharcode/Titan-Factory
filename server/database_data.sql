INSERT INTO Department (department_name, location, description) VALUES
('Production', 'Building A', 'Handles all production activities'),
('Quality Assurance', 'Building B', 'Ensures product quality standards'),
('Maintenance', 'Building C', 'Responsible for machine maintenance'),
('Sales', 'Office 1', 'Handles all sales and marketing activities'),
('Human Resources', 'Office 2', 'Manages employee relations and payroll'),
('Research and Development', 'Building D', 'Innovates new products'),
('IT Support', 'Office 3', 'Provides technical support and maintenance'),
('Logistics', 'Warehouse 1', 'Manages inventory and shipping'),
('Customer Service', 'Office 4', 'Handles customer inquiries and support'),
('Finance', 'Office 5', 'Manages financial records and budgeting');

INSERT INTO Roles (role_name) VALUES 
('admin'),
('manager'),
('employee'),
('maintenance_staff'),
('sales');

INSERT INTO User (first_name, last_name, email, password, role_id, phone_number, department_id, currently_employed, address, hire_date, job_title) VALUES
('Alice', 'Smith', 'alice.smith@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'admin'), '1234567890', 1, TRUE, '123 Elm St', '2023-01-15', 'Factory Manager'),
('Bob', 'Johnson', 'bob.johnson@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'manager'), '2345678901', 2, TRUE, '456 Oak St', '2022-02-20', 'Quality Manager'),
('Charlie', 'Brown', 'charlie.brown@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'employee'), '3456789012', 3, TRUE, '789 Pine St', '2023-03-25', 'Maintenance Worker'),
('David', 'Williams', 'david.williams@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'sales'), '4567890123', 4, TRUE, '321 Maple St', '2023-04-10', 'Sales Executive'),
('Eve', 'Davis', 'eve.davis@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'employee'), '5678901234', 5, TRUE, '654 Cedar St', '2023-05-05', 'HR Officer'),
('Frank', 'Garcia', 'frank.garcia@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'employee'), '6789012345', 6, TRUE, '987 Birch St', '2023-06-15', 'R&D Engineer'),
('Grace', 'Martinez', 'grace.martinez@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'maintenance_staff'), '7890123456', 3, TRUE, '543 Spruce St', '2023-07-20', 'Maintenance Technician'),
('Hank', 'Lopez', 'hank.lopez@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'employee'), '8901234567', 8, TRUE, '321 Elm St', '2023-08-25', 'Logistics Coordinator'),
('Ivy', 'Wilson', 'ivy.wilson@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'employee'), '9012345678', 7, TRUE, '456 Willow St', '2023-09-30', 'IT Support Specialist'),
('Jack', 'Anderson', 'jack.anderson@example.com', 'password123', (SELECT role_id FROM Roles WHERE role_name = 'admin'), '0123456789', 9, TRUE, '789 Fir St', '2023-10-05', 'Customer Service Manager');

INSERT INTO Factory (factory_name, location, manager_id, established_date, capacity, description) VALUES
('Factory A', 'Location A', 1, '2010-05-15', 500, 'Main production facility'),
('Factory B', 'Location B', 2, '2012-03-20', 300, 'Quality control and testing facility'),
('Factory C', 'Location C', 3, '2015-07-25', 400, 'Manufacturing and assembly plant'),
('Factory D', 'Location D', 4, '2018-01-10', 600, 'Distribution center'),
('Factory E', 'Location E', 5, '2020-11-30', 200, 'Raw materials processing plant'),
('Factory F', 'Location F', 6, '2021-08-05', 450, 'Packaging facility'),
('Factory G', 'Location G', 7, '2019-02-15', 350, 'Recycling plant'),
('Factory H', 'Location H', 8, '2022-06-20', 250, 'Special projects facility'),
('Factory I', 'Location I', 9, '2023-04-18', 550, 'Pilot production plant'),
('Factory J', 'Location J', 10, '2023-10-01', 650, 'Innovation lab');

INSERT INTO Machine (machine_name, model, serial_number, status, last_maintenance_date, next_maintenance_due, purchase_date, warranty_expiry, factory_id, location) VALUES
('Machine A', 'Model A', 'SN123456', 'active', '2023-08-01', '2024-08-01', '2020-01-15', '2025-01-15', 1, 'Section 1'),
('Machine B', 'Model B', 'SN123457', 'maintenance', '2023-09-10', '2024-09-10', '2019-02-20', '2024-02-20', 2, 'Section 2'),
('Machine C', 'Model C', 'SN123458', 'active', '2023-07-15', '2024-07-15', '2018-03-25', '2023-03-25', 3, 'Section 3'),
('Machine D', 'Model D', 'SN123459', 'decommissioned', '2023-01-05', NULL, '2015-05-15', '2020-05-15', 4, 'Section 4'),
('Machine E', 'Model E', 'SN123460', 'active', '2023-10-20', '2024-10-20', '2022-04-01', '2025-04-01', 5, 'Section 5'),
('Machine F', 'Model F', 'SN123461', 'active', '2023-09-15', '2024-09-15', '2021-08-10', '2026-08-10', 6, 'Section 6'),
('Machine G', 'Model G', 'SN123462', 'active', '2023-06-01', '2024-06-01', '2020-12-20', '2025-12-20', 7, 'Section 7'),
('Machine H', 'Model H', 'SN123463', 'maintenance', '2023-08-15', '2024-08-15', '2017-01-01', '2022-01-01', 8, 'Section 8'),
('Machine I', 'Model I', 'SN123464', 'active', '2023-10-10', '2024-10-10', '2019-03-01', '2024-03-01', 9, 'Section 9'),
('Machine J', 'Model J', 'SN123465', 'active', '2023-05-20', '2024-05-20', '2021-09-12', '2026-09-12', 10, 'Section 10');

INSERT INTO Machine_Maintenance_History (machine_id, performed_by, maintenance_date, maintenance_details, maintenance_type, maintenance_cost, manager_approval_id, next_maintenance_date) VALUES
(1, 3, '2023-08-01', 'Changed oil and filters', 'scheduled', 150.00, 1, '2024-08-01'),
(2, 4, '2023-09-10', 'Repaired hydraulic system', 'unscheduled', 200.00, 2, '2024-09-10'),
(3, 3, '2023-07-15', 'Routine check', 'scheduled', 100.00, 1, '2024-07-15'),
(4, 5, '2023-01-05', 'Decommissioned machine', 'emergency', 0.00, 1, NULL),
(5, 6, '2023-10-20', 'Calibrated machine', 'scheduled', 80.00, 2, '2024-10-20'),
(6, 3, '2023-09-15', 'Replaced worn-out parts', 'unscheduled', 120.00, 1, '2024-09-15'),
(7, 6, '2023-06-01', 'Routine maintenance', 'scheduled', 90.00, 1, '2024-06-01'),
(8, 4, '2023-08-15', 'Checked safety systems', 'scheduled', 110.00, 1, '2024-08-15'),
(9, 3, '2023-10-10', 'Changed belts and filters', 'scheduled', 95.00, 1, '2024-10-10'),
(10, 2, '2023-05-20', 'Full maintenance check', 'unscheduled', 150.00, 1, '2024-05-20');

INSERT INTO Attendance (user_id, date, check_in_time, check_out_time, status, remarks) VALUES
(1, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(2, '2023-10-01', '09:15:00', '17:00:00', 'present', 'Traffic jam'),
(3, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(4, '2023-10-01', '09:05:00', '17:00:00', 'present', 'Regular day'),
(5, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(6, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(7, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(8, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(9, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day'),
(10, '2023-10-01', '09:00:00', '17:00:00', 'present', 'Regular day');

INSERT INTO Supplier (supplier_name, email, phone, address, product_supplied) VALUES
('Supplier A', 'supplierA@example.com', '1111111111', '123 Supplier St', 'Raw Materials'),
('Supplier B', 'supplierB@example.com', '2222222222', '456 Supplier Ave', 'Machinery Parts'),
('Supplier C', 'supplierC@example.com', '3333333333', '789 Supplier Blvd', 'Packaging Supplies'),
('Supplier D', 'supplierD@example.com', '4444444444', '321 Supplier Way', 'Office Supplies'),
('Supplier E', 'supplierE@example.com', '5555555555', '654 Supplier Rd', 'Electrical Components'),
('Supplier F', 'supplierF@example.com', '6666666666', '987 Supplier Ct', 'Safety Equipment'),
('Supplier G', 'supplierG@example.com', '7777777777', '123 Supplier Ln', 'Cleaning Supplies'),
('Supplier H', 'supplierH@example.com', '8888888888', '456 Supplier Dr', 'Maintenance Supplies'),
('Supplier I', 'supplierI@example.com', '9999999999', '789 Supplier Tr', 'Construction Materials'),
('Supplier J', 'supplierJ@example.com', '0000000000', '321 Supplier Wd', 'Metal Products');

INSERT INTO Inventory (item_name, item_type, quantity, supplier_id) VALUES
('Steel Rod', 'raw_material', 1000, 1),
('Aluminum Sheets', 'raw_material', 500, 2),
('Cardboard Boxes', 'finished_product', 300, 3),
('Office Paper', 'finished_product', 100, 4),
('Electrical Wires', 'raw_material', 800, 5),
('Safety Helmets', 'finished_product', 200, 6),
('Cleaning Supplies', 'raw_material', 1000, 7),
('Lubricants', 'raw_material', 150, 8),
('Cement', 'raw_material', 400, 9),
('Steel Beams', 'raw_material', 600, 10);

INSERT INTO Product (product_name, description, price, category, stock_quantity, inventory_id) VALUES
('Product A', 'Description for product A', 29.99, 'Electronics', 50, 1),
('Product B', 'Description for product B', 19.99, 'Home Goods', 100, 2),
('Product C', 'Description for product C', 39.99, 'Electronics', 75, 3),
('Product D', 'Description for product D', 49.99, 'Tools', 25, 4),
('Product E', 'Description for product E', 59.99, 'Electronics', 10, 5),
('Product F', 'Description for product F', 9.99, 'Home Goods', 200, 6),
('Product G', 'Description for product G', 24.99, 'Tools', 60, 7),
('Product H', 'Description for product H', 14.99, 'Home Goods', 150, 8),
('Product I', 'Description for product I', 34.99, 'Electronics', 20, 9),
('Product J', 'Description for product J', 44.99, 'Tools', 30, 10);

INSERT INTO Sales_Report (salesperson_id, product_id, sales_amount, report_date, notes, target_achievement) VALUES
(4, 1, 500.00, '2023-10-01', 'Achieved target for Product A', TRUE),
(5, 2, 300.00, '2023-10-02', 'Sales increased due to promotion', TRUE),
(6, 3, 450.00, '2023-10-03', 'Regular sales', TRUE),
(7, 4, 250.00, '2023-10-04', 'Sales dropped slightly', FALSE),
(8, 5, 700.00, '2023-10-05', 'Sales spike for Product E', TRUE),
(9, 6, 600.00, '2023-10-06', 'Continued sales growth', TRUE),
(10, 7, 800.00, '2023-10-07', 'Hit all targets this month', TRUE),
(4, 8, 200.00, '2023-10-08', 'Average sales', TRUE),
(5, 9, 300.00, '2023-10-09', 'Regular sales', TRUE),
(6, 10, 100.00, '2023-10-10', 'Sales dropped due to market conditions', FALSE);

INSERT INTO Notification (user_id, message, created_at, target_role, notification_type) VALUES
(1, 'System maintenance scheduled for tonight.', '2023-10-01 10:00:00', 'all', 'alert'),
(2, 'Quality check report available.', '2023-10-02 11:00:00', 'manager', 'info'),
(3, 'New safety protocols have been implemented.', '2023-10-03 12:00:00', 'employee', 'reminder'),
(4, 'Sales target achieved for this month!', '2023-10-04 13:00:00', 'sales', 'info'),
(5, 'Payroll for this month is processed.', '2023-10-05 14:00:00', 'employee', 'info'),
(6, 'New machines have arrived.', '2023-10-06 15:00:00', 'maintenance_staff', 'alert'),
(7, 'Meeting scheduled for next week.', '2023-10-07 16:00:00', 'manager', 'reminder'),
(8, 'Inventory levels are low for some items.', '2023-10-08 17:00:00', 'admin', 'warning'),
(9, 'Customer feedback has been received.', '2023-10-09 18:00:00', 'all', 'info'),
(10, 'New software update available.', '2023-10-10 19:00:00', 'maintenance_staff', 'alert');

INSERT INTO Payroll (user_id, basic_salary, overtime_hours, overtime_rate, bonuses, deductions, tax, net_salary, payment_date, bank_account_number, payment_method) VALUES
(1, 5000.00, 10, 20.00, 300.00, 50.00, 400.00, 4850.00, '2023-10-01', '123456789', 'bank_transfer'),
(2, 4500.00, 5, 20.00, 200.00, 30.00, 350.00, 4420.00, '2023-10-01', '987654321', 'cash'),
(3, 4000.00, 8, 20.00, 150.00, 20.00, 320.00, 3830.00, '2023-10-01', '135792468', 'check'),
(4, 3500.00, 12, 20.00, 250.00, 25.00, 300.00, 3435.00, '2023-10-01', '246813579', 'bank_transfer'),
(5, 6000.00, 6, 20.00, 400.00, 60.00, 500.00, 5840.00, '2023-10-01', '123123123', 'cash'),
(6, 5500.00, 4, 20.00, 200.00, 40.00, 450.00, 5210.00, '2023-10-01', '321321321', 'check'),
(7, 4800.00, 7, 20.00, 300.00, 50.00, 400.00, 4750.00, '2023-10-01', '456456456', 'bank_transfer'),
(8, 5200.00, 3, 20.00, 150.00, 30.00, 420.00, 4900.00, '2023-10-01', '654654654', 'cash'),
(9, 5300.00, 9, 20.00, 350.00, 70.00, 430.00, 5150.00, '2023-10-01', '789789789', 'check'),
(10, 5600.00, 11, 20.00, 450.00, 20.00, 440.00, 5630.00, '2023-10-01', '111111111', 'bank_transfer');

INSERT INTO Chatbot_Interaction (interaction_id, user_message, chatbot_response, user_id, timestamp, user_feedback) VALUES
(1, 'What is the status of my application?', 'Your application is under review.', 1, '2023-10-01 08:30:00', 'helpful'),
(2, 'When is the next maintenance scheduled?', 'Next maintenance is scheduled for next week.', 2, '2023-10-01 09:00:00', 'very_helpful'),
(3, 'Can I get a summary of my sales?', 'Your total sales this month are $5000.', 3, '2023-10-01 09:15:00', 'neutral'),
(4, 'What are the safety protocols?', 'The new safety protocols include...', 4, '2023-10-01 09:30:00', 'helpful'),
(5, 'How do I reset my password?', 'To reset your password, follow these steps...', 5, '2023-10-01 09:45:00', 'very_helpful'),
(6, 'Where can I find the inventory report?', 'The inventory report is located in the Reports section.', 6, '2023-10-01 10:00:00', 'neutral'),
(7, 'What is my salary for this month?', 'Your salary for this month is $4800.', 7, '2023-10-01 10:15:00', 'helpful'),
(8, 'How do I submit a leave request?', 'To submit a leave request, go to the HR portal.', 8, '2023-10-01 10:30:00', 'helpful'),
(9, 'What products are on sale?', 'Currently, we have a sale on Product A and Product B.', 9, '2023-10-01 10:45:00', 'neutral'),
(10, 'Can you help me with machine maintenance?', 'Please provide the machine ID for assistance.', 10, '2023-10-01 11:00:00', 'very_unhelpful');
