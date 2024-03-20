//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';

// [
//   {
//       "Header_ID": 1,
//       "SKU_Group": "Epoxy",
//       "Mat_Quantity_Actual": 226500,
//       "Labour_Hour_Standard": 494.6185570568237,
//       "Labour_Headcount": 10,
//       "Labour_Hours": 4946.185570568237,
//       "Project_Version": "2405401"
//   },
//   {
//       "Header_ID": 1,
//       "SKU_Group": "Paint ",
//       "Mat_Quantity_Actual": 500000,
//       "Labour_Hour_Standard": 21.27659574468085,
//       "Labour_Headcount": 2,
//       "Labour_Hours": 48,
//       "Labour_Hours_Override": 24,
//       "Mob_Override": 4,
//       "Project_Version": "2405401"
//   },
//   {
//       "Header_ID": 2,
//       "SKU_Group": "Epoxy",
//       "Mat_Quantity_Actual": 50000,
//       "Labour_Hour_Standard": 2.7777777777777777,
//       "Labour_Headcount": 5,
//       "Labour_Hours": 13.88888888888889,
//       "Mob_Override": "",
//       "Project_Version": "2405401"
//       "Distance_Hour": 0.5
//   }
// ]

async function merge_projectCostMobalization(data) {
  if (!Array.isArray(data)) {
    //console.log("cm data",data);
    throw new Error('Data is not an array');
  }
const values = data.map((row) => {
      const projectID = parseInt(row.Project_Version_ID.substring(0, 7));
      const projectVersionID = parseInt(row.Project_Version_ID);
      const projectCostHeader = parseInt(row.Project_Version_ID)*100 + parseInt(row.Header_ID);
      
      const workhourpershift = 12-(row.Drive_Distance*2)
      //const workhourpershift = 12-(1*2)
      const mobCount = parseFloat(row.Crew_Hour_Standard)/workhourpershift;
      var labourHoursOverride = parseFloat(row.Labour_Hours_Override);
      //*parseInt(row.Labour_Headcount)
      labourHoursOverride = isNaN(labourHoursOverride) ? null : labourHoursOverride;
      const travelhourpermob=  row.Drive_Distance*2;
      //const travelhourpermob = 1*2;
      const travelLabourPerMob = travelhourpermob*row.Labour_Headcount;

      return `(${projectCostHeader}, 
        '${row.SKU_Group}', 
        ${projectVersionID}, 
        ${row.Header_ID},
        ${projectID}, 
        'smc', 
        ${row.Crew_Hour_Standard}, 
        ${labourHoursOverride}, 
        ${mobCount},  
        ${row.Mob_Override}, 
        ${travelhourpermob}, 
        ${travelLabourPerMob}, 
        'enduser', 
        getdate(), 
        'enduser', 
        getdate()
        )`
}).join(',');
  
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_cpqt].[Project_Cost_Mobalization] AS tar 
  USING (VALUES ${values}) AS src (
    [Project_Cost_Header_ID]
      ,[SKU_Group]
      ,[Project_Version_ID]
      ,[Header_ID]
      ,[Project_ID]
      ,[Tenant_CD]
      ,[Total_Standard_Hour]
      ,[Total_Override_Hour]
      ,[MOB_Count]
      ,[MOB_Count_Override]
      ,[Travel_Hour_Per_MOB]
      ,[Travel_Labour_Per_MOB]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModifiedBy]
      ,[ModifiedDate])
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
        AND tar.[Project_Cost_Header_ID] = src.[Project_Cost_Header_ID] 
        AND tar.[SKU_Group] = src.[SKU_Group] 
        )
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_Cost_Header_ID]=src.[Project_Cost_Header_ID]
    ,tar.[SKU_Group]=src.[SKU_Group]
    ,tar.[Project_Version_ID]=src.[Project_Version_ID]
    ,tar.[Header_ID]=src.[Header_ID]
    ,tar.[Project_ID]=src.[Project_ID]
    ,tar.[Tenant_CD]=src.[Tenant_CD]
    ,tar.[Total_Standard_Hour]=src.[Total_Standard_Hour]
    ,tar.[Total_Override_Hour]=src.[Total_Override_Hour]
    ,tar.[MOB_Count]=src.[MOB_Count]
    ,tar.[MOB_Count_Override]=src.[MOB_Count_Override]
    ,tar.[Travel_Hour_Per_MOB]=src.[Travel_Hour_Per_MOB]
    ,tar.[Travel_Labour_Per_MOB]=src.[Travel_Labour_Per_MOB]
    ,tar.[CreatedBy]=src.[CreatedBy]
    ,tar.[CreatedDate]=src.[CreatedDate]
    ,tar.[ModifiedBy]=src.[ModifiedBy]
    ,tar.[ModifiedDate]=src.[ModifiedDate]  
  WHEN NOT MATCHED THEN
    INSERT ( [Project_Cost_Header_ID]
        ,[SKU_Group]
        ,[Project_Version_ID]
        ,[Header_ID]
        ,[Project_ID]
        ,[Tenant_CD]
        ,[Total_Standard_Hour]
        ,[Total_Override_Hour]
        ,[MOB_Count]
        ,[MOB_Count_Override]
        ,[Travel_Hour_Per_MOB]
        ,[Travel_Labour_Per_MOB]
        ,[CreatedBy]
        ,[CreatedDate]
        ,[ModifiedBy]
        ,[ModifiedDate]
        )
    VALUES ( src.[Project_Cost_Header_ID]
        ,src.[SKU_Group]
        ,src.[Project_Version_ID]
        ,src.[Header_ID]
        ,src.[Project_ID]
        ,src.[Tenant_CD]
        ,src.[Total_Standard_Hour]
        ,src.[Total_Override_Hour]
        ,src.[MOB_Count]
        ,src.[MOB_Count_Override]
        ,src.[Travel_Hour_Per_MOB]
        ,src.[Travel_Labour_Per_MOB]
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
    console.log(sqlQuery);
  }
}

module.exports = merge_projectCostMobalization;
