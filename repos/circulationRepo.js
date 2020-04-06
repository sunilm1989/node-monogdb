const { MongoClient, ObjectID } = require("mongodb");

const circulationRepo = () => {
  const url = "mongodb://localhost:27017";
  const dbName = "circulation";

  const loadData = data => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        results = await db.collection("newspaper").insertMany(data);
        resolve(results);
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };

  const get = (query, limit) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        let items = db.collection("newspaper").find(query);
        if (limit > 0) {
          items = items.limit(limit);
        }
        resolve(await items.toArray());
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };

  const getById = id => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        let items = db.collection("newspaper").findOne({ _id: ObjectID(id) });
        resolve(await items);
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };

  const add = item => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const addedItem = await db.collection("newspaper").insertOne(item);
        resolve(addedItem.ops[0]);
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };

  const update = (id, item) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const updateItem = await db
          .collection("newspaper")
          .findOneAndReplace({ _id: ObjectID(id) }, item, {
            returnOriginal: false
          });
        resolve(updateItem.value);
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };

  const remove = id => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const removed = await db
          .collection("newspaper")
          .deleteOne({ _id: ObjectID(id) });
        resolve(removed.deletedCount);
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };

  const averageFinalists = () => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const average = await db
          .collection("newspaper")
          .aggregate([
            {
              $group: {
                _id: null,
                avgFinalists: {
                  $avg: "$Pulitzer Prize Winners and Finalists, 2004-2014"
                }
              }
            }
          ])
          .toArray();
        resolve(average[0].avgFinalists);
        client.close();
      } catch (err) {
        reject(err);
      }
    });
  };
  return { loadData, get, getById, add, update, remove, averageFinalists };
};

module.exports = circulationRepo();
