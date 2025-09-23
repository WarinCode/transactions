CREATE TABLE Majors (
    Major_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    Major_Name VARCHAR(50) NULL,
    Program_Name VARCHAR(50) NULL
);

CREATE TABLE Students (
    Student_ID BIGINT NOT NULL PRIMARY KEY,
    Student_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Major_ID VARCHAR(10) NULL,
    CONSTRAINT fk_major FOREIGN KEY (Major_ID) REFERENCES Majors (Major_ID)
);

CREATE TABLE Transaction_Timestamps (
    Transaction_ID INT NOT NULL PRIMARY KEY,
    Timestamp TIMESTAMP NOT NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL
);

CREATE TABLE Transactions (
    Transaction_ID INT NOT NULL PRIMARY KEY,
    Income FLOAT NULL,
    Expenses FLOAT NULL,
    Expense_Type VARCHAR(50) NULL
);

CREATE TABLE Students_Transactions (
    Transaction_ID INT NOT NULL PRIMARY KEY ,
    Student_ID BIGINT NOT NULL,
    CONSTRAINT fk_student_transaction1 FOREIGN KEY (Transaction_ID) REFERENCES Transactions (Transaction_ID),
    CONSTRAINT fk_student_transaction2 FOREIGN KEY (Student_ID) REFERENCES Students (Student_ID),
    CONSTRAINT fk_student_transaction3 FOREIGN KEY (Transaction_ID) REFERENCES Transaction_Timestamps (Transaction_ID)
);