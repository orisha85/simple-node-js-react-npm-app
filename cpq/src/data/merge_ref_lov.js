//const { sql, express, bodyParser } = require('./dependencies');
//const sql = require('mssql');
//const express = require('mssql');
//const app = express();
const executeQuery = require('./executeQuery');
//const { pool } = require('./config');
//import { locationInput } from '../inputs.js';


async function merge_ref_lov(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }
const values = data.map((row) => `('${row.ReferenceValueItem_CD}', 
                                 '${row.ReferenceValueCategory_CD}', 
                                 '${row.Tenant_CD}', 
                                 '${row.Item_CD}', 
                                 '${row.Item_Desc}', 
                                 '${row.Item_Value}', 
                                 '${row.Category_CD}',  
                                 '${row.Category_Desc}', 
                                 '${row.SortOrder}', 
                                 '${row.IsActive}', 
                                 '${row.IsParent}', 
                                 '${row.ParentReferenceValueItem_CD}',
                                 '${row.IsLabourFactor}', 
                                 '${row.LabourFactor_CD}', 
                                 '${row.Locale}', 
                                 '${row.CreatedBy}',
                                 '${row.CreatedDate}', 
                                 '${row.ModifiedBy}', 
                                 '${row.ModifiedDate}'
                                 )`).join(',');
  
const sqlQuery = `
  MERGE INTO [SMC_APP_DEV].[ref_data].[ReferenceValueItem] AS tar 
  USING (VALUES ${values}) AS src (
     [ReferenceValueItem_CD]
    ,[ReferenceValueCategory_CD]
    ,[Tenant_CD]
    ,[Item_CD]
    ,[Item_Desc]
    ,[Item_Value]
    ,[Category_CD]
    ,[Category_Desc]
    ,[SortOrder]
    ,[IsActive]
    ,[IsParent]
    ,[ParentReferenceValueItem_CD]
    ,[IsLabourFactor]
    ,[LabourFactor_CD]
    ,[LabourFactor_Type]
    ,[Locale]
    ,[CreatedBy]
    ,[CreatedDate]
    ,[ModifiedBy]
    ,[ModifiedDate] ) 
    ON (tar.[Tenant_CD] = src.[Tenant_CD]
      AND tar.[Project_Version_ID] = src.[Project_Version_ID]
      AND tar.[Project_Cost_Header_ID]= src.[Project_Cost_Header_ID])
      WHEN MATCHED THEN
    UPDATE SET tar.[ReferenceValueItem_CD]=src.[ReferenceValueItem_CD]
    ,tar.[ReferenceValueCategory_CD]=src.[ReferenceValueCategory_CD]
    ,tar.[Tenant_CD]=src.[Tenant_CD]
    ,tar.[Item_CD]=src.[Item_CD]
    ,tar.[Item_Desc]=src.[Item_Desc]
    ,tar.[Item_Value]=src.[Item_Value]
    ,tar.[Category_CD]=src.[Category_CD]
    ,tar.[Category_Desc]=src.[Category_Desc]
    ,tar.[SortOrder]=src.[SortOrder]
    ,tar.[IsActive]=src.[IsActive]
    ,tar.[IsParent]=src.[IsParent]
    ,tar.[ParentReferenceValueItem_CD]=src.[ParentReferenceValueItem_CD]
    ,tar.[IsLabourFactor]=src.[IsLabourFactor]
    ,tar.[LabourFactor_CD]=src.[LabourFactor_CD]
    ,tar.[LabourFactor_Type]=src.[LabourFactor_Type]
    ,tar.[Locale]=src.[Locale]
    ,tar.[CreatedBy]=src.[CreatedBy]
    ,tar.[CreatedDate]=src.[CreatedDate]
    ,tar.[ModifiedBy]=src.[ModifiedBy]
    ,tar.[ModifiedDate]=src.[ModifiedDate]    
  WHEN NOT MATCHED THEN
    INSERT ([ReferenceValueItem_CD]
        ,[ReferenceValueCategory_CD]
        ,[Tenant_CD]
        ,[Item_CD]
        ,[Item_Desc]
        ,[Item_Value]
        ,[Category_CD]
        ,[Category_Desc]
        ,[SortOrder]
        ,[IsActive]
        ,[IsParent]
        ,[ParentReferenceValueItem_CD]
        ,[IsLabourFactor]
        ,[LabourFactor_CD]
        ,[LabourFactor_Type]
        ,[Locale]
        ,[CreatedBy]
        ,[CreatedDate]
        ,[ModifiedBy]
        ,[ModifiedDate]
        )
    VALUES ( src.[ReferenceValueItem_CD]
        ,src.[ReferenceValueCategory_CD]
        ,src.[Tenant_CD]
        ,src.[Item_CD]
        ,src.[Item_Desc]
        ,src.[Item_Value]
        ,src.[Category_CD]
        ,src.[Category_Desc]
        ,src.[SortOrder]
        ,src.[IsActive]
        ,src.[IsParent]
        ,src.[ParentReferenceValueItem_CD]
        ,src.[IsLabourFactor]
        ,src.[LabourFactor_CD]
        ,src.[LabourFactor_Type]
        ,src.[Locale]
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

module.exports = merge_ref_lov;
