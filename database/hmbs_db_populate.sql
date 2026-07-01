use hmbs_db;

-- 1. Staff
INSERT INTO Staff (username, password, first_name, last_name, middle_name, role, contact_number) values
('admin', 'admin123', 'John', 'Smith', 'B', 'Admin', '09123456789'),
('admin_maria', 'hashed_maria', 'Maria', 'Santos', 'D', 'Admin', '09567890123'),
('Nurse_Jane', 'Jane123', 'Jane', 'Smith', 'A', 'Nurse', '09234567890'),
('mw_ana', 'hashed_ana', 'Ana', 'Cruz', 'C', 'Midwife', '09345678901'),
('nurse_mike', 'hashed_mike', 'Mike', 'Reyes', NULL, 'Nurse', '09456789012');
Select * From Staff;
Describe Staff;

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
Select * From Donors;
Describe Donors;
Delete From Donors;

-- 3. Beneficiary
INSERT INTO Beneficiary (first_name, last_name, middle_name, address, hospital_affiliation, contact_number, registration_date) VALUES
('Anna', 'Rivera', 'C', '789 Lopez Jaena', 'City General Hospital', '09666777888', '2024-01-20'),
('Luis', 'Cruz', 'M', '123 Sampaloc', 'St. Luke Medical', '09777888999', '2024-02-05'),
('Rosa', 'Mercado', NULL, '456 Banawe', 'East Avenue Medical', '09888999000', '2024-02-20'),
('Ben', 'Gutierrez', 'D', '789 Kamuning', 'Philippine General Hospital', '09999000111', '2024-03-01'),
('Maria', 'Castro', 'E', '101 Timog', 'Quezon City General', '09000111222', '2024-03-15');
Select * From Beneficiary;
Describe Beneficiary;

-- 4. Program
INSERT INTO Program (program_name, description, location) VALUES
('Community Blood Drive', 'Mobile blood donation in Barangay San Isidro', 'Barangay Hall San Isidro'),
('Milk Bank Drive', 'Hospital-based milk donation drive', 'City Hospital Lactation Unit'),
('Health Center Outreach', 'Outreach program at rural health center', 'Rural Health Unit 1');
Select * From Program;
Describe Program;

-- 5. Collection_Batch
INSERT INTO Collection_Batch (pooling_date, status, staff_id) VALUES
('2024-02-20', 'Completed', 2),
('2024-03-01', 'Completed', 3),
('2024-03-10', 'Pending', 2);
Select * From Collection_Batch;
Describe Collection_Batch;

-- 6. Donations
INSERT INTO Donations (donor_id, batch_id, program_id, staff_id, volume_ml, collection_date, status) VALUES
(1, 1, 1, 2, 250, '2024-02-18', 'Passed'),
(2, 1, 1, 2, 300, '2024-02-18', 'Passed'),
(3, 2, 2, 3, 200, '2024-02-25', 'Failed'),
(4, NULL, 3, 4, 150, '2024-03-02', 'Failed'),
(5, 2, 2, 3, 350, '2024-02-25', 'Passed'),
(6, 3, 1, 2, 220, '2024-03-08', 'Passed'),
(7, NULL, 2, 4, 180, '2024-03-05', 'Failed'),
(8, NULL, 3, 4, 190, '2024-03-09', 'Pending'),
(9, 3, 1, 2, 270, '2024-03-08', 'Passed'),
(10, 1, 1, 2, 310, '2024-02-18', 'Passed');
Select * From Donations;
Describe Donations;

-- 7. PrepasteurizationTest
INSERT INTO PrepasteurizationTest (donation_id, test_date, result) VALUES
(1, '2024-02-20', 'Passed'),
(2, '2024-02-20', 'Passed'),
(5, '2024-02-27', 'Passed'),
(6, '2024-03-10', 'Passed'),
(9, '2024-03-10', 'Passed'),
(10, '2024-02-20', 'Passed'),
(4, '2024-03-04', 'Failed'),
(8, '2024-03-11', NULL);  -- still pending
Select * From PrepasteurizationTest;
Describe PrepasteurizationTest;

-- 8. PasteurizationBatch
INSERT INTO PasteurizationBatch (batch_id, pasteurization_date, staff_id, status) VALUES
(1, '2024-02-22', 2, 'Completed'),
(2, '2024-02-28', 3, 'Completed'),
(3, '2024-03-12', 2, 'Pending');
Select * From PasteurizationBatch;
Describe PasteurizationBatch;

-- 9. PostPasteurizationTest
INSERT INTO PostPasteurizationTest (pasteurization_id, test_date, result, expiration_date) VALUES
(1, '2024-02-23', 'Passed', '2025-02-23'),
(2, '2024-03-01', 'Passed', '2025-03-01'),
(3, '2024-03-14', NULL, NULL);   -- test pending
Select * From PostPasteurizationTest;
Describe PostPasteurizationTest;

-- 10. Inventory (initial volumes, dispensing will adjust later)
INSERT INTO Inventory (pasteurization_id, available_volume_ml, dispensed_volume_ml, wasted_volume_ml) VALUES
(1, 860, 0, 0),    -- batch1 passed: 250+300+310
(2, 350, 0, 0),    -- batch2 passed: 350 only
(3, 0, 0, 0);      -- batch3 still pending
Select * From Inventory;
Describe Inventory;

-- 11. Inquiry
INSERT INTO Inquiry (beneficiary_id, inquiry_date, requested_volume_ml, status) VALUES
(1, '2024-02-25', 200, 'Fulfilled'),
(2, '2024-03-02', 150, 'Pending'),
(3, '2024-03-05', 300, 'Notified'),
(4, '2024-03-10', 100, 'Pending');
Select * From Inquiry;
Describe Inquiry;

-- 12. Dispensing
INSERT INTO Dispensing (inventory_id, beneficiary_id, staff_id, dispensing_date, volume_ml, price_per_ml, total_price) VALUES
(1, 1, 2, '2024-02-26', 200, 1.50, 300.00),
(1, 2, 2, '2024-03-04', 150, 1.50, 225.00),
(2, 3, 3, '2024-03-06', 300, 1.50, 450.00),
(2, 4, 3, '2024-03-11', 50, 1.50, 75.00);
Select * From Dispensing;
Describe Dispensing;

-- 13. SMS_Log
INSERT INTO SMS_Log (recipient_id, recipient_type, phone_number, sent_at, status, staff_id) VALUES
(1, 'Donor', '09678901234', '2024-02-20 09:00:00', 'Sent', 2),
(3, 'Donor', '09890123456', '2024-02-27 10:00:00', 'Sent', 3),
(1, 'Beneficiary', '09666777888', '2024-02-26 11:00:00', 'Sent', 2),
(3, 'Beneficiary', '09888999000', '2024-03-05 14:00:00', 'Sent', 2);
Select * From SMS_Log;
Describe SMS_Log;

-- Update inventory volumes after dispensing
UPDATE Inventory
SET dispensed_volume_ml = 350,       -- 200 + 150
    available_volume_ml = 860 - 350  -- 510
WHERE inventory_id = 1;

UPDATE Inventory
SET dispensed_volume_ml = 350,       -- 300 + 50
    available_volume_ml = 350 - 350  -- 0
WHERE inventory_id = 2;