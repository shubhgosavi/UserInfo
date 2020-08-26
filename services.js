var request = require('request');
var dataAccess = require('./dataAccess.js');
let table = require("table");

var services = {

    getUsersData: async function (req, res, next) {
        try {
            let user = await services.getUser().catch(err => { return false });
            if (user && user.length) {
                await dataAccess.insertUserData(user[0]).catch(err => { return false });
            }
            let resp = await dataAccess.getUserData().catch(err => { return false });
            if (resp && resp.length) {
                let result = await services.getSortedResult(resp);
                res.status(200).json({ result })
            } else {
                throw new Error('Something went wrong!');
            }
        } catch (err) {
            return false;
        }
    },
    getUser: async function () {
        try {
            const url = 'https://randomuser.me/api';
            return new Promise(async (resolve, reject) => {
                request({
                    method: 'GET',
                    url,
                    rejectUnauthorized: false,
                    json: true,
                }, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(body.results);
                });
            });
        } catch (err) {
            return false;
        }
    },
    getSortedResult: function (users) {
        return new Promise(function (resolve, reject) {
            try {
                let maleObj = {
                    Nationality: 'NA',
                    zeroToThirty: 0,
                    thirtyToFifty: 0,
                    aboveFifty: 0,
                };
                let femaleObj = {
                    nationality: 'NA',
                    zeroToThirty: 0,
                    thirtyToFifty: 0,
                    aboveFifty: 0,
                };
                for (let item of users) {
                    if (item.gender == 'male') {
                        let age = item.dob.age;
                        if (age <= 30) {
                            maleObj.zeroToThirty += 1;
                        } else if (age > 30 && age <= 50) {
                            maleObj.thirtyToFifty += 1;
                        } else if (age == 50 || age > 50) {
                            maleObj.aboveFifty += 1;
                        }
                        maleObj.nationality = item.nat;
                    } else if (item.gender == 'female') {
                        let age = item.dob.age;
                        if (age <= 30) {
                            femaleObj.zeroToThirty += 1;
                        } else if (age > 30 && age <= 50) {
                            femaleObj.thirtyToFifty += 1;
                        } else if (age == 50 || age > 50) {
                            femaleObj.aboveFifty += 1;
                        }
                        femaleObj.nationality = item.nat;
                    }
                }
                let data, config;
                data = [
                    ['Nationality', '0-30', '30-50', '50 And Above'],
                    [maleObj.nationality, maleObj.zeroToThirty, maleObj.thirtyToFifty, maleObj.aboveFifty],
                ]
                config = {
                    columns: {
                        0: { width: 12 },
                        1: { width: 10 },
                        2: { width: 10 }
                    }
                };
                let x = table.table(data, config);
                console.log("Male");
                console.log(x);
                data = [
                    ['Nationality', '0-30', '30-50', '50 And Above'],
                    [femaleObj.nationality, femaleObj.zeroToThirty, femaleObj.thirtyToFifty, femaleObj.aboveFifty],
                ]
                x = table.table(data, config);
                console.log("Female");
                console.log(x);
                resolve({ maleObj, femaleObj });
            } catch (err) {
                reject(err)
            }
        })
    }

}

module.exports = services;