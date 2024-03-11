const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const executeQuery = require('./executeQuery'); // Or include your connection configuration here

async function get_projectPriceSummary(filterVariable, project_version_id) {
    try {
        //await sql.connect(config);
        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_projectPriceSummary.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        query += ` WHERE [Tenant_CD] = '${filterVariable}' AND [Project_Version_ID] = ${project_version_id} `; // Modify [SomeColumn] with the actual column name
        //console.log(query)
        // Execute the query
        //const result = await sql.query(query);
const result = await executeQuery(query);
        return result
    } catch (error) {
        console.log(query)
        console.error('SQL Error: 33', error);
        throw error;
    } finally {
        //await sql.close();
    }
}
module.exports = get_projectPriceSummary;