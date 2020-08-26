var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var dataAccess = {
    insertUserData: function (userObj) {
        return new Promise(function (resolve, reject) {
            try {
                MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("mean_app");
                    // var myobj = { name: "Company Inc", address: "Highway 37" };
                    dbo.collection("users").insertOne(userObj, function (err, res) {
                        if (err) throw err;
                        db.close();
                        resolve(res)
                    });
                });
            } catch (err) {
                reject(err);
            }
        })
    },
    getUserData: function () {
        return new Promise(function (resolve, reject) {
            try {
                MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("mean_app");
                    dbo.collection("users").find({}).toArray(function (err, result) {
                        if (err) throw err;
                        resolve(result)
                        db.close();
                    });
                });
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = dataAccess;