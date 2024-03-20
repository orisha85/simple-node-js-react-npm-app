//const { sql, express, bodyParser } = require('./dependencies');
//const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

async function update_projectPriceLineItem(Project_Price_Line_ID, Column_Name, Column_Value) {
  
const sqlQuery = `
 UPDATE [SMC_APP_DEV].[app_cpqt].[Project_Price_Line_Item]  
  SET ${Column_Name} = '${Column_Value}'
  WHERE [Project_Price_Line_ID] = '${Project_Price_Line_ID}' ;
  `;
  try {
    //await sql.connect(config);
    //const result = await sql.query(sqlQuery);
    await executeQuery(sqlQuery);
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = update_projectPriceLineItem;