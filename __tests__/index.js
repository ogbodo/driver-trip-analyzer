const { analysis, driverReport } = require("../src/index");

describe("analysis spec", () => {
  test("matches the required data format", async () => {
    const data = await analysis();

    expect(data).toEqual({
      noOfCashTrips: expect.any(Number),
      noOfNonCashTrips: expect.any(Number),
      billedTotal: expect.any(Number),
      cashBilledTotal: expect.any(Number),
      nonCashBilledTotal: expect.any(Number),
      noOfDriversWithMoreThanOneVehicle: expect.any(Number),
      mostTripsByDriver: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        noOfTrips: expect.any(Number),
        totalAmountEarned: expect.any(Number)
      },
      highestEarningDriver: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        noOfTrips: expect.any(Number),
        totalAmountEarned: expect.any(Number)
      }
    });
  });

  test("analysis solution", async () => {
    const data = await analysis();

    expect(data).toMatchObject({
      noOfCashTrips: 26,
      noOfNonCashTrips: 24,
      billedTotal: 128224.69,
      cashBilledTotal: 69043.8,
      nonCashBilledTotal: 59180.89,
      noOfDriversWithMoreThanOneVehicle: 3
    });
  });
});

describe("driver report", () => {
  test("matches the required data format", async () => {
    const data = await driverReport();
    expect(data[0]).toEqual({
      fullName: expect.any(String),
      id: expect.any(String),
      phone: expect.any(String),
      noOfTrips: expect.any(Number),
      noOfVehicles: expect.any(Number),
      vehicles: expect.any(Array),
      noOfCashTrips: expect.any(Number),
      noOfNonCashTrips: expect.any(Number),
      totalAmountEarned: expect.any(Number),
      totalCashAmount: expect.any(Number),
      totalNonCashAmount: expect.any(Number),
      trips: expect.any(Array)
    });

    expect(data.length).toBe(10);
  });
  test("Driver Solution", async () => {
    const data = await driverReport();

    expect(data[0]).toMatchObject({
      fullName: "Garcia Gaines",
      id: "d247da84-ffcb-4ca8-8459-f98c99b59822",
      noOfCashTrips: 1,
      noOfNonCashTrips: 5,
      noOfTrips: 6,
      noOfVehicles: 1,
      phone: "+234 808-064-1330",
      totalAmountEarned: 11793.03,
      totalCashAmount: 1715.16,
      totalNonCashAmount: 10077.88,
      vehicles: [{ plateNumber: "EPE-5110-LG", manufacturer: "Ducati" }]
    });
  });
});
