//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';


async function merge_projectCostHeader(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }
const values = data.map((row) => `('${row.Project_Cost_Header_ID}', 
                                 '${row.Project_Version_ID}', 
                                 '${row.Project_ID}', 
                                 '${row.Tenant_CD}', 
                                 '${row.Section_ID}', 
                                 '${row.Section_Desc}', 
                                 '${row.Section_Notes}',  
                                 '${row.Include_Subtotal}', 
                                 '${row.CreatedBy}', 
                                 '${row.CreatedDate}', 
                                 '${row.ModifiedBy}', 
                                 '${row.ModifiedDate}'
                                 )`).join(',');
  
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_cpqt].[Project_Cost_Line_Item] AS tar 
  USING (VALUES ${values}) AS src (
       [Project_Cost_Header_ID]
      ,[Project_Version_ID]
      ,[Project_ID]
      ,[Tenant_CD]
      ,[Version_ID]
      ,[Section_ID]
      ,[Section_Desc]
      ,[Section_Notes]
      ,[Include_Subtotal]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModifiedBy]
      ,[ModifiedDate] ) 
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
      AND tar.[Project_Version_ID] = src.[Project_Version_ID]
      AND tar.[Project_Cost_Header_ID]= src.[Project_Cost_Header_ID])
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_Cost_Line_Item_ID] = src.[Project_Cost_Line_Item_ID]
    ,tar.[Project_Cost_Header_ID] = src.[Project_Cost_Header_ID]
    ,tar.[Project_Version_ID] = src.[Project_Version_ID]
    ,tar.[Project_ID] = src.[Project_ID]
    ,tar.[Tenant_CD] = src.[Tenant_CD]
    ,tar.[SKU_Item_ID] = src.[SKU_Item_ID]
    ,tar.[SKU_Group] = src.[SKU_Group]
    ,tar.[SKU_Family] = src.[SKU_Family]
    ,tar.[SKU_Activity] = src.[SKU_Activity]
    ,tar.[Mat_UoM] = src.[Mat_UoM]
    ,tar.[Mat_Unit_Rate] = src.[Mat_Unit_Rate]
    ,tar.[Mat_Quantity_Actual] = src.[Mat_Quantity_Actual]
    ,tar.[Mat_Quantity_Quote] = src.[Mat_Quantity_Quote]
    ,tar.[Labour_Hour_Standard] = src.[Labour_Hour_Standard]
    ,tar.[Labour_Hour_Override] = src.[Labour_Hour_Override]
    ,tar.[Labour_Headcount] = src.[Labour_Headcount]
    ,tar.[Labour_Rate] = src.[Labour_Rate]
    ,tar.[Labour_Cost] = src.[Labour_Cost]
    ,tar.[Equipment_CD] = src.[Equipment_CD]
    ,tar.[Equipment_Hour] = src.[Equipment_Hour]
    ,tar.[Equipment_Rate] = src.[Equipment_Rate]
    ,tar.[Equipment_Cost] = src.[Equipment_Cost]
    ,tar.[Overhead_Hour] = src.[Overhead_Hour]
    ,tar.[Overhead_Rate] = src.[Overhead_Rate]
    ,tar.[Overhead_Cost] = src.[Overhead_Cost]
    ,tar.[CreatedBy] = src.[CreatedBy]
    ,tar.[CreatedDate] = src.[CreatedDate]
    ,tar.[ModifiedBy] = src.[ModifiedBy]
    ,tar.[ModifiedDate] = src.[ModifiedDate]
  WHEN NOT MATCHED THEN
    INSERT ([Project_Cost_Line_Item_ID]
    ,[Project_Cost_Header_ID]
    ,[Project_Version_ID]
    ,[Project_ID]
    ,[Tenant_CD]
    ,[SKU_Item_ID]
    ,[SKU_Group]
    ,[SKU_Family]
    ,[SKU_Activity]
    ,[Mat_UoM]
    ,[Mat_Unit_Rate]
    ,[Mat_Quantity_Actual]
    ,[Mat_Quantity_Quote]
    ,[Labour_Hour_Standard]
    ,[Labour_Hour_Override]
    ,[Labour_Headcount]
    ,[Labour_Rate]
    ,[Labour_Cost]
    ,[Equipment_CD]
    ,[Equipment_Hour]
    ,[Equipment_Rate]
    ,[Equipment_Cost]
    ,[Overhead_Hour]
    ,[Overhead_Rate]
    ,[Overhead_Cost]
    ,[CreatedBy]
    ,[CreatedDate]
    ,[ModifiedBy]
    ,[ModifiedDate]
        )
    VALUES ( src.[Project_Cost_Line_Item_ID]
        ,src.[Project_Cost_Header_ID]
        ,src.[Project_Version_ID]
        ,src.[Project_ID]
        ,src.[Tenant_CD]
        ,src.[SKU_Item_ID]
        ,src.[SKU_Group]
        ,src.[SKU_Family]
        ,src.[SKU_Activity]
        ,src.[Mat_UoM]
        ,src.[Mat_Unit_Rate]
        ,src.[Mat_Quantity_Actual]
        ,src.[Mat_Quantity_Quote]
        ,src.[Labour_Hour_Standard]
        ,src.[Labour_Hour_Override]
        ,src.[Labour_Headcount]
        ,src.[Labour_Rate]
        ,src.[Labour_Cost]
        ,src.[Equipment_CD]
        ,src.[Equipment_Hour]
        ,src.[Equipment_Rate]
        ,src.[Equipment_Cost]
        ,src.[Overhead_Hour]
        ,src.[Overhead_Rate]
        ,src.[Overhead_Cost]
        ,src.[CreatedBy]
        ,src.[CreatedDate]
        ,src.[ModifiedBy]
        ,src.[ModifiedDate]
       );
  `;
  
  try {
    //await sql.connect(config);
    //const result = await executeQuery(sqlQuery);
    await executeQuery(sqlQuery);
    console.log('Schedule data merged successfully!');
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = merge_projectCostHeader;
