const { MongoClient } = require("mongodb");
const assert = require("assert");
const circulationRepo = require("./repos/circulationRepo.js");
const data = require("./circulation.json");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

const main = async () => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();

  try {
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);

    const getData = await circulationRepo.get();
    assert.equal(data.length, getData.length);

    const filterData = await circulationRepo.get({
      Newspaper: "Washington Post"
    });
    assert.deepEqual(filterData[0].Newspaper, "Washington Post");

    const limitData = await circulationRepo.get({}, 3);
    assert.equal(limitData.length, 3);

    const id = getData[4]._id.toString();
    const byId = await circulationRepo.getById(id);
    assert.deepEqual(byId, getData[4]);

    const newItems = {
      Newspaper: "New News Paper",
      "Daily Circulation, 2004": 2192,
      "Daily Circulation, 2013": 1674,
      "Change in Daily Circulation, 2004-2013": 100,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0
    };

    const addedItem = await circulationRepo.add(newItems);
    assert(addedItem._id);

    const addedItemById = await circulationRepo.getById(addedItem._id);
    assert.deepEqual(addedItemById, addedItem);

    const updateItem = await circulationRepo.update(addedItem._id, {
      Newspaper: "Update News Paper",
      "Daily Circulation, 2004": 2192,
      "Daily Circulation, 2013": 1674,
      "Change in Daily Circulation, 2004-2013": 100,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0
    });
    assert.equal(updateItem.Newspaper, "Update News Paper");

    const updateItemQuery = await circulationRepo.getById(addedItem._id);
    assert.equal(updateItemQuery.Newspaper, "Update News Paper");

    const removed = await circulationRepo.remove(addedItem._id);
    assert(removed);

    const deletedItem = await circulationRepo.getById(addedItem._id);
    assert.equal(deletedItem, null);

    const averageFinalists = await circulationRepo.averageFinalists();
    console.log(averageFinalists);
  } catch (err) {
    console.log(err);
  } finally {
    const admin = client.db(dbName).admin();
    await client.db(dbName).dropDatabase();
    console.log(await admin.listDatabases());
    client.close();
  }
};

main();
