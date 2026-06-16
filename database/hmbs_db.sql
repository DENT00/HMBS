CREATE DATABASE hmbs_db;

USE hmbs_db;

CREATE TABLE Staff (
    staff_id        INT             NOT NULL AUTO_INCREMENT,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,          
    first_name      VARCHAR(50)     NOT NULL,
    last_name       VARCHAR(50)     NOT NULL,
    middle_name     VARCHAR(50)     DEFAULT NULL,
    role            ENUM('Admin', 'Nurse', 'Midwife') NOT NULL,
    contact_number  VARCHAR(12)     DEFAULT NULL,
    PRIMARY KEY (staff_id)
);

CREATE TABLE Donors (
    donor_id            INT             NOT NULL AUTO_INCREMENT,
    dtn                 VARCHAR(50)     NOT NULL UNIQUE,
    first_name          VARCHAR(50)     NOT NULL,
    last_name           VARCHAR(50)     NOT NULL,
    middle_name         VARCHAR(50)     DEFAULT NULL,
    birthdate           DATE            NOT NULL,
    address             TEXT            DEFAULT NULL,
    contact_number      VARCHAR(12)     DEFAULT NULL,
    civil_status        VARCHAR(10)     DEFAULT NULL,
    screening_status    ENUM('Pending', 'Passed', 'Failed') NOT NULL DEFAULT 'Pending',
    registration_date   DATE            NOT NULL,
    PRIMARY KEY (donor_id)
);

CREATE TABLE Beneficiary (
    beneficiary_id      INT             NOT NULL AUTO_INCREMENT,
    first_name          VARCHAR(50)     NOT NULL,
    last_name           VARCHAR(50)     NOT NULL,
    middle_name         VARCHAR(50)     DEFAULT NULL,
    address             TEXT            DEFAULT NULL,
    hospital_affiliation VARCHAR(100)   DEFAULT NULL,
    contact_number      VARCHAR(20)     DEFAULT NULL,
    registration_date   DATE            NOT NULL,
    PRIMARY KEY (beneficiary_id)
);

CREATE TABLE Program (
    program_id      INT             NOT NULL AUTO_INCREMENT,
    program_name    VARCHAR(50)     NOT NULL,           
    description     TEXT            DEFAULT NULL,
    location        VARCHAR(50)     DEFAULT NULL,       
    PRIMARY KEY (program_id)
);

CREATE TABLE Collection_Batch (
    batch_id        INT             NOT NULL AUTO_INCREMENT,
    pooling_date    DATE            NOT NULL,
    status          ENUM('Pending', 'Processing', 'Completed') NOT NULL DEFAULT 'Pending',
    staff_id        INT             NOT NULL,
    PRIMARY KEY (batch_id),
    CONSTRAINT fk_collbatch_staff
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

CREATE TABLE Donations (
    donation_id     INT             NOT NULL AUTO_INCREMENT,
    donor_id        INT             NOT NULL,
    batch_id        INT             DEFAULT NULL,
    program_id      INT             NOT NULL,
    staff_id        INT             NOT NULL,
    volume_ml       INT             NOT NULL,
    collection_date DATE            NOT NULL,
    status          ENUM('Collected', 'Pending', 'Failed', 'Passed', 'Disposed') NOT NULL DEFAULT 'Collected',
    PRIMARY KEY (donation_id),
    CONSTRAINT fk_donation_donor
        FOREIGN KEY (donor_id)    REFERENCES Donors(donor_id),
    CONSTRAINT fk_donation_batch
        FOREIGN KEY (batch_id)    REFERENCES Collection_Batch(batch_id),
    CONSTRAINT fk_donation_program
        FOREIGN KEY (program_id)  REFERENCES Program(program_id),
    CONSTRAINT fk_donation_staff
        FOREIGN KEY (staff_id)    REFERENCES Staff(staff_id)
);

CREATE TABLE PrepasteurizationTest (
    pasteurization_id   INT         NOT NULL AUTO_INCREMENT,
    donation_id         INT         NOT NULL,
    test_date           DATE        NOT NULL,
    result              ENUM('Passed', 'Failed') DEFAULT NULL,
    PRIMARY KEY (pasteurization_id),
    CONSTRAINT fk_pretest_donation
        FOREIGN KEY (donation_id) REFERENCES Donations(donation_id)
);

CREATE TABLE PasteurizationBatch (
    pasteurization_id   INT         NOT NULL AUTO_INCREMENT,
    batch_id            INT         NOT NULL,
    pasteurization_date DATE        NOT NULL,
    staff_id            INT         NOT NULL,
    status              ENUM('Pending', 'Completed', 'Failed') NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (pasteurization_id),
    CONSTRAINT fk_pastbatch_batch
        FOREIGN KEY (batch_id)  REFERENCES Collection_Batch(batch_id),
    CONSTRAINT fk_pastbatch_staff
        FOREIGN KEY (staff_id)  REFERENCES Staff(staff_id)
);

CREATE TABLE PostPasteurizationTest (
    test_id             INT         NOT NULL AUTO_INCREMENT,
    pasteurization_id   INT         NOT NULL,
    test_date          DATE        NOT NULL,
    result              ENUM('Passed', 'Failed') DEFAULT NULL,
    expiration_date     DATE        DEFAULT NULL,
    PRIMARY KEY (test_id),
    CONSTRAINT fk_posttest_pastbatch
        FOREIGN KEY (pasteurization_id) REFERENCES PasteurizationBatch(pasteurization_id)
);

CREATE TABLE Inventory (
    inventory_id            INT         NOT NULL AUTO_INCREMENT,
    pasteurization_id       INT         NOT NULL,
    available_volume_ml     INT         NOT NULL DEFAULT 0,
    dispensed_volume_ml     INT         NOT NULL DEFAULT 0,
    wasted_volume_ml        INT         NOT NULL DEFAULT 0,
    PRIMARY KEY (inventory_id),
    CONSTRAINT fk_inventory_pastbatch
        FOREIGN KEY (pasteurization_id) REFERENCES PasteurizationBatch(pasteurization_id)
);

CREATE TABLE Inquiry (
    inquiry_id          INT         NOT NULL AUTO_INCREMENT,
    beneficiary_id      INT         NOT NULL,
    inquiry_date        DATE        NOT NULL,
    requested_volume_ml INT         NOT NULL,
    status              ENUM('Pending', 'Fulfilled', 'Notified') NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (inquiry_id),
    CONSTRAINT fk_inquiry_beneficiary
        FOREIGN KEY (beneficiary_id) REFERENCES Beneficiary(beneficiary_id)
);

CREATE TABLE Dispensing (
    dispensing_id       INT             NOT NULL AUTO_INCREMENT,
    inventory_id        INT             NOT NULL,
    beneficiary_id      INT             NOT NULL,
    staff_id            INT             NOT NULL,
    dispensing_date     DATE            NOT NULL,
    volume_ml           INT             NOT NULL,
    price_per_ml        DOUBLE          NOT NULL DEFAULT 0.00,
    total_price         DOUBLE          NOT NULL DEFAULT 0.00,
    PRIMARY KEY (dispensing_id),
    CONSTRAINT fk_dispensing_inventory
        FOREIGN KEY (inventory_id)   REFERENCES Inventory(inventory_id),
    CONSTRAINT fk_dispensing_beneficiary
        FOREIGN KEY (beneficiary_id) REFERENCES Beneficiary(beneficiary_id),
    CONSTRAINT fk_dispensing_staff
        FOREIGN KEY (staff_id)       REFERENCES Staff(staff_id)
);

CREATE TABLE SMS_Log (
    log_id          INT             NOT NULL AUTO_INCREMENT,
    recipient_id    INT             NOT NULL,
    recipient_type  ENUM('Donor', 'Beneficiary') NOT NULL,
    phone_number    VARCHAR(12)     NOT NULL,
    sent_at         DATETIME        NOT NULL,
    status          ENUM('Pending', 'Sent', 'Failed') NOT NULL DEFAULT 'Pending',
    staff_id        INT             NOT NULL,
    PRIMARY KEY (log_id),
    CONSTRAINT fk_smslog_staff
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);