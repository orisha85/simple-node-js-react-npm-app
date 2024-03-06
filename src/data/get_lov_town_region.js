const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const config = require('./config'); // Or include your connection configuration here

async function get_lov_town_region(filterVariable, region) {
    try {
        await sql.connect(config);

        // Load the query from the text file
        const queryFilePath = path.join(__dirname, 'QueryList', 'query_ref_lov.sql'); // Path to query file in subfolder
        let query = fs.readFileSync(queryFilePath, 'utf8');

        query += ` WHERE IsActive=1 AND [Tenant_CD] = '${filterVariable}' AND [Category_CD] = 'RG' AND [Item_CD] = '${region}' ORDER BY SORTORDER ASC`;

        // Append WHERE clause using the variable passed from the request
        //query += ` WHERE IsActive=1 AND [Tenant_CD] = '${filterVariable}' AND [Category_CD] = 'RG' AND ParentReferenceValueItem_CD like '%NY%' ORDER BY SORTORDER ASC`; // Modify [SomeColumn] with the actual column name

        // Execute the query
        const result = await sql.query(query);
        
        const itemCDValue = result.recordset[0]?.Item_CD;

        const queryFilePath1 = path.join(__dirname, 'QueryList', 'query_ref_lov.sql'); // Path to query file in subfolder
        let query1 = fs.readFileSync(queryFilePath1, 'utf8');

        query1 += ` WHERE IsActive=1 AND [Tenant_CD] = '${filterVariable}' AND [Category_CD] = 'TC' AND ParentReferenceValueItem_CD like '%${itemCDValue}%' ORDER BY SORTORDER ASC`;
        result1 = await sql.query(query1);
        
        return result1.recordset;

    } catch (error) {
        console.error('SQL Error: 15', error);
        throw error;
    } finally {
        await sql.close();
    }
}
module.exports = get_lov_town_region;