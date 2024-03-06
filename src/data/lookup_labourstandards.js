const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const config = require('./config'); // Or include your connection configuration here

async function lookup_labourstandards(filterVariable, Project_Type, SKU_Activity, SKU_Family) {
    try {
        await sql.connect(config);
        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_labourstandards.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        // Append WHERE clause using the variable passed from the request
        query += ` WHERE [Tenant_CD] = '${filterVariable}' AND [Labour_Factor_1_Item_Desc] = '${Project_Type}' AND [Labour_Factor_2_Item_Desc] ='${SKU_Activity}' AND [Labour_Factor_3_Item_Desc] ='${SKU_Family}' `; // Modify [SomeColumn] with the actual column name

        // Execute the query
        const result = await sql.query(query);
        return result.recordset;
    } catch (error) {
        console.error('SQL Error: 30', error);
        throw error;
    } finally {
        await sql.close();
    }
}
module.exports = lookup_labourstandards;