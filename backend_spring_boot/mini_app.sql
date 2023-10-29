-- Δημιουργία πίνακα Officers
CREATE TABLE Officers (
  Id bigint PRIMARY KEY,
  AFM VARCHAR(20) UNIQUE NOT NULL,
  FirstName VARCHAR(255) NOT NULL,
  LastName VARCHAR(255) NOT NULL,
  DateOfBirth DATE,
  CONSTRAINT Unique_AFM UNIQUE (AFM),
  CONSTRAINT Unique_FirstName_LastName UNIQUE (FirstName, LastName)
);

-- Δημιουργία πίνακα Departments
CREATE TABLE Departments (
  Id SERIAL PRIMARY KEY,
  Name VARCHAR(255) UNIQUE NOT NULL
);

-- Δημιουργία πίνακα OfficerDepartments για τη σχέση Many-to-Many
CREATE TABLE OfficerDepartments (
  Id bigint PRIMARY KEY,
  OfficerId INT REFERENCES Officers(Id),
  DepartmentId INT REFERENCES Departments(Id),
  CONSTRAINT Unique_Officer_Department UNIQUE (OfficerId, DepartmentId)
);

-- Προσθήκη ξένου κλειδιού OfficerId προς Departments
ALTER TABLE OfficerDepartments
ADD CONSTRAINT FK_Officer_Department
FOREIGN KEY (OfficerId) REFERENCES Officers(Id);

-- Προσθήκη ξένου κλειδιού DepartmentId προς Departments
ALTER TABLE OfficerDepartments
ADD CONSTRAINT FK_Department_Officer
FOREIGN KEY (DepartmentId) REFERENCES Departments(Id);


-- Δημιουργία πίνακα Users
CREATE TABLE Users (
  Id bigint PRIMARY KEY,
  Login VARCHAR(255) NOT NULL,
  Pwd VARCHAR(255) NOT NULL
);

-- Εισαγωγή εγγραφών στον πίνακα Users
INSERT INTO Users (Login, Pwd) VALUES
  ('user1', 'password1'),
  ('user2', 'password2'),
  ('user3', 'password3');

-- Εισαγωγή εγγραφών στον πίνακα Officers
INSERT INTO Officers (AFM, FirstName, LastName, DateOfBirth)
VALUES
  ('1234567890', 'John', 'Doe', '1990-01-15'),
  ('2345678901', 'Jane', 'Smith', '1985-07-22'),
  ('3456789012', 'Michael', 'Johnson', '1988-04-10');

-- Εισαγωγή εγγραφών στον πίνακα Departments
INSERT INTO Departments (Name) VALUES
  ('HR'),
  ('IT'),
  ('Finance');

-- Εισαγωγή εγγραφών στον πίνακα OfficerDepartments για τη σχέση Many-to-Many
INSERT INTO OfficerDepartments (OfficerId, DepartmentId)
VALUES
  (1, 1),
  (2, 2),
  (3, 3);
