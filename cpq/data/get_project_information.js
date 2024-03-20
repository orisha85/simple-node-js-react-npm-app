const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const executeQuery = require('./executeQuery'); // Or include your connection configuration here

async function get_projects(filterVariable, projectID) {
    try {
        //await sql.connect(config);
        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_projects.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        query += ` WHERE [Tenant_CD] = '${filterVariable}' AND [Project_ID] = ${projectID}`; // Modify [SomeColumn] with the actual column name

        // Execute the query
        //const result = await sql.query(query);
const result = await executeQuery(query);
        return result
    } catch (error) {
        console.error('SQL Error: 17', error);
        throw error;
    } finally {
        //await sql.close();
    }
}
module.exports = get_projects;