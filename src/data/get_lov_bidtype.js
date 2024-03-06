const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const config = require('./config'); // Or include your connection configuration here

async function bidtype(filterVariable) {
    try {
        await sql.connect(config);

        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_ref_lov.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        query += ` WHERE IsActive=1 AND [Tenant_CD] = '${filterVariable}' AND [Category_CD] = 'BID' ORDER BY SORTORDER ASC`; // Modify [SomeColumn] with the actual column name

        // Execute the query
        const result = await sql.query(query);
        return result.recordset;
    } catch (error) {
        console.error('SQL Error: 5', error);
        throw error;
    } finally {
        await sql.close();
    }
}
module.exports = bidtype;