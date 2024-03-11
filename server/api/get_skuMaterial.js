const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const executeQuery = require('./executeQuery'); // Or include your connection configuration here

async function get_skuMaterial(filterVariable) {
    try {
        //await sql.connect(config);

        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_skuMaterial.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        query += ` WHERE [Tenant_CD] = '${filterVariable}'`; // Modify [SomeColumn] with the actual column name

        // Execute the query
        //const result = await sql.query(query);
const result = await executeQuery(query);
        return result
    } catch (error) {
        console.error('SQL Error: 27', error);
        throw error;
    } finally {
        //await sql.close();
    }
}
module.exports = get_skuMaterial;