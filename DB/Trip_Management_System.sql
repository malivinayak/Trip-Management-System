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
CREATE TYPE trip_time AS OBJECT (
        start_dateTime DATE,
        end_dateTime DATE,
        MEMBER FUNCTION estimated_hrs(
            start_DT DATE, 
            end_DT DATE
        ) return int
) not final;

CREATE OR REPLACE TYPE BODY trip_time AS 
        MEMBER FUNCTION estimated_hrs(start_DT DATE, end_DT DATE) 
        RETURN int IS 
        BEGIN 
                RETURN EXTRACT(HOUR FROM NUMTODSINTERVAL(end_DT - start_DT, 'day'));
        END;
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

-- 6. Admin Type
