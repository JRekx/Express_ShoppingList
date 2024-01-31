// Set testing environment
process.env.NODE_ENV = "test";

// Import necessary libraries
const request = require("supertest"); // For making API requests in tests

// Import the Express application to test
const app = require("../app");

// Reference to the in-memory database for items
let items = require("../fakeDb");

// Sample item for testing
let item = { name: "pokemon", price: 200 };

// Before each test, reset the items database to a default state
beforeEach(async () => {
  items.push(item);
});

// After each test, clear the items database to prevent test interference
afterEach(async () => {
  items = [];
});

/** Testing GET /items route
 * This test suite verifies that the items list can be retrieved successfully.
 */
describe("GET /items", async function () {
  test("Gets a list of items", async function () {
    const response = await request(app).get(`/items`);
    const { items } = response.body;
    expect(response.statusCode).toBe(200);
    expect(items).toHaveLength(1); // Expecting one item in the database
  });
});

/** Testing GET /items/:name route
 * This section tests retrieving a single item by its name,
 * and handles both successful retrieval and errors for non-existent items.
 */
describe("GET /items/:name", async function () {
  test("Gets a single item by name", async function () {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(item); // Verify the correct item is returned
  });

  test("Responds with 404 for a non-existent item", async function () {
    const response = await request(app).get(`/items/nonexistent`);
    expect(response.statusCode).toBe(404); // Ensure proper error response
  });
});

/** Testing POST /items route
 * This test suite checks the creation of new items,
 * ensuring the data is correctly added to the database.
 */
describe("POST /items", async function () {
  test("Creates a new item with given data", async function () {
    const newItem = { name: "Taco", price: 0 };
    const response = await request(app)
      .post(`/items`)
      .send(newItem);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toHaveProperty("name", newItem.name);
    expect(response.body.item).toHaveProperty("price", newItem.price);
  });
});

/** Testing PATCH /items/:name route
 * Tests the updating functionality for an item's information,
 * covering both successful updates and attempts to update non-existent items.
 */
describe("PATCH /items/:name", async function () {
  test("Updates an item's name", async function () {
    const newName = { name: "Troll" };
    const response = await request(app)
      .patch(`/items/${item.name}`)
      .send(newName);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toHaveProperty("name", newName.name);
  });

  test("Responds with 404 when attempting to update a non-existent item", async function () {
    const response = await request(app).patch(`/items/nonexistent`);
    expect(response.statusCode).toBe(404);
  });
});

/** Testing DELETE /items/:name route
 * This section ensures that items can be deleted correctly,
 * verifying the operation with the expected success message.
 */
describe("DELETE /items/:name", async function () {
  test("Deletes an item successfully", async function () {
    const response = await request(app)
      .delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" }); // Confirm deletion message
  });
});
