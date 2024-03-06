const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const config = require('./config'); // Or include your connection configuration here

async function lookup_lifecycleDetails(lifecycle_cd) {
    try {
        await sql.connect(config);

        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_ProjectLifecycle.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        query += ` WHERE [Project_Lifecycle_CD] = '${lifecycle_cd}' `; // Modify [SomeColumn] with the actual column name

        // Execute the query
        const result = await sql.query(query);
        return result.recordset;
    } catch (error) {
        console.error('SQL Error: Lookup Lifecycle', error);
        throw error;
    } finally {
        await sql.close();
    }
}
module.exports = lookup_lifecycleDetails;