const sql = require('mssql');
const config = require('./config'); // Or include your connection configuration here

const executeQuery = function (query) {
    return new Promise((resolve, reject) => {
        sql.connect(config)
        .then(pool => {
            return pool.request().query(query)
        })
        .then(result => {
            //sql.close();
            resolve(result.recordset)
        })
        .catch(err => {
            //sql.close();
            reject(err);
        });
    });
}
module.exports = executeQuery;