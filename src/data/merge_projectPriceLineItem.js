//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const config = require('./config');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';


async function merge_projectPriceLineItem(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }
const values = data.map((row) => `('${row.Project_Price_Line_Item_ID}', 
                                 '${row.Project_Price_Header_ID}', 
                                 '${row.Project_Version_ID}', 
                                 '${row.Project_ID}', 
                                 '${row.Tenant_CD}', 
                                 '${row.SKU_Item_ID}', 
                                 '${row.SKU_Group}', 
                                 '${row.SKU_Family}',  
                                 '${row.SKU_Activity}', 
                                 '${row.Mat_UoM}', 
                                 '${row.Mat_Unit_Rate}', 
                                 '${row.Mat_Quantity_Actual}', 
                                 '${row.Labour_Hour_Standard}', ,  
                                 '${row.Labour_Headcount}', 
                                 '${row.Labour_Rate}', 
                                 '${row.Labour_Cost}', 
                                 '${row.Equipment_Hour}', 
                                 '${row.Equipment_Rate}', 
                                 '${row.Equipment_Cost}', 
                                 '${row.Overhead_Hour}',  
                                 '${row.Overhead_Rate}',  
                                 '${row.Overhead_Cost}', 
                                 '${row.Mobalization_Total_Hour}', 
                                 '${row.Mobalization_Line_Weight}', 
                                 '${row.Mob_Weighted_Labour_Hour}', 
                                 '${row.Mob_Weighted_Labour_Rate}', 
                                 '${row.Mob_Weighted_Labour_Cost}', 
                                 '${row.Mob_Weighted_Travel_Hour}', 
                                 '${row.Mob_Weighted_Travel_Rate}', 
                                 '${row.Mob_Weighted_Travel_Cost}',                                  
                                 '${row.Total_Line_Cost}', 
                                 '${row.CreatedBy}', 
                                 '${row.CreatedDate}', 
                                 '${row.ModifiedBy}', 
                                 '${row.ModifiedDate}'
                                 )`).join(',');
  
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_cpqt].[Project_Price_Line_Item] AS tar 
  USING (VALUES ${values}) AS src (
    [Project_Price_Line_ID]
    ,[Project_Price_Header_ID]
    ,[Project_Version_ID]
    ,[Project_ID]
    ,[Tenant_CD]
    ,[SKU_Item_ID]
    ,[SKU_Item_Desc]
    ,[SKU_Group]
    ,[SKU_Family]
    ,[SKU_Activity]
    ,[Mat_UoM]
    ,[Mat_Unit_Rate]
    ,[Mat_Quantity_Actual]
    ,[Labour_Hour_Standard]
    ,[Labour_Headcount]
    ,[Labour_Rate]
    ,[Labour_Cost]
    ,[Equipment_Hour]
    ,[Equipment_Rate]
    ,[Equipment_Cost]
    ,[Overhead_Hour]
    ,[Overhead_Rate]
    ,[Overhead_Cost]
    ,[Mobalization_Total_Hour]
    ,[Mobalization_Line_Weight]
    ,[Mob_Weighted_Labour_Hour]
    ,[Mob_Weighted_Labour_Rate]
    ,[Mob_Weighted_Labour_Cost]
    ,[Mob_Weighted_Travel_Hour]
    ,[Mob_Weighted_Travel_Rate]
    ,[Mob_Weighted_Travel_Cost]
    ,[SKU_Alias_Item_ID]
    ,[SKU_Alias_Item_Desc]
    ,[Total_Line_Cost]
    ,[CreatedBy]
    ,[CreatedDate]
    ,[ModifiedBy]
    ,[ModifiedDate] )
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
      AND tar.[Project_Version_ID] = src.[Project_Version_ID]
      AND tar.[Project_Price_Line_Item_ID]- src.[Project_Price_Line_Item_ID] )
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_Price_Line_ID]=src.[Project_Price_Line_ID]
    ,tar.[Project_Price_Header_ID]=src.[Project_Price_Header_ID]
    ,tar.[Project_Version_ID]=src.[Project_Version_ID]
    ,tar.[Project_ID]=src.[Project_ID]
    ,tar.[Tenant_CD]=src.[Tenant_CD]
    ,tar.[SKU_Item_ID]=src.[SKU_Item_ID]
    ,tar.[SKU_Item_Desc]=src.[SKU_Item_Desc]
    ,tar.[SKU_Group]=src.[SKU_Group]
    ,tar.[SKU_Family]=src.[SKU_Family]
    ,tar.[SKU_Activity]=src.[SKU_Activity]
    ,tar.[Mat_UoM]=src.[Mat_UoM]
    ,tar.[Mat_Unit_Rate]=src.[Mat_Unit_Rate]
    ,tar.[Mat_Quantity_Actual]=src.[Mat_Quantity_Actual]
    ,tar.[Labour_Hour_Standard]=src.[Labour_Hour_Standard]
    ,tar.[Labour_Headcount]=src.[Labour_Headcount]
    ,tar.[Labour_Rate]=src.[Labour_Rate]
    ,tar.[Labour_Cost]=src.[Labour_Cost]
    ,tar.[Equipment_Hour]=src.[Equipment_Hour]
    ,tar.[Equipment_Rate]=src.[Equipment_Rate]
    ,tar.[Equipment_Cost]=src.[Equipment_Cost]
    ,tar.[Overhead_Hour]=src.[Overhead_Hour]
    ,tar.[Overhead_Rate]=src.[Overhead_Rate]
    ,tar.[Overhead_Cost]=src.[Overhead_Cost]
    ,tar.[Mobalization_Total_Hour]=src.[Mobalization_Total_Hour]
    ,tar.[Mobalization_Line_Weight]=src.[Mobalization_Line_Weight]
    ,tar.[Mob_Weighted_Labour_Hour]=src.[Mob_Weighted_Labour_Hour]
    ,tar.[Mob_Weighted_Labour_Rate]=src.[Mob_Weighted_Labour_Rate]
    ,tar.[Mob_Weighted_Labour_Cost]=src.[Mob_Weighted_Labour_Cost]
    ,tar.[Mob_Weighted_Travel_Hour]=src.[Mob_Weighted_Travel_Hour]
    ,tar.[Mob_Weighted_Travel_Rate]=src.[Mob_Weighted_Travel_Rate]
    ,tar.[Mob_Weighted_Travel_Cost]=src.[Mob_Weighted_Travel_Cost]
    ,tar.[SKU_Alias_Item_ID]=src.[SKU_Alias_Item_ID]
    ,tar.[SKU_Alias_Item_Desc]=src.[SKU_Alias_Item_Desc]
    ,tar.[Total_Line_Cost]=src.[Total_Line_Cost]
    ,tar.[CreatedBy]=src.[CreatedBy]
    ,tar.[CreatedDate]=src.[CreatedDate]
    ,tar.[ModifiedBy]=src.[ModifiedBy]
    ,tar.[ModifiedDate]=src.[ModifiedDate]
    
  WHEN NOT MATCHED THEN
    INSERT ([Project_Price_Line_ID]
        ,[Project_Price_Header_ID]
        ,[Project_Version_ID]
        ,[Project_ID]
        ,[Tenant_CD]
        ,[SKU_Item_ID]
        ,[SKU_Item_Desc]
        ,[SKU_Group]
        ,[SKU_Family]
        ,[SKU_Activity]
        ,[Mat_UoM]
        ,[Mat_Unit_Rate]
        ,[Mat_Quantity_Actual]
        ,[Labour_Hour_Standard]
        ,[Labour_Headcount]
        ,[Labour_Rate]
        ,[Labour_Cost]
        ,[Equipment_Hour]
        ,[Equipment_Rate]
        ,[Equipment_Cost]
        ,[Overhead_Hour]
        ,[Overhead_Rate]
        ,[Overhead_Cost]
        ,[Mobalization_Total_Hour]
        ,[Mobalization_Line_Weight]
        ,[Mob_Weighted_Labour_Hour]
        ,[Mob_Weighted_Labour_Rate]
        ,[Mob_Weighted_Labour_Cost]
        ,[Mob_Weighted_Travel_Hour]
        ,[Mob_Weighted_Travel_Rate]
        ,[Mob_Weighted_Travel_Cost]
        ,[SKU_Alias_Item_ID]
        ,[SKU_Alias_Item_Desc]
        ,[Total_Line_Cost]
        ,[CreatedBy]
        ,[CreatedDate]
        ,[ModifiedBy]
        ,[ModifiedDate]
        )
    VALUES ( src.[Project_Price_Line_ID]
        ,src.[Project_Price_Header_ID]
        ,src.[Project_Version_ID]
        ,src.[Project_ID]
        ,src.[Tenant_CD]
        ,src.[SKU_Item_ID]
        ,src.[SKU_Item_Desc]
        ,src.[SKU_Group]
        ,src.[SKU_Family]
        ,src.[SKU_Activity]
        ,src.[Mat_UoM]
        ,src.[Mat_Unit_Rate]
        ,src.[Mat_Quantity_Actual]
        ,src.[Labour_Hour_Standard]
        ,src.[Labour_Headcount]
        ,src.[Labour_Rate]
        ,src.[Labour_Cost]
        ,src.[Equipment_Hour]
        ,src.[Equipment_Rate]
        ,src.[Equipment_Cost]
        ,src.[Overhead_Hour]
        ,src.[Overhead_Rate]
        ,src.[Overhead_Cost]
        ,src.[Mobalization_Total_Hour]
        ,src.[Mobalization_Line_Weight]
        ,src.[Mob_Weighted_Labour_Hour]
        ,src.[Mob_Weighted_Labour_Rate]
        ,src.[Mob_Weighted_Labour_Cost]
        ,src.[Mob_Weighted_Travel_Hour]
        ,src.[Mob_Weighted_Travel_Rate]
        ,src.[Mob_Weighted_Travel_Cost]
        ,src.[SKU_Alias_Item_ID]
        ,src.[SKU_Alias_Item_Desc]
        ,src.[Total_Line_Cost]
        ,src.[CreatedBy]
        ,src.[CreatedDate]
        ,src.[ModifiedBy]
        ,src.[ModifiedDate]
        
       );
  `;
  
  try {
    await sql.connect(config);
    //const result = await sql.query(sqlQuery);
    await sql.query(sqlQuery);
    console.log('Schedule data merged successfully!');
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = merge_projectPriceLineItem;
