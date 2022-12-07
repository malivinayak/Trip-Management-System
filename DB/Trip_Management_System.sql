-- Database Creation
create user Trip_Management_System identified by ${__Password_Here__} default tablespace users quota unlimited on users;

grant create session to Trip_Management_System;
grant create session, create table to Trip_Management_System;
grant create type to Trip_Management_System;

-- Database Development

-- TYPES

-- 1. name
CREATE TYPE name AS OBJECT (
        fname varchar(20),
        mname varchar(20),
        lname varchar(20)
);

-- 2. address
CREATE TYPE address AS OBJECT (
        houseNo varchar(100),
        street varchar(100),
        area varchar(100),
        city varchar(30),
        state varchar(60),
        pincode int
);

-- 3. place
CREATE TYPE place AS OBJECT (
        pickup_place varchar(300),
        drop_place varchar(300)
);

-- 4. Trip time

CREATE or replace TYPE trip_time AS OBJECT (
        start_dateTime TIMESTAMP,
        end_dateTime TIMESTAMP,
        MEMBER FUNCTION estimated_time(
                start_DT TIMESTAMP, 
                end_DT TIMESTAMP
        ) return number
) not final;
/
CREATE OR REPLACE TYPE BODY trip_time AS 
        MEMBER FUNCTION estimated_time(start_DT TIMESTAMP, end_DT TIMESTAMP) 
        RETURN number IS 
        begin
                return extract (day    from (start_DT-end_DT))*24*60*60 +
                        extract (hour   from (start_DT-end_DT))*60*60+
                        extract (minute from (start_DT-end_DT))*60+
                        extract (second from (start_DT-end_DT));
        end;
END;

-- 5.Person Type
CREATE or replace TYPE personType AS OBJECT (
        person_name name,
        username varchar(50),
        password varchar(100),
        email varchar(80),
        phone number(11),
        DOB DATE,
        gender varchar(20),
        MEMBER FUNCTION age(
                dob DATE
        )return int 
)not final;

CREATE OR REPLACE TYPE BODY Person_Type AS 
        MEMBER FUNCTION age(dob DATE) 
        RETURN int IS 
        BEGIN 
                RETURN trunc(months_between(sysdate,dob)/12);
        END;
END;


-- Person Table
create table person of Person_Type;

-- 6. Admin Type
CREATE type Admin_Type under Person_Type (
        adminID varchar(20)
);

-- Admin Table
create table admin of Admin_Type;


-- 7. User Type
CREATE or replace type User_Type under Person_Type (
        userID varchar(20),
        uaddress address,
        aadhar_number number(20),
        wallet_balance number
) not final;

-- Client Table
create table Client of User_Type;

ALTER TABLE client
        ADD PRIMARY KEY (userID);


-- 8. Driver
CREATE type Driver_Type under Person_Type (
        driverID varchar(20),
        daddress address,
        aadhar_number number(20),
        lincence_number varchar(20),
        exp_date DATE,
        avg_rating number(1, 1),
        total_earing number,
        wallet_balance number
) not final;

-- Employee Table
create table Employee of Driver_Type;

-- 9. User_Wallet Table
CREATE TABLE UserWallet (
        transactionID varchar(20) primary key not null,
        personID varchar(20) not null,
        transaction_type varchar(3) not null,
        --//transaction_type:('CU','CD','UC','DC')
        amount int not null
);

-- 10 Trip Table

CREATE TABLE Trip (
        tripId varchar(10) primary key not null,
        userID varchar(10) not null,
        CONSTRAINT FK_T_UID FOREIGN KEY (userID) REFERENCES Client(userID),
        driverID varchar(10) not null,
        CONSTRAINT FK_T_DID FOREIGN KEY (driverID) REFERENCES Employee(driverID),
        place place not null,
        isac varchar(5) not null,
        --//isactrue or false
        vehical_type varchar(15) not null,
        --//vechical_type:('Taxi', 'privateCar')
        trip_time trip_time
);

-- 11. Vechicle Table
CREATE TABLE Vehical (
        vehicalID varchar(10) primary key not null,
        driverID varchar(10) not null,
        CONSTRAINT FK_V_DID FOREIGN KEY (driverID) REFERENCES Employee(driverID),
        vehical_type varchar(30) not null,
        lincece_plate varchar(20) not null,
        registration_number varchar(50) not null,
        isac varchar(5) not null
);

-- 12. Rating Table
CREATE TABLE Rating (
        ratingID varchar(10) primary key not null,
        tripId varchar(10) not null,
        CONSTRAINT FK_R_TID FOREIGN KEY (tripId) REFERENCES trip(tripId),
        rating number(1, 1) not null,
        description varchar(500)
);

--13. CBS Table
CREATE TABLE CBS (
        cbsID varchar(10) primary key not null,
        tripId varchar(10) not null,
        CONSTRAINT FK_C_TID FOREIGN KEY (tripId) REFERENCES trip(tripId),
        status varchar(60) not null,
        trip_charge number not null,
        rent number not null,
        reward number not null
);

--14. Trip History

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