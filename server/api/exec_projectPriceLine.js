
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const executeQuery = require('./executeQuery'); // Or include your connection configuration here

async function exec_projectPriceLine(project_version_id) {
    try {
        //await sql.connect(config);
        // Load the query from the text file
        let query = `EXEC [SMC_APP_DEV].[dbo].[InsertProjectPriceLineItem] @Project_Version =${project_version_id} ; `;

        // Append WHERE clause using the variable passed from the request 
        //query += ` ${project_version_id} `; // Modify [SomeColumn] with the actual column name

        // Execute the query
        //const result = await sql.query(query);
const result = await executeQuery(query);
        console.log("exec query",query)
        return result
    } catch (error) {
        console.log("exec query error",query)
        console.error('SQL Error to the max:', error);
        throw error;
    } finally {
        //await sql.close();
    }
}
module.exports = exec_projectPriceLine;
