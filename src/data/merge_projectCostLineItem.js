//const { sql, express, bodyParser } = require('./dependencies');
const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const config = require('./config');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';


async function merge_projectCostHeader(data) {
  if (!Array.isArray(data)) {
    console.log("cli data",data);
    throw new Error('Data is not an array');
  }


//   [
//     {
//         "Project_Cost_Line_Item_ID": "2405401101001",
//         "Project_Cost_Header_ID": "2405401101",
//         "Project_Version_ID": "24054011",
//         "Project_ID": "2405401",
//         "Tenant_CD": "smc",
//         "Header_ID": 1,
//         "Line_ID": 0,
//         "SKU_Item_ID": "1210105E",
//         "SKU_Item_Desc": "",
//         "SKU_Group": "Epoxy",
//         "SKU_Family": "Epoxy Handwork",
//         "SKU_Activity": "Secondary Urban",
//         "Mat_UoM": "LF",
//         "Mat_Unit_Rate": 0.439999997615814,
//         "Mat_Quantity_Actual": 700,
//         "Application_Rate": 411,
//         "Crew_Hour_Standard": 2.83860502838605,
//         "Labour_Hour_Standard": 14.193025141930251,
//         "Labour_Headcount": 5,
//         "Labour_Rate": 89.5,
//         "Labour_Cost": 1270.2757502027573,
//         "Equipment_Hour": 14.19302514193025,
//         "Equipment_Rate": 49.5,
//         "Equipment_Cost": 702.5547445255473,
//         "Overhead_Hour": 14.19302514193025,
//         "Overhead_Rate": 101.03,
//         "Overhead_Cost": 1433.9213300892131,
//         "Mat_EA_Scale": 1,
//         "Mat_Cost": 307.9999983310698,
//         "CreatedBy": "chrisrass",
//         "CreatedDate": "2024-02-23T11:39:10.693Z",
//         "ModifiedBy": null,
//         "ModifiedDate": null,
//         "Project_Version": "2405401"
//     },
//     {
//         "Project_Cost_Line_Item_ID": "2405401101002",
//         "Project_Cost_Header_ID": "2405401101",
//         "Project_Version_ID": "24054011",
//         "Project_ID": "2405401",
//         "Tenant_CD": "smc",
//         "Header_ID": 1,
//         "Line_ID": 1,
//         "SKU_Item_ID": "1210105E",
//         "SKU_Item_Desc": "",
//         "SKU_Group": "Epoxy",
//         "SKU_Family": "Epoxy Longline",
//         "SKU_Activity": "Secondary Urban",
//         "Mat_UoM": "LF",
//         "Mat_Unit_Rate": 0.146999999880791,
//         "Mat_Quantity_Actual": 225800,
//         "Application_Rate": 11750,
//         "Crew_Hour_Standard": 96.0851063829787,
//         "Labour_Hour_Standard": 480.42553191489344,
//         "Labour_Headcount": 5,
//         "Labour_Rate": 89.5,
//         "Labour_Cost": 42998.08510638297,
//         "Equipment_Hour": 480.4255319148935,
//         "Equipment_Rate": 49.5,
//         "Equipment_Cost": 23781.06382978723,
//         "Overhead_Hour": 14.19302514193025,
//         "Overhead_Rate": 101.03,
//         "Overhead_Cost": 48537.39148936169,
//         "Mat_EA_Scale": 1,
//         "Mat_Cost": 33192.59997308261,
//         "CreatedBy": "chrisrass",
//         "CreatedDate": "2024-02-23T11:41:09.103Z",
//         "ModifiedBy": null,
//         "ModifiedDate": null,
//         "Project_Version": "2405401"
//     },
//     {
//         "Header_ID": 1,
//         "SKU_Item_ID": "PAINT6W",
//         "SKU_Item_Desc": "6\" Wht. Paint",
//         "SKU_Group": "Paint ",
//         "SKU_Family": "Paint Longline",
//         "SKU_Activity": "Highway",
//         "Mat_UoM": null,
//         "Mat_Unit_Rate": 0.05000000074505806,
//         "Mat_Quantity_Actual": 500000,
//         "Labour_Hour_Standard": 21.27659574468085,
//         "Mat_Cost": 25000.00037252903,
//         "Labour_Headcount": 2,
//         "Application_Rate": 23500,
//         "Line_ID": 2,
//         "Project_Version": "2405401"
//     },
//     {
//         "Header_ID": 2,
//         "SKU_Item_ID": "1210105E",
//         "SKU_Item_Desc": "Epoxy Resin Mkg Sym & Legends",
//         "SKU_Group": "Epoxy",
//         "SKU_Family": "Epoxy Longline",
//         "SKU_Activity": "Highway",
//         "Mat_UoM": "SF",
//         "Mat_Unit_Rate": 0.4399999976158142,
//         "Mat_Quantity_Actual": 50000,
//         "Labour_Hour_Standard": 2.7777777777777777,
//         "Mat_Cost": 21999.99988079071,
//         "Labour_Headcount": 5,
//         "Application_Rate": 18000,
//         "Line_ID": 3,
//         "Project_Version": "2405401"
//     }
// ]


  const values = data.map((row) => {
    //console.log("row:", row)
    if (!row.Project_Cost_Line_Item_ID) {
      // Calculating Project_Cost_Line_Item_ID using Header_ID * 100 + Line_ID * 1
      const projectCostLineItemID = parseInt(row.Project_Version_ID)*100000 + parseInt(row.Header_ID)*1000 + parseInt(row.Line_ID)
      // Converting it to string
      row.Project_Cost_Line_Item_ID = projectCostLineItemID;
    };
    if (!row.Project_Cost_Header_ID) {
      // Calculating Project_Cost_Line_Item_ID using Header_ID * 100 + Line_ID * 1
      const projectCostHeaderID = row.Project_Version_ID*100 + row.Header_ID*1 
      // Converting it to string
      row.Project_Cost_Header_ID = projectCostHeaderID;
    };
    const projectID = parseInt(row.Project_Version_ID.substring(0, 7));
    const Labour_Rate = 89.5;
    const Equipment_Rate = 49.5;
    const Overhead_Rate = 101.03;
    const matCost = parseInt(row.Mat_Quantity_Actual)*parseFloat(row.Mat_Unit_Rate);
    const LabourHourCalc = parseFloat(row.Crew_Hour_Standard)*parseInt(row.Labour_Headcount);
    const LabourCost = LabourHourCalc*Labour_Rate;
    const EquipmentCost = LabourHourCalc*Equipment_Rate;
    const OverheadCost = LabourHourCalc*Overhead_Rate;

    return `(${row.Project_Cost_Line_Item_ID}, 
        ${row.Project_Cost_Header_ID}, 
        ${row.Project_Version_ID}, 
        ${projectID}, 
        'smc', 
        ${row.Header_ID}, 
        ${row.Line_ID},                                 
        '${row.SKU_Item_ID}', 
        '${row.SKU_Item_Desc}', 
        '${row.SKU_Group}', 
        '${row.SKU_Family}',  
        '${row.SKU_Activity}', 
        '${row.Mat_UoM}', 
        ${row.Mat_Unit_Rate}, 
        ${row.Mat_Quantity_Actual}, 
        1,  
        ${matCost}, 
        ${row.Application_Rate}, 
        ${row.Crew_Hour_Standard}, 
        ${LabourHourCalc}, 
        ${row.Labour_Headcount}, 
        ${Labour_Rate}, 
        ${LabourCost}, 
        ${LabourHourCalc}, 
        ${Equipment_Rate}, 
        ${EquipmentCost}, 
        ${LabourHourCalc},  
        ${Overhead_Rate},  
        ${OverheadCost}, 
        'enduser', 
        getdate(), 
        'enduser', 
        getdate()
        )`
      }).join(','); 
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[app_cpqt].[Project_Cost_Line_Item] AS tar 
  USING (VALUES ${values}) AS src (
    [Project_Cost_Line_Item_ID]
    ,[Project_Cost_Header_ID]
    ,[Project_Version_ID]
    ,[Project_ID]
    ,[Tenant_CD]
    ,[Header_ID]
    ,[Line_ID]
    ,[SKU_Item_ID]
    ,[SKU_Item_Desc]
    ,[SKU_Group]
    ,[SKU_Family]
    ,[SKU_Activity]
    ,[Mat_UoM]
    ,[Mat_Unit_Rate]
    ,[Mat_Quantity_Actual]
    ,[Mat_EA_Scale]
    ,[Mat_Cost]
    ,[Application_Rate]
    ,[Crew_Hour_Standard]
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
    ,[CreatedBy]
    ,[CreatedDate]
    ,[ModifiedBy]
    ,[ModifiedDate] )
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
      AND tar.[Project_Version_ID] = src.[Project_Version_ID]
      AND tar.[Project_Cost_Line_Item_ID] = src.[Project_Cost_Line_Item_ID] )
      WHEN MATCHED THEN
    UPDATE SET tar.[Project_Cost_Line_Item_ID]=src.[Project_Cost_Line_Item_ID]
    ,tar.[Project_Cost_Header_ID]=src.[Project_Cost_Header_ID]
    ,tar.[Project_Version_ID]=src.[Project_Version_ID]
    ,tar.[Project_ID]=src.[Project_ID]
    ,tar.[Tenant_CD]=src.[Tenant_CD]
    ,tar.[Header_ID]=src.[Header_ID]
    ,tar.[Line_ID]=src.[Line_ID]
    ,tar.[SKU_Item_ID]=src.[SKU_Item_ID]
    ,tar.[SKU_Item_Desc]=src.[SKU_Item_Desc]
    ,tar.[SKU_Group]=src.[SKU_Group]
    ,tar.[SKU_Family]=src.[SKU_Family]
    ,tar.[SKU_Activity]=src.[SKU_Activity]
    ,tar.[Mat_UoM]=src.[Mat_UoM]
    ,tar.[Mat_Unit_Rate]=src.[Mat_Unit_Rate]
    ,tar.[Mat_Quantity_Actual]=src.[Mat_Quantity_Actual]
    ,tar.[Mat_EA_Scale]=src.[Mat_EA_Scale]
    ,tar.[Mat_Cost]=src.[Mat_Cost]
    ,tar.[Application_Rate]=src.[Application_Rate]
    ,tar.[Crew_Hour_Standard]=src.[Crew_Hour_Standard]
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
    ,tar.[CreatedBy]=src.[CreatedBy]
    ,tar.[CreatedDate]=src.[CreatedDate]
    ,tar.[ModifiedBy]=src.[ModifiedBy]
    ,tar.[ModifiedDate]=src.[ModifiedDate]
    
  WHEN NOT MATCHED THEN
    INSERT ([Project_Cost_Line_Item_ID]
      ,[Project_Cost_Header_ID]
      ,[Project_Version_ID]
      ,[Project_ID]
      ,[Tenant_CD]
      ,[Header_ID]
      ,[Line_ID]
      ,[SKU_Item_ID]
      ,[SKU_Item_Desc]
      ,[SKU_Group]
      ,[SKU_Family]
      ,[SKU_Activity]
      ,[Mat_UoM]
      ,[Mat_Unit_Rate]
      ,[Mat_Quantity_Actual]
      ,[Mat_EA_Scale]
      ,[Mat_Cost]
      ,[Application_Rate]
      ,[Crew_Hour_Standard]
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
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModifiedBy]
      ,[ModifiedDate]
        )
    VALUES (src.[Project_Cost_Line_Item_ID]
      ,src.[Project_Cost_Header_ID]
      ,src.[Project_Version_ID]
      ,src.[Project_ID]
      ,src.[Tenant_CD]
      ,src.[Header_ID]
      ,src.[Line_ID]
      ,src.[SKU_Item_ID]
      ,src.[SKU_Item_Desc]
      ,src.[SKU_Group]
      ,src.[SKU_Family]
      ,src.[SKU_Activity]
      ,src.[Mat_UoM]
      ,src.[Mat_Unit_Rate]
      ,src.[Mat_Quantity_Actual]
      ,src.[Mat_EA_Scale]
      ,src.[Mat_Cost]
      ,src.[Application_Rate]
      ,src.[Crew_Hour_Standard]
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
    console.log(sqlQuery);
  }
}

module.exports = merge_projectCostHeader;
