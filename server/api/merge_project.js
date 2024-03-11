//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

async function merge_project(data) {
  data = [data]
  console.log("new project data",data)
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }
//   {
//     "state": "NY",
//     "state_desc": "NY",
//     "region": "R3",
//     "region_desc": "R3",
//     "townCounty": "BRN",
//     "townCounty_desc": "Brooklyn",
//     "bidType": "BOOK",
//     "bidType_desc": "Book",
//     "projectType": "SG",
//     "projectType_desc": "Signal",
//     "serviceHub": "Bridgeport",
//     "serviceHub_desc": "Bridgeport"
// }

const values = data.map((row) => `(COALESCE((SELECT max([Project_ID])+1 FROM [app_main].[Project] WHERE [Project_ID]> cast((DATEPART(year, getdate())-2000) as bigint)*100000 + DATEPART(dayofyear, getdate())*100), cast((DATEPART(year, getdate())-2000) as bigint)*100000 + DATEPART(dayofyear, getdate())*100 +1) , 
                                 'smc', 
                                  NULL,
                                 (SELECT COALESCE((SELECT max([Project_ID])+1 FROM [app_main].[Project] WHERE [Project_ID]> cast((DATEPART(year, getdate())-2000) as bigint)*100000 + DATEPART(dayofyear, getdate())*100), cast((DATEPART(year, getdate())-2000) as bigint)*100000 + DATEPART(dayofyear, getdate())*100 +1)*10)+1,
                                 '${row.projectName}', 
                                 'CR', 
                                 NULL,
                                 '${row.state_desc}',  
                                 '${row.region}', 
                                 '${row.townCounty_desc}',
                                 '${row.bidType}', 
                                 '${row.projectType_desc}',  
                                 '${row.serviceHub_desc}', 
                                 null,                             
                                 null, 
                                 'A' ,                              
                                 'enduser', 
                                 getdate(),
                                 'enduser', 
                                 getdate()
                                 )`).join(',');

const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_main].[Project] AS tar 
  USING (VALUES ${values}) AS src (
    [Project_ID]
      ,[Tenant_CD]
      ,[Source_Project_CD]
      ,[Current_Project_Version_ID]
      ,[Project_Name]
      ,[Project_Lifecycle_CD]
      ,[Project_Value]
      ,[State_CD]
      ,[Region_CD]
      ,[TownCounty_Desc]
      ,[Quote_Type]
      ,[Project_Type]
      ,[Service_Hub]
      ,[Project_Start]
      ,[Duration]
      ,[Status]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModifiedBy]
      ,[ModifiedDate] ) 
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
      AND tar.[Project_ID] = src.[Project_ID] )
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_ID]=src.[Project_ID]
    ,tar.[Tenant_CD]=src.[Tenant_CD]
    ,tar.[Source_Project_CD]=src.[Source_Project_CD]
    ,tar.[Current_Project_Version_ID]=src.[Current_Project_Version_ID]
    ,tar.[Project_Name]=src.[Project_Name]
    ,tar.[Project_Lifecycle_CD]=src.[Project_Lifecycle_CD]
    ,tar.[Project_Value]=src.[Project_Value]
    ,tar.[State_CD]=src.[State_CD]
    ,tar.[Region_CD]=src.[Region_CD]
    ,tar.[TownCounty_Desc]=src.[TownCounty_Desc]
    ,tar.[Quote_Type]=src.[Quote_Type]
    ,tar.[Project_Type]=src.[Project_Type]
    ,tar.[Service_Hub]=src.[Service_Hub]
    ,tar.[Project_Start]=src.[Project_Start]
    ,tar.[Duration]=src.[Duration]
    ,tar.[Status]=src.[Status]
    ,tar.[CreatedBy]=src.[CreatedBy]
    ,tar.[CreatedDate]=src.[CreatedDate]
    ,tar.[ModifiedBy]=src.[ModifiedBy]
    ,tar.[ModifiedDate]=src.[ModifiedDate]
  WHEN NOT MATCHED THEN
    INSERT ([Project_ID]
        ,[Tenant_CD]
        ,[Source_Project_CD]
        ,[Current_Project_Version_ID]
        ,[Project_Name]
        ,[Project_Lifecycle_CD]
        ,[Project_Value]
        ,[State_CD]
        ,[Region_CD]
        ,[TownCounty_Desc]
        ,[Quote_Type]
        ,[Project_Type]
        ,[Service_Hub]
        ,[Project_Start]
        ,[Duration]
        ,[Status]
        ,[CreatedBy]
        ,[CreatedDate]
        ,[ModifiedBy]
        ,[ModifiedDate]
        )
    VALUES (src.[Project_ID]
        ,src.[Tenant_CD]
        ,src.[Source_Project_CD]
        ,src.[Current_Project_Version_ID]
        ,src.[Project_Name]
        ,src.[Project_Lifecycle_CD]
        ,src.[Project_Value]
        ,src.[State_CD]
        ,src.[Region_CD]
        ,src.[TownCounty_Desc]
        ,src.[Quote_Type]
        ,src.[Project_Type]
        ,src.[Service_Hub]
        ,src.[Project_Start]
        ,src.[Duration]
        ,src.[Status]
        ,src.[CreatedBy]
        ,src.[CreatedDate]
        ,src.[ModifiedBy]
        ,src.[ModifiedDate]
       );
  `;
  
  try {
    //await sql.connect(config);
    //const result = await sql.query(sqlQuery);
    //await sql.query(sqlQuery);
    await executeQuery(sqlQuery);
    console.log('New project created successfully!');
  } catch (err) {
    console.log("Project not created:",sqlQuery);
    console.error(err);
    //console.log(sqlQuery);
  }
}

module.exports = merge_project;
