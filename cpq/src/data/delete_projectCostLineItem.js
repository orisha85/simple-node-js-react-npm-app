//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

async function delete_projectCostLineItem(Project_Price_Line_ID) {
  
const sqlQuery = `
 DELETE FROM  [SMC_APP_DEV].[app_cpqt].[Project_Cost_Line_Item] 
  WHERE [Project_Cost_Line_Item_ID] = ${Project_Price_Line_ID} ;
  `;
  try {
    //await sql.connect(config);
    console.log(sqlQuery);
    //const result = await sql.query(sqlQuery);
    await executeQuery(sqlQuery);
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = delete_projectCostLineItem;