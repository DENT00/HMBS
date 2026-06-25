use hmbs_db;

-- 1. Staff
INSERT INTO Staff (username, password, first_name, last_name, middle_name, role, contact_number) values
('admin', 'admin123', 'John', 'Smith', 'B', 'Admin', '09123456789'),
('admin_maria', 'hashed_maria', 'Maria', 'Santos', 'D', 'Admin', '09567890123'),
('Nurse_Jane', 'Jane123', 'Jane', 'Smith', 'A', 'Nurse', '09234567890'),
('mw_ana', 'hashed_ana', 'Ana', 'Cruz', 'C', 'Midwife', '09345678901'),
('nurse_mike', 'hashed_mike', 'Mike', 'Reyes', NULL, 'Nurse', '09456789012');

-- 2. Donors
INSERT INTO Donors (dtn, first_name, last_name, middle_name, birthdate, address, contact_number, civil_status, screening_status, registration_date) VALUES
('DTN20240001', 'Carlos', 'Garcia', 'M', '1990-05-15', '123 Rizal St', '09678901234', 'Single', 'Passed', '2024-01-10'),
('DTN20240002', 'Elena', 'Torres', 'L', '1988-11-20', '456 Mabini Ave', '09789012345', 'Married', 'Passed', '2024-01-12'),
('DTN20240003', 'Mark', 'Aquino', NULL, '1995-07-03', '789 Bonifacio Rd', '09890123456', 'Single', 'Failed', '2024-01-15'),
('DTN20240004', 'Sofia', 'Reyes', 'P', '1992-02-28', '12 Del Pilar St', '09901234567', 'Widow', 'Failed', '2024-02-01'),
('DTN20240005', 'Ramon', 'Diaz', 'Q', '1985-09-10', '34 Lakandula St', '09012345678', 'Married', 'Passed', '2024-02-05'),
('DTN20240006', 'Lorna', 'Mendoza', 'R', '1998-12-25', '56 Aguinaldo Hwy', '09111222333', 'Single', 'Passed', '2024-02-10'),
('DTN20240007', 'Pedro', 'Santos', 'T', '1980-04-18', '78 Quezon Ave', '09222333444', 'Married', 'Failed', '2024-02-15'),
('DTN20240008', 'Clara', 'Hernandez', 'U', '1993-06-30', '90 Roxas Blvd', '09333444555', 'Single', 'Pending', '2024-03-01'),
('DTN20240009', 'Jose', 'Gonzales', 'V', '1987-01-05', '23 Taft Ave', '09444555666', 'Married', 'Passed', '2024-03-05'),
('DTN20240010', 'Maria', 'Lopez', 'W', '1991-08-12', '45 Osmeña St', '09555666777', 'Single', 'Passed', '2024-03-10');

-- 3. Beneficiary
INSERT INTO Beneficiary (first_name, last_name, middle_name, address, hospital_affiliation, contact_number, registration_date) VALUES
('Anna', 'Rivera', 'C', '789 Lopez Jaena', 'City General Hospital', '09666777888', '2024-01-20'),
('Luis', 'Cruz', 'M', '123 Sampaloc', 'St. Luke Medical', '09777888999', '2024-02-05'),
('Rosa', 'Mercado', NULL, '456 Banawe', 'East Avenue Medical', '09888999000', '2024-02-20'),
('Ben', 'Gutierrez', 'D', '789 Kamuning', 'Philippine General Hospital', '09999000111', '2024-03-01'),
('Maria', 'Castro', 'E', '101 Timog', 'Quezon City General', '09000111222', '2024-03-15');