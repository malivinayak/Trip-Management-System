create database Trip_Management_System;

use Trip_Management_System;

CREATE TYPE name AS OBJECT (
        fname varchar(20) not null,
        mname varchar(20) not null,
        lname varchar(20) not null
);

CREATE TYPE address AS OBJECT (
        houseNo varchar(60) not null,
        street varchar(60) not null,
        area varchar(60) not null,
        city varchar(30) not null,
        state varchar(60) not null,
        pincode int not null,
);

CREATE TYPE place AS OBJECT (
        pickup_place varchar(300) not null,
        drop_place varchar(300) not null,
);

CREATE TYPE trip_time AS OBJECT (
        start_dateTime DATETIME not null,
        end_dateTime DATETIME not null,
        MEMBER FUNCTION estimated_hrs(start_DT DATETIME, end_DT DATETIME) return int
) not final;


CREATE OR REPLACE TYPE BODY trip_time AS 
        MEMBER FUNCTION estimated_hrs(start_DT DATETIME, end_DT DATETIME) 
        RETURN int IS 
        BEGIN 
                RETURN DATEDIFF(hh, start_DT, end_DT);
        END;
END;

CREATE type Person_Type as object(
        name name not null,
        username varchar(50) not null,
        password varchar(80) not null,
        email varchar(80) not null,
        phone number(11) not null,
        DOB DATE not null,
        gender varchar(20) not null,
        MEMBER FUNCTION age(dob DATE) return int 
) not final;

CREATE OR REPLACE TYPE BODY Person_Type AS 
        MEMBER FUNCTION age(dob DATE) 
        RETURN int IS 
        BEGIN 
                RETURN trunc(months_between(sysdate,dob)/12);
        END;
END;

CREATE type Admin_Type under Person_Type (
        adminID varchar(20) primary key not final
);

create table Admin of Admin_Type;

-- create a sequence ***************************
CREATE type User_Type under Person_Type (
        userID varchar(20) primary key,
        uaddress address not null,
        aadhar_number number(20) not null,
        wallet_balance number DEFAULT 0
) not final;

create table client of User_Type;

CREATE type Driver_Type under Person_Type (
        driverID varchar(20) primary key,
        daddress address,
        aadhar_number number(20),
        lincence_number varchar(20),
        exp_date DATE,
        avg_rating number(1, 1),
        total_earing number,
        wallet_balance number
) not final;

create table Driver of Driver_Type;

CREATE TABLE UserWallet (
        transactionID varchar(20) primary key not null,
        personID varchar(20) not null,
        transaction_type ENUM('CU','CD','UC','DC') not null,
        amount int not null
);

CREATE TABLE Trip (
        tripId varchar(10) primary key not null,
        userID varchar(10) not null,
        CONSTRAINT FK_T_UID FOREIGN KEY (userID) REFERENCES User(userID),
        driverID varchar(10) not null,
        CONSTRAINT FK_T_DID FOREIGN KEY (driverID) REFERENCES Driver(driverID),
        place place not null,
        ac BOOLEAN not null,
        vehical_type ENUM ('Taxi', 'privateCar') not null,
        estimated_hrs DATETIME
);

CREATE TABLE Vehical (
        vehicalID varchar(10) primary key not null,
        driverID varchar(10) not null foreign key,
        CONSTRAINT FK_V_DID FOREIGN KEY (driverID) REFERENCES Employee(driverID),
        vehical_type varchar(30) not null,
        lincece_plate varchar(20) not null,
        registration_number varchar(50) not null,
        isac varchar(5) not null
);

CREATE TABLE Rating (
        ratingID varchar(10) primary key not null,
        tripId varchar(10) not null,
        CONSTRAINT FK_R_TID FOREIGN KEY (tripId) REFERENCES trip(tripId),
        rating number(1, 1) not null,
        description varchar(500)
);

CREATE TABLE CBS (
        cbsID varchar(10) primary key not null,
        tripId varchar(10) not null,
        CONSTRAINT FK_C_TID FOREIGN KEY (tripId) REFERENCES trip(tripId),
        status varchar(60) not null,
        trip_charge number not null,
        rent number not null,
        reward number not null,
);

CREATE TABLE UserTrip (
        UTripID varchar(10) primary key not null,
        cbsID varchar(10) not null,
        CONSTRAINT FK_UT_CID FOREIGN KEY (cbsID) REFERENCES CBS(cbsID)
);

CREATE TABLE DriveTrip (
        DTripID varchar(10) primary key not null,
        cbsID varchar(10) not null,
        CONSTRAINT FK_DT_CID FOREIGN KEY (cbsID) REFERENCES CBS(cbsID)
);

-- Task to be done
-- 1. make assigned chages
-- 2. create function or procedures
-- 3. Update .drawio file
-- 4. Inheritance

-- Insertion Demo queries
INSERT INTO 
    client(PERSON_NAME, USERNAME, PASSWORD, EMAIL, PHONE, DOB, GENDER, USERID, UADDRESS, AADHAR_NUMBER, WALLET_BALANCE) 
    VALUES(new Name('myfname','mymname','mylame'),
        'myname','Pass@123','mailID@gmail.com',8945129434,'31-DEC-2000','Male','U0000',
        new address('12B','new street','old area','back city','this state',416000),895615487556,0
    );