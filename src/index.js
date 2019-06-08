const { getTrips, getDriver } = require("../src/api/index");
/**
 * This function should return the trip data analysis
 * Don't forget to write tests
 *
 * @returns {any} Trip data analysis
 */
function analysis() {
  const tripAnalysis = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0
  };

  const allTrips = getTrips();

  allTrips.then(arrayOfTripData => {
    //Delegate the task of computing mostTripsByDriver and highestEarningDriver respectively.
    getDriverWithMostTrips(tripAnalysis, arrayOfTripData);
    getDriverWithHighestEarning(tripAnalysis, arrayOfTripData);

    /**Use the reduce method to construct and return the big object */
    arrayOfTripData.reduce(
      (accumulator, currentObject) => {
        const isCashTrip = currentObject.isCash;

        isCashTrip
          ? accumulator.noOfCashTrips++
          : accumulator.noOfNonCashTrips++;

        const billTotal = Number(currentObject.billedTotal.split(",").join());
        accumulator.billedTotal += billTotal;

        isCashTrip
          ? (accumulator.cashBilledTotal += billTotal)
          : (accumulator.nonCashBilledTotal += billTotal);

        getDriver(currentObject.driverID)
          .then(driverData => {
            const driverNoOfVehicle = driverData[vehicleID].length;

            accumulator.noOfDriversWithMoreThanOneVehicle +=
              driverNoOfVehicle > 1 ? 1 : 0;
          })
          .catch(error => {});
      },
      { ...tripAnalysis }
    );
  });
}

async function getDriverWithMostTrips(outputObject, drivers) {
  const driversCumulativeTrips = await returnDriversCumulative(drivers);

  const driverIDs = Object.keys(driversCumulativeTrips);
  let maximumTrips = 0;
  let maximumTripDriverID = "";

  for (const driverID of driverIDs) {
    const currentMax = Math.max(maximumTrips, driverIDs[driverID].noOfTrips);
    //If the value of the currentMax is different from maximumTrips then change the values of maximumTripDriverID and maximumTrips.
    if (currentMax !== maximumTrips) {
      maximumTripDriverID = driverID;
      maximumTrips = currentMax;
    }
  }

  //Retrieves the data of driver with most earning
  getDriver(maximumTripDriverID).then(driverWithMostTrip => {
    //Construct the desired object output
    outputObject[mostTripsByDriver] = {
      name: driverWithMostTrip.name,
      email: driverWithMostTrip.email,
      phone: driverWithMostTrip.phone,
      noOfTrips: driversCumulativeTrips.noOfTrips,
      totalAmountEarned: driversCumulativeTrips.totalAmountEarned
    };
  });
}

async function getDriverWithHighestEarning(outputObject, drivers) {
  const driversCumulativeTrips = await returnDriversCumulative(drivers);

  const driverIDs = Object.keys(driversCumulativeTrips);
  let maximumAmount = 0;
  let maximumAmountID = "";

  for (const driverID of driverIDs) {
    const currentMax = Math.max(maximumAmount, driverIDs[totalAmountEarned]);
    //If the value of the currentMax is different from maximumAmount then change the values of maximumAmountID and maximumAmount.
    if (currentMax !== maximumAmount) {
      maximumAmountID = driverID;
      maximumAmount = currentMax;
    }
  }

  //Retrieves the data of driver with most earning
  getDriver(maximumAmountID).then(driverWithMostTrip => {
    //Construct the desired object output
    outputObject[highestEarningDriver] = {
      name: driverWithMostTrip.name,
      email: driverWithMostTrip.email,
      phone: driverWithMostTrip.phone,
      noOfTrips: driversCumulativeTrips.noOfTrips,
      totalAmountEarned: driversCumulativeTrips.totalAmountEarned
    };
  });
}

function returnDriversCumulative(drivers) {
  const accumulator = {};

  drivers.forEach(currentObject => {
    //Checks if this driver is already added
    if (accumulator[currentObject.driverID]) {
      accumulator[currentObject.driverID].noOfTrips++;
      accumulator[currentObject.driverID].totalAmountEarned += Number(
        currentObject.billedTotal.split(",").join()
      );
    } else {
      const amountEarned = Number(currentObject.billedTotal.split(",").join());

      accumulator[currentObject.driverID] = {
        noOfTrips: 1,
        totalAmountEarned: amountEarned
      };
    }
  });
  return accumulator;
}

/**
 * This function should return the data for drivers in the specified format
 * Don't forget to write tests
 *
 * @returns {any} Driver report data
 */
function driverReport() {}

module.exports = { analysis, driverReport };
