//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

async function update_projectPriceLineItem(Project_Version_ID, Column_Name, Column_Value) {
  /// Project_Lifecycle_CD  & value map
const sqlQuery = `
 UPDATE  [SMC_APP_DEV].[app_cpqt].[Project_Version]  
  SET ${Column_Name} = ${Column_Value} 
  WHERE [Project_Version_ID] = ${Project_Version_ID} ;
  `;
  
  try {
    //await sql.connect(config);
    //const result = await sql.query(sqlQuery);
    await executeQuery(sqlQuery);
    console.log('Project Version Updated');
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = update_projectPriceLineItem;
