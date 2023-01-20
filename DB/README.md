## 1. Person

type - name(fname, mname, lname)
<br>
Data Field - name, password, email, phone, DOB, gender
<br>
Function - Age(onDOB)

> 1. Admin<br>
> Data Field - adminID

> 2. User<br>
> type - address(House_No, Street, Area, City, State, Pincode)
> Data Field - userID, address, wallet_balance

> 3. Driver<br>
> type - address(House_No, Street, Area, City, State, Pincode)
> Data Field - driverID, address,  Aadhar_Number, Licence_Number, Exp_Date, total_earning, avg_rating, wallet_balance

## 2. CBS(Central Bank Managaement)

type - 
<br>
data field - CBS_ID, trip_Id, status(1/2/3/4/5), Trip_Charge, rent, reward, commission
<br>
Function - 
1. commission( Trip_charge - rent - reward)
2. reward(/-------Write HERE-----------\) - activated via trigger by checking overall rating after new rating received

status - 
<br>
1. User to CBS
2. CBS to Driver
3. User to CBS but cancelled
4. CBS to Driver Bonus
5. Driver to CBS Penalty
 
Explanation -
1. Status represet current status of trip
2. If trip is cancelled then trip_charge will become zero and return the user money to respective wallet
3. Reward is positive for bonus and it is in negative for penalty


## 3. Trip

type - 
1. place(pickup_place, drop_place)
2. time(start_dateTime,  end_dateTime, estimated_hrs)
<br>
data field - tripId, userID, driverID, place, time, ac, vehicle_type, vehicleID
<br>
functions - estimated_hrs(start_dateTime to end_dateTime{take via frontend})




## 4. Vehicle
data filed - vehicleID,Vehicle_type,  license_plate, registration_number, AC_nonAC

> Vehicle_type - Taxi, Bus, travels



## 5. Rating

data field - rating_ID, trip_ID, rating, description(if any)


## 6. Wallet Transaction

data field - transaction_ID, type, user_ID, amount

type - 
1. CBS -> user_wallet = CU
2. CBS -> driver_wallet = CD
3. user_wallet -> CBS = UC
4. driver_wallet -> CBS = DC






## References

[How to Calculate difference between timestamp](https://stackoverflow.com/questions/11617962/calculating-difference-between-two-timestamps-in-oracle-in-milliseconds)
