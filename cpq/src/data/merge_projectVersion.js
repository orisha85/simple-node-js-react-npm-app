//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

async function merge_projectVersion(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }
const values = data.map((row) => `('${row.Project_Version_ID}', 
                                 '${row.Project_ID}', 
                                 '${row.Tenant_CD}', 
                                 '${row.Is_Current}', 
                                 '${row.Project_Lifecycle_CD}', 
                                 '${row.State_CD}',  
                                 '${row.Region_CD}', 
                                 '${row.TownCounty_Desc}',
                                 '${row.Quote_Type}', 
                                 '${row.Project_Type}',  
                                 '${row.Service_Hub}', 
                                 '${row.Project_Start}',                             
                                 '${row.Duration}', 
                                 '${row.Project_Number}',                               
                                 '${row.CreatedDate}', 
                                 '${row.ModifiedBy}', 
                                 '${row.ModifiedDate}'
                                 )`).join(',');
  
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_cpqt].[Project_Version] AS tar 
  USING (VALUES ${values}) AS src (
    [Project_Version_ID]
    ,[Project_ID]
    ,[Version_ID]
    ,[Tenant_CD]
    ,[Is_Current]
    ,[Project_Name]
    ,[Project_Lifecycle_CD]
    ,[State_CD]
    ,[Region_CD]
    ,[TownCounty_Desc]
    ,[Quote_Type]
    ,[Project_Type]
    ,[Service_Hub]
    ,[Project_Start]
    ,[Duration]
    ,[Project_Number]
    ,[CreatedBy]
    ,[CreatedDate]
    ,[ModifiedBy]
    ,[ModifiedDate] ) 
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
      AND tar.[Project_Version_ID] = src.[Project_Version_ID] )
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_Version_ID]= src.[Project_Version_ID]
    ,tar.[Project_ID]= src.[Project_ID]
    ,tar.[Version_ID]= src.[Version_ID]
    ,tar.[Tenant_CD]= src.[Tenant_CD]
    ,tar.[Is_Current]= src.[Is_Current]
    ,tar.[Project_Name]= src.[Project_Name]
    ,tar.[Project_Lifecycle_CD]= src.[Project_Lifecycle_CD]
    ,tar.[State_CD]= src.[State_CD]
    ,tar.[Region_CD]= src.[Region_CD]
    ,tar.[TownCounty_Desc]= src.[TownCounty_Desc]
    ,tar.[Quote_Type]= src.[Quote_Type]
    ,tar.[Project_Type]= src.[Project_Type]
    ,tar.[Service_Hub]= src.[Service_Hub]
    ,tar.[Project_Start]= src.[Project_Start]
    ,tar.[Duration]= src.[Duration]
    ,tar.[Project_Number]= src.[Project_Number]
    ,tar.[CreatedBy]= src.[CreatedBy]
    ,tar.[CreatedDate]= src.[CreatedDate]
    ,tar.[ModifiedBy]= src.[ModifiedBy]
    ,tar.[ModifiedDate]= src.[ModifiedDate]    
  WHEN NOT MATCHED THEN
    INSERT ([Project_Version_ID]
        ,[Project_ID]
        ,[Version_ID]
        ,[Tenant_CD]
        ,[Is_Current]
        ,[Project_Name]
        ,[Project_Lifecycle_CD]
        ,[State_CD]
        ,[Region_CD]
        ,[TownCounty_Desc]
        ,[Quote_Type]
        ,[Project_Type]
        ,[Service_Hub]
        ,[Project_Start]
        ,[Duration]
        ,[Project_Number]
        ,[CreatedBy]
        ,[CreatedDate]
        ,[ModifiedBy]
        ,[ModifiedDate]
        )
    VALUES (src.[Project_Version_ID]
        ,src.[Project_ID]
        ,src.[Version_ID]
        ,src.[Tenant_CD]
        ,src.[Is_Current]
        ,src.[Project_Name]
        ,src.[Project_Lifecycle_CD]
        ,src.[State_CD]
        ,src.[Region_CD]
        ,src.[TownCounty_Desc]
        ,src.[Quote_Type]
        ,src.[Project_Type]
        ,src.[Service_Hub]
        ,src.[Project_Start]
        ,src.[Duration]
        ,src.[Project_Number]
        ,src.[CreatedBy]
        ,src.[CreatedDate]
        ,src.[ModifiedBy]
        ,src.[ModifiedDate]        
       );
  `;
  
  try {
    //await sql.connect(config);
    //const result = await sql.query(sqlQuery);
    await executeQuery(sqlQuery);
    console.log('Schedule data merged successfully!');
  } catch (err) {
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = merge_projectVersion;
