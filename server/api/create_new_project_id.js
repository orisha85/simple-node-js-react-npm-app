const executeQuery = require('./executeQuery');
const fs = require('fs');
const path = require('path');

async function create_new_project_id() {
    try {
        //await sql.connect(config);
        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_new_project_id.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        //query += ` WHERE [Tenant_CD] = '${filterVariable}'`; // Modify [SomeColumn] with the actual column name

        // Execute the query
        const result = await executeQuery(query);
        //const result = await sql.query(query);
        //console.log('New project ID:', result.recordset);
        return result;

    } catch (error) {
        console.error('SQL Error 1:', error);
        throw error;
    } finally {
        //await sql.close();
    }
}
module.exports = create_new_project_id;