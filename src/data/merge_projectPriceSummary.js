//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const config = require('./config');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

async function merge_projectPriceSummary(data) {
  //console.log("projectVersion data", data)

  data = [data]
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }

// {
//   "Section": 2164861001,
//   "SKU_Item_ID": "1210101e",
//   "Mat_UoM": "LF",
//   "SKU_Item_Desc": "",
//   "SKU_Alias_Item_ID": "1210101e",
//   "Unit_Cost": 0.05664090474134302,
//   "Mat_Quantity_Actual": 226500,
//   "Total_Line_Cost": 119123.2922503494,
//   "Margin": 0.5294368544459973,
//   "Total_Price": 27000,
//   "Quoted_Qty": 225000,
//   "Price": 0.12,
//   "Project_Version_ID": "24054011"
// }

console.log("row data", data)
const values = data.map((row) => {
const Price_Per_Item = isNaN(row.Price) ? 0 : row.Price;
//SKU_Item_ID

const projectID = parseInt(row.Project_Version_ID.substring(0, 7));
const projectVersionID = parseInt(row.Project_Version_ID);
const projectCostHeader = parseInt(row.Header_ID) + projectVersionID*100;

//console.log("row data", data)
return                           `(${projectCostHeader}, 
                                 ${projectVersionID}, 
                                 ${row.Header_ID},
                                 ${projectID}, 
                                 'smc', 
                                 '${row.SKU_Item_ID}', 
                                 '${row.SKU_Item_Desc}', 
                                 ${row.Mat_Quantity_Actual},  
                                 ${row.Quantity_Actual}, 
                                 ${row.Unit_Cost},
                                 ${row.Total_Line_Cost}, 
                                 ${Price_Per_Item},  
                                 ${row.Total_Price}, 
                                 ${row.Margin},  
                                 'enduser',                                                        
                                 getdate(), 
                                 'enduser', 
                                 getdate() )
                                 `}).join(',');
  
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_cpqt].[Project_Price_Summary] AS tar 
  USING (VALUES ${values}) AS src (
    [Project_Price_Header_ID]
      ,[Project_Version_ID]
      ,[Header_ID]
      ,[Project_ID]
      ,[Tenant_CD]
      ,[SKU_Alias_Item_ID]
      ,[SKU_Alias_Item_Desc]
      ,[Quantity_Actual]
      ,[Quantity_Quote]
      ,[Cost_Per_Unit]
      ,[Total_Line_Cost]
      ,[Price_Per_Unit]
      ,[Total_Line_Price]
      ,[Margin_Line_Percentage]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModifiedBy]
      ,[ModifiedDate] ) 
    ON ( tar.[Project_Version_ID] = src.[Project_Version_ID] 
      AND tar.Project_Price_Header_ID=src.Project_Price_Header_ID
      AND tar.SKU_Alias_Item_ID=src.SKU_Alias_Item_ID
      )
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_Price_Header_ID]=src.[Project_Price_Header_ID]
    ,tar.[Project_Version_ID]=src.[Project_Version_ID]
    ,tar.Header_ID=src.Header_ID
    ,tar.[Project_ID]=src.[Project_ID]
    ,tar.[Tenant_CD]=src.[Tenant_CD]
    ,tar.[SKU_Alias_Item_ID]=src.[SKU_Alias_Item_ID]
    ,tar.[SKU_Alias_Item_Desc]=src.[SKU_Alias_Item_Desc]
    ,tar.[Quantity_Actual]=src.[Quantity_Actual]
    ,tar.[Quantity_Quote]=src.[Quantity_Quote]
    ,tar.[Cost_Per_Unit]=src.[Cost_Per_Unit]
    ,tar.[Total_Line_Cost]=src.[Total_Line_Cost]
    ,tar.[Price_Per_Unit]=src.[Price_Per_Unit]
    ,tar.[Total_Line_Price]=src.[Total_Line_Price]
    ,tar.[Margin_Line_Percentage]=src.[Margin_Line_Percentage]
    ,tar.[CreatedBy]=src.[CreatedBy]
    ,tar.[CreatedDate]=src.[CreatedDate]
    ,tar.[ModifiedBy]=src.[ModifiedBy]
    ,tar.[ModifiedDate]=src.[ModifiedDate]
    
  WHEN NOT MATCHED THEN
    INSERT ([Project_Price_Header_ID]
        ,[Project_Version_ID]
        ,Header_ID
        ,[Project_ID]
        ,[Tenant_CD]
        ,[SKU_Alias_Item_ID]
        ,[SKU_Alias_Item_Desc]
        ,[Quantity_Actual]
        ,[Quantity_Quote]
        ,[Cost_Per_Unit]
        ,[Total_Line_Cost]
        ,[Price_Per_Unit]
        ,[Total_Line_Price]
        ,[Margin_Line_Percentage]
        ,[CreatedBy]
        ,[CreatedDate]
        ,[ModifiedBy]
        ,[ModifiedDate]
        )
    VALUES (src.[Project_Price_Header_ID]
        ,src.[Project_Version_ID]
        ,src.Header_ID
        ,src.[Project_ID]
        ,src.[Tenant_CD]
        ,src.[SKU_Alias_Item_ID]
        ,src.[SKU_Alias_Item_Desc]
        ,src.[Quantity_Actual]
        ,src.[Quantity_Quote]
        ,src.[Cost_Per_Unit]
        ,src.[Total_Line_Cost]
        ,src.[Price_Per_Unit]
        ,src.[Total_Line_Price]
        ,src.[Margin_Line_Percentage]
        ,src.[CreatedBy]
        ,src.[CreatedDate]
        ,src.[ModifiedBy]
        ,src.[ModifiedDate]
  
       );
  `;

  try {
    // console.log(sqlQuery)
    await sql.connect(config);
    //const result = await sql.query(sqlQuery);
    await sql.query(sqlQuery);
    console.log('Price summary data merged successfully!');
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = merge_projectPriceSummary;