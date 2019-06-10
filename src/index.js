const { getTrips, getDriver } = require("../src/api/index");
const drivers = require("./api/data/drivers.json");

/**
 * This function should return the trip data analysis
 * Don't forget to write tests
 *
 * @returns {any} Trip data analysis
 */

async function analysis() {
  const tripAnalysis = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0,
    mostTripsByDriver: {},
    highestEarningDriver: {}
  };

  const allTrips = getTrips();

  return allTrips.then(async arrayOfTripData => {
    /**Use the reduce method to construct and return the trip analysis */
    const result = arrayOfTripData.reduce(
      (accumulator, trip) => {
        const digitBill = Number(convertFromStringToNumber(trip.billedAmount));

        accumulator.billedTotal = Number(
          parseFloat(accumulator.billedTotal + digitBill).toFixed(2)
        );

        if (trip.isCash) {
          accumulator.noOfCashTrips++;

          accumulator.cashBilledTotal = Number(
            parseFloat(
              parseFloat(accumulator.cashBilledTotal) + parseFloat(digitBill)
            )
          );
        } else {
          accumulator.noOfNonCashTrips++;

          accumulator.nonCashBilledTotal = Number(
            parseFloat(
              parseFloat(accumulator.nonCashBilledTotal) + parseFloat(digitBill)
            ).toFixed(2)
          );
        }

        getDriver(trip.driverID)
          .then(driverData => {
            const driverNoOfVehicle = driverData.vehicleID.length;

            accumulator.noOfDriversWithMoreThanOneVehicle +=
              driverNoOfVehicle > 1 ? 1 : 0;
          })
          .catch(error => {
            console.log(error);
          });

        accumulator.billedTotal = Number(parseFloat(accumulator.billedTotal));

        return accumulator;
      },
      { ...tripAnalysis }
    );

    //Delegate the task of computing mostTripsByDriver and highestEarningDriver respectively.
    const driversCumulativeTrips = await returnDriversCumulative(
      arrayOfTripData
    );

    await getDriverWithMostTrips(result, driversCumulativeTrips);

    return await getDriverWithHighestEarning(result, driversCumulativeTrips);
  });
}
async function getDriverWithMostTrips(outputObject, driversCumulativeTrips) {
  const driverIDs = Object.keys(driversCumulativeTrips);
  let maximumTrips = 0;
  let maximumTripDriverID = "";

  for (const driverID of driverIDs) {
    const currentMax = Math.max(
      maximumTrips,
      driversCumulativeTrips[driverID].noOfTrips
    );

    //If the value of the currentMax is different from maximumTrips then change the values of maximumTripDriverID and maximumTrips.
    if (currentMax !== maximumTrips) {
      maximumTripDriverID = driverID;
      maximumTrips = currentMax;
    }
  }

  //Retrieves the data of driver with most earning
  return await getDriver(maximumTripDriverID).then(driverWithMostTrip => {
    //Construct the desired object output
    outputObject.mostTripsByDriver = {
      name: driverWithMostTrip.name,
      email: driverWithMostTrip.email,
      phone: driverWithMostTrip.phone,
      noOfTrips: driversCumulativeTrips[maximumTripDriverID].noOfTrips,
      totalAmountEarned:
        driversCumulativeTrips[maximumTripDriverID].totalAmountEarned
    };
    return outputObject;
  });
}

async function getDriverWithHighestEarning(
  outputObject,
  driversCumulativeTrips
) {
  const driverIDs = Object.keys(driversCumulativeTrips);
  let maximumAmount = 0;
  let maximumAmountID = "";

  for (const driverID of driverIDs) {
    const currentMax = Math.max(
      maximumAmount,
      driversCumulativeTrips[driverID].totalAmountEarned
    );
    //If the value of the currentMax is different from maximumAmount then change the values of maximumAmountID and maximumAmount.
    if (currentMax !== maximumAmount) {
      maximumAmountID = driverID;
      maximumAmount = currentMax;
    }
  }

  return await getDriver(maximumAmountID).then(driverWithMostTrip => {
    //Construct the desired object output
    outputObject.highestEarningDriver = {
      name: driverWithMostTrip.name,
      email: driverWithMostTrip.email,
      phone: driverWithMostTrip.phone,
      noOfTrips: driversCumulativeTrips[maximumAmountID].noOfTrips,
      totalAmountEarned:
        driversCumulativeTrips[maximumAmountID].totalAmountEarned
    };
    return outputObject;
  });
}

function returnDriversCumulative(arrayOfTripData) {
  const accumulator = {};

  arrayOfTripData.forEach(currentObject => {
    //Checks if this driver is already added
    if (accumulator[currentObject.driverID]) {
      accumulator[currentObject.driverID].noOfTrips++;

      accumulator[currentObject.driverID].totalAmountEarned =
        accumulator[currentObject.driverID].totalAmountEarned +
        convertFromStringToNumber(currentObject.billedAmount);
    } else {
      accumulator[currentObject.driverID] = {
        noOfTrips: 1,
        totalAmountEarned: convertFromStringToNumber(currentObject.billedAmount)
      };
    }
  });

  return accumulator;
}

function convertFromStringToNumber(stringValue) {
  const stringValueType =
    typeof stringValue == "string"
      ? stringValue.split(",").join("")
      : stringValue;

  return parseFloat(stringValueType);
}

/**
 * This function should return the data for drivers in the specified format
 * Don't forget to write tests
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  const driverIds = Object.keys(drivers);
  const trips = await getTrips().then(trips => trips);
  const driverTripsSummary = await returnDriversCumulative(trips);

  //Perform the reduce operation on the driver Ids
  return driverIds.reduce((reportCollection, currentId) => {
    if (driverTripsSummary[currentId]) {
      const driverObject = {};
      const paymentsObject = returnPaymentStat(currentId, trips);

      driverObject["fullName"] = drivers[currentId].name;
      driverObject["id"] = currentId;
      driverObject["noOfCashTrips"] = paymentsObject.noOfCashTrips;
      driverObject["noOfNonCashTrips"] = paymentsObject.noOfNonCashTrips;
      driverObject["noOfTrips"] = driverTripsSummary[currentId].noOfTrips;
      driverObject["noOfVehicles"] = drivers[currentId].vehicleID.length;
      driverObject["phone"] = drivers[currentId].phone;
      driverObject["totalAmountEarned"] = paymentsObject.totalAmountEarned;
      driverObject["totalCashAmount"] = paymentsObject.totalCashAmount;
      driverObject["totalNonCashAmount"] = paymentsObject.totalNonCashAmount;
      driverObject["trips"] = extractDriverTrips(currentId, trips);
      driverObject["vehicles"] = drivers[currentId].vehicleID;

      reportCollection.push(driverObject);
    }

    return reportCollection;
  }, []);
}

function extractDriverTrips(driverId, trips) {
  return trips.reduce((tripCollection, trip) => {
    if (driverId === trip.driverID) {
      const accumulator = {};
      accumulator["user"] = trip.user.name;
      accumulator["created"] = trip.created;
      accumulator["pickup"] = trip.pickup;
      accumulator["destination"] = trip.destination;
      accumulator["billed"] = trip.billedAmount;
      accumulator["isCash"] = trip.isCash;
      tripCollection.push(accumulator);
    }
    return tripCollection;
  }, []);
}

function returnPaymentStat(driverId, trips) {
  let d = trips.reduce(
    (accumulator, trip) => {
      if (driverId === trip.driverID) {
        const amountEarned = convertFromStringToNumber(trip.billedAmount);

        accumulator.totalAmountEarned =
          accumulator.totalAmountEarned + amountEarned;

        if (trip.isCash) {
          accumulator.noOfCashTrips++;
          accumulator.totalCashAmount += amountEarned;
        } else {
          accumulator.noOfNonCashTrips++;
          accumulator.totalNonCashAmount += amountEarned;
        }
      }
      return accumulator;
    },
    {
      noOfCashTrips: 0,
      noOfNonCashTrips: 0,
      totalAmountEarned: 0,
      totalCashAmount: 0,
      totalNonCashAmount: 0,
      trips: []
    }
  );

  return d;
}

module.exports = { analysis, driverReport };
