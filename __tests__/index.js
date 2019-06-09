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
    // console.log(data);

    expect(data).toMatchObject({
      noOfCashTrips: 26,
      noOfNonCashTrips: 24,
      billedTotal: 128224.69,
      cashBilledTotal: 69043.8,
      nonCashBilledTotal: 59180.89
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
      vehicles: [
        {
          plate: expect.any(String),
          manufacturer: expect.any(String)
        }
      ],
      noOfCashTrips: expect.any(Number),
      noOfNonCashTrips: expect.any(Number),
      totalAmountEarned: expect.any(Number),
      totalCashAmount: expect.any(Number),
      totalNonCashAmount: expect.any(Number),
      trips: [
        {
          user: expect.any(String),
          created: expect.any(String),
          pickup: expect.any(String),
          destination: expect.any(String),
          billed: expect.any(Number),
          isCash: expect.any(Boolean)
        }
      ]
    });
    expect(data.length).toBe(10);
  });
});

describe("My own tests go here - I should update this description", () => {
  test("something", () => {
    expect(true).toEqual(true);
  });
});
