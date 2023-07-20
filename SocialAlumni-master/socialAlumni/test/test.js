const test = require('tape');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const collection = require('../models/user');
const mongoose = require("mongoose");

/* load .env*/
dotenv.config();

const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_url = `mongodb+srv://${user}:${password}@cluster0.hei7umz.mongodb.net/?retryWrites=true&w=majority`
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

//Test to make sure continous integration checking works
test('My Test', (t) => {
  t.equal(1 + 1, 2, '1+1 should equal 2');
  t.end();
});

test('MongoDB Connection Test', async (t) => {
  try {
    const client = new MongoClient(db_url, options);
    await client.connect();
    // Check if the connection is established
    t.ok(client, 'MongoDB connection is successful');
    // Close the MongoDB connection
    await client.close();
    t.end();
  } catch (error) {
    t.fail(`Failed to connect to MongoDB: ${error.message}`);
    t.end();
  }
});

test('Retrieve objects from MongoDB', async (t) => {
  await mongoose.connect(db_url, options).then(() => {
  }).catch((e) => {
    console.error(e, 'could not connect!')
  });

  // Find objects matching a query
  const query = {first_name:'max'};
  const objects = await collection.find(query);

  t.ok(objects.length > 0, 'Objects should be retrieved from MongoDB');
      // Close the MongoDB connection
  await mongoose.disconnect();
  t.end();
});

test('User object should have the expected properties', async (t) => {
  await mongoose.connect(db_url, options).then(() => {
  }).catch((e) => {
    console.error(e, 'could not connect!')
  });
    // Find objects matching a query
  const query = {first_name:'test1'};
  const objects = await collection.find(query);
  const obj = await collection.findOne({ first_name: 'test1' });
  let actualProperties = [];
  const expectedProperties = ['test1', 'test2', 'test1@1', 'test1@1', 111];
  actualProperties[0] = obj.first_name;
  actualProperties[1] = obj.last_name;
  actualProperties[2] = obj.email;
  actualProperties[3] = obj.username;
  actualProperties[4] = obj.phone_number;
  t.deepEqual(actualProperties, expectedProperties, 'Object should have expected properties');
  await mongoose.disconnect()
  t.end();
});
