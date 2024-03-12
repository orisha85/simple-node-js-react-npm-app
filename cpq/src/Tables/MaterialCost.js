import React, { useState, useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
//import Table from "./CrudTable";
import "./BidTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Input, Page } from "@mobiscroll/react"; // Import the Table component
import { Button } from 'react-bootstrap';
import { RiArrowGoBackLine, RiArrowGoForwardLine, RiMenuAddLine } from "react-icons/ri";
import * as Helper from './HelperCosting';
import './Tables.css'
import config_url from '../data/config_url';

const MaterialCostv1 = ({ selectedBid, isDisabled, setMaterialLoad, MaterialLoad}) => {

    // Enables/disables table editing
    const editableCheck = (cell) => {
        return !isDisabled; // Allow editing if isDisabled is false
    };

    //console.log("Material Cost",loading);
    //console.log("Material Cost", MaterialLoad);

    const el = useRef(null);
    let tabulator = useRef(null);
    const [projectType, setProjectType] = useState([]);
    const [projectVersion, setProjectVersion] = useState([]);
    const [costInformation, setCostInformation] = useState([]);
    const [costMobalization, setCostMobalization] = useState([]);
    const [skuItemID, setSKUItemID] = useState([]);
    const [skuGroup, setSKUGroup] = useState([]);
    const [skuFamily, setSKUFamily] = useState([]);
    const [driveDistance, setDriveDistance] = useState([]);
    const [skuItemDesc, setSKUItemDesc] = useState([]);
    const [skuUnitRate, setSKUUnitRate] = useState([]);
    const [skuActivity, setSKUActivity] = useState([]);
    const driveDistanceRef = useRef(driveDistance);
    const costMobalizationRef = useRef(driveDistance);

    const [skuActivityOptions, setSKUActivityOptions] = useState([]);
    const [skuFamilyOptions, setSKUFamilyOptions] = useState([]);
    const [skuUoM, setSKUUoM] = useState([]);
    const [skuGroupOptions, setSKUGroupOptions] = useState([]);
    const [skuGroupValues, setSKUGroupValues] = useState([]);
    const [skuItemIdOptions, setSKUItemIdOptions] = useState([]);

    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();

    const abortControllerRef = useRef(null);
    //const [MaterialLoad, setMaterialLoad] = useState(true);

    useEffect(() => {
      if (selectedBid) {
        const fetchProjectInfo = async () => {
          // abortControllerRef.current?.abort();
          // abortControllerRef.current = new AbortController();
          setIsLoading(true);
  
          try {
            const resp = await fetch(`${config_url.url}/get_project_information/smc/${selectedBid}`);
            const projectInfo = await resp.json();
            setProjectVersion(projectInfo);
          }
          catch (err) {
            if (err.name === "AbortError") {
              console.log("Aborted");
              return;
            }
            console.error(err)
            setError(err);
          }
          finally {
            setIsLoading(false);
          }
        }
        
        fetchProjectInfo();
      }
    }, [selectedBid]);

    useEffect(() => {
      if (projectVersion.length > 0) {
        setProjectType(projectVersion[0]?.Project_Type);
        const fetchDropdownData = async () => {
          const requestUrls = [
            `${config_url.url}/get_cost_line_item/smc/${projectVersion[0]?.Current_Project_Version_ID}`,
            `${config_url.url}/get_projectCostMobalization/smc/${projectVersion[0]?.Current_Project_Version_ID}`,
            `${config_url.url}/get_sku_item/smc`,
            `${config_url.url}/get_sku_group/smc`,
            `${config_url.url}/get_lov_skufamily/smc`,
            `${config_url.url}/get_lov_activity/smc`,
            `${config_url.url}/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`,
          ];
    
          //setIsLoading(true);
      
          try {
            const responses = [];
            for (const requestUrl of requestUrls) {
              const resp = await fetch(requestUrl);
              const data = await resp.json();
              responses.push(data)
            }
            const [costLine, mobLine, item, group, family, activity, driveDist] = responses;
            setCostInformation(costLine);
            setCostMobalization(mobLine);
            setSKUItemID(item);
            setSKUGroup(group);
            setSKUFamily(family);
            setSKUActivity(activity);
            setDriveDistance(driveDist);
          } catch (err) {
            console.error(err);
            setError(err);
          } finally {
            //setIsLoading(false);
          }
        };
      
        fetchDropdownData();
      }
    }, [projectVersion]); 

    // useEffect(() => {
    //     if (projectVersion.length > 0) {
    //         setProjectType(projectVersion[0]?.Project_Type);
    //         Promise.all([
    //             fetchData(`/get_cost_line_item/smc/${projectVersion[0]?.Current_Project_Version_ID}`, setCostInformation)
    //             .then(() => fetchData(`/get_projectCostMobalization/smc/${projectVersion[0]?.Current_Project_Version_ID}`, setCostMobalization))
    //             .then(() => fetchData('/get_sku_item/smc', setSKUItemID))
    //             .then(() => fetchData('/get_sku_group/smc', setSKUGroup))
    //             .then(() => fetchData('/get_lov_skufamily/smc', setSKUFamily))
    //             .then(() => fetchData('/get_lov_activity/smc', setSKUActivity))
    //             .then(() => fetchData(`/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`, setDriveDistance))
    //             .then((console.log("Dropdown updated")))
    //         ])
    //     }
    // }, [projectVersion]);

    useEffect(() => {
        driveDistanceRef.current = driveDistance[0]?.Distance_Hour;
        //console.log(driveDistanceRef.current);
    }, [driveDistance]);

    useEffect(() => {
        costMobalizationRef.current = costMobalization;
    }, [costMobalization]);

    
    const fetchSKUItemDesc = async (SKU_Item_ID, cell) => {
      if (SKU_Item_ID) {
        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();
        //setIsLoading(true);

        try {
          const resp = await fetch(`${config_url.url}/lookup_skuMaterial/smc/${SKU_Item_ID}`);
          const skuInfo = await resp.json();
          setSKUItemDesc(skuInfo);

          cell.getRow().update({
            SKU_Item_Desc: skuInfo[0]?.SKU_Item_Desc,
            Mat_UoM: skuInfo[0]?.Unit_Description_1,
            Mat_EA_Scale: skuInfo[0]?.Mat_EA_Scale,
            //SKU_Group: skuInfo[0]?.Unit_Description_1, //truck type
            Mat_Unit_Rate: skuInfo[0]?.Production_Unit_Desc,
            SKU_Group: skuInfo[0]?.SKU_Group
          });

          const estimatedQty = parseFloat(cell.getRow().getData().Mat_Quantity_Actual);
          const unitCost = parseFloat(cell.getRow().getData().Mat_Unit_Rate);
          const materialCost = estimatedQty * unitCost;
          cell.getRow().update({ Mat_Cost: materialCost });

          const truckType = skuInfo[0]?.SKU_Group
          //console.log(truckType)
          const foundLookupValue = skuGroup.find(item => item.Item_Desc === truckType)
          const labourHeadcount = foundLookupValue ? foundLookupValue.Item_Value : 0
          cell.getRow().update({ Labour_Headcount: labourHeadcount });

          //console.log("SKU Item Desc", driveDistanceRef.current);
          Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);
        }
        catch (err) {
          if (err.name === "AbortError") {
            console.log("Aborted");
            return;
          }
          console.error(err)
          setError(err);
        }
        finally {
          //setIsLoading(false);
        }
      }
    }

    // const fetchSKUItemDesc = async (SKU_Item_ID, cell) => {
    //     try {
    //         //console.log("DRIVE DIST",driveDistance)
    //         if (SKU_Item_ID) {
    //             //console.log("Inside SKU Item ID")
    //             fetch(`/lookup_skuMaterial/smc/${SKU_Item_ID}`)
    //                 .then(response => {
    //                     if (!response.ok) {
    //                         throw new Error('Failed to fetch SKU item description');
    //                     }
    //                     return response.json();
    //                 })
    //                 .then(jsonData => {
    //                     if (jsonData && jsonData.length > 0) {
    //                         setSKUItemDesc(jsonData);
    //                         //console.log("SKU Item Desc", jsonData);
    //                         // Update the table cell with the SKU item description
    //                         cell.getRow().update(
    //                             {
    //                                 SKU_Item_Desc: jsonData[0]?.SKU_Item_Desc,
    //                                 Mat_UoM: jsonData[0]?.Unit_Description_1,
    //                                 Mat_EA_Scale: jsonData[0]?.Mat_EA_Scale,
    //                                 //SKU_Group: jsonData[0]?.Unit_Description_1, //truck type
    //                                 Mat_Unit_Rate: jsonData[0]?.Production_Unit_Desc,
    //                                 SKU_Group: jsonData[0]?.SKU_Group
    //                             }, //unit cost
    //                         );
    //                         console.log()

    //                         const estimatedQty = parseFloat(cell.getRow().getData().Mat_Quantity_Actual);
    //                         const unitCost = parseFloat(cell.getRow().getData().Mat_Unit_Rate);
    //                         const materialCost = estimatedQty * unitCost;
    //                         cell.getRow().update({ Mat_Cost: materialCost });

    //                         const truckType = jsonData[0]?.SKU_Group
    //                         //console.log(truckType)
    //                         const foundLookupValue = skuGroup.find(item => item.Item_Desc === truckType)
    //                         const labourHeadcount = foundLookupValue ? foundLookupValue.Item_Value : 0
    //                         cell.getRow().update({ Labour_Headcount: labourHeadcount });

    //                         //console.log("SKU Item Desc", driveDistanceRef.current);
    //                         Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);

    //                     }
    //                 });
    //         }
    //     }
    //     catch (error) {
    //         console.error("Error fetching data:", error);
    //     };
    // }

    const fetchUnitPrice = async (ProjectType, Activity, SKU_Family, cell) => {
      if (ProjectType && Activity && SKU_Family) {
        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();
        //setIsLoading(true);
        try {
          console.log(ProjectType, Activity, SKU_Family);
          const resp = await fetch(`${config_url.url}/lookup_labourstandards/smc/${ProjectType}/${Activity}/${SKU_Family}`);
          const skuUnitRate = await resp.json();
          setSKUUnitRate(skuUnitRate);

          cell.getRow().update({ Application_Rate: skuUnitRate[0]?.Current_Value });
          // Update Estimated Hrs
          const actualQuantity = cell.getRow().getData().Mat_Quantity_Actual;
          const applicationRate = cell.getRow().getData().Application_Rate;
          const matEAScale = cell.getRow().getData().Mat_EA_Scale
          const matUoM = cell.getRow().getData().Mat_UoM

          if (matUoM == "EA"){
              const estimatedHrs = applicationRate !== 0 ? (actualQuantity * matEAScale) / applicationRate : 0;
              cell.getRow().update({ Crew_Hour_Standard: estimatedHrs });
          }else{
              const estimatedHrs = applicationRate !== 0 ? actualQuantity / applicationRate : 0;
              cell.getRow().update({ Crew_Hour_Standard: estimatedHrs });
          }

          Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);
        }
        catch (err) {
          if (err.name === "AbortError") {
            console.log("Aborted");
            return;
          }
          console.error(err)
          setError(err);
        }
        finally {
          setIsLoading(false);
        }
      }
    }

    // const fetchUnitPrice = async (ProjectType, Activity, SKU_Family, cell) => {
    //     try {
    //         fetch(`/lookup_labourstandards/smc/${ProjectType}/${Activity}/${SKU_Family}`)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch Application Rate');
    //                 }
    //                 return response.json();
    //             })
    //             .then(jsonData => {
    //                 if (jsonData && jsonData.length > 0) {
    //                     setSKUUnitRate(jsonData);
    //                     //console.log("SKU Unit Rate", jsonData.Current_Value);
    //                     // Update the table cell with the SKU item description
    //                     cell.getRow().update({ Application_Rate: jsonData[0]?.Current_Value });
    //                     // Update Estimated Hrs
    //                     const actualQuantity = cell.getRow().getData().Mat_Quantity_Actual;
    //                     const applicationRate = cell.getRow().getData().Application_Rate;
    //                     const matEAScale = cell.getRow().getData().Mat_EA_Scale
    //                     const matUoM = cell.getRow().getData().Mat_UoM

    //                     if (matUoM == "EA"){
    //                         const estimatedHrs = applicationRate !== 0 ? (actualQuantity * matEAScale) / applicationRate : 0;
    //                         cell.getRow().update({ Crew_Hour_Standard: estimatedHrs });
    //                     }else{
    //                         const estimatedHrs = applicationRate !== 0 ? actualQuantity / applicationRate : 0;
    //                         cell.getRow().update({ Crew_Hour_Standard: estimatedHrs });
    //                     }

    //                     Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);
    //                 }
    //                 //console.log(skuItemDesc[0]?.SKU_Item_Desc);
    //             })
    //         // .then(() => {

    //         // });
    //     }
    //     catch (error) {
    //         console.error("Error fetching data:", error);
    //     };
    // }

    useEffect(() => {
        if (skuActivity.length > 0 && skuItemID.length > 0 && skuGroup.length > 0 && skuFamily.length > 0) {
            setSKUFamilyOptions([...new Set(skuFamily.map(item => item.Item_Desc))].map(value => ({
                label: value,
                value: value
            })))

            setSKUUoM([...new Set(costInformation.map(item => item.Mat_UoM))].map(value => ({
                label: value,
                value: value
            })))

            setSKUGroupOptions([...new Set(skuGroup.map(item => item.Item_Desc))].map(value => ({
                label: value,
                value: value
            })))

            setSKUGroupValues([...new Set(skuGroup.map(item => item.Item_Value))].map(value => ({
                label: value,
                value: value
            })))

            setSKUItemIdOptions([...new Set(skuItemID.map(item => item.SKU_Item_CD))].map(value => ({
                label: value,
                value: value
            })))

            setSKUActivityOptions([...new Set(skuActivity.map(item => item.Item_Desc))].map(value => ({
                label: value,
                value: value
            })))

            //
            //setLoading(false);
            setMaterialLoad(false);
            console.log("Dropdown", MaterialLoad)
        }


    }, [skuActivity, skuItemID, skuGroup, costInformation, skuFamily]);

    const options = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 }
    ];

    // Define custom formatter to set background color to #f5f5f5
    function backgroundColorFormatter(cell, formatterParams, onRendered) {
        cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
        return cell.getValue();
    }

    function onHeaderIDCellEdited(cell) {
        Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);
    }

    function onSKUItemIDCellEdited(cell) {
        const SKU_Item_ID = cell.getData().SKU_Item_ID;
        fetchSKUItemDesc(SKU_Item_ID, cell); // Call function to fetch SKU ID Desc value
    }

    function onSKUFamilyCellEdited(cell) {
        const cellData = cell.getData();
        console.log("familyEdited", cellData.SKU_Activity)
        fetchUnitPrice(projectType, cellData.SKU_Activity, cellData.SKU_Family, cell); // Call function to fetch SKU ID Desc value
        Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);
    }

    function onSKUActivityCellEdited(cell) {
        const cellData = cell.getData();
        console.log("activityEdited", cellData)
        fetchUnitPrice(projectType, cellData.SKU_Activity, cellData.SKU_Family, cell); // Call function to fetch SKU ID Desc value
        Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);
    }

    function onEstimatedQtyCellEdited(cell) {

        // Update Estimated Hrs
        const actualQuantity = cell.getRow().getData().Mat_Quantity_Actual;
        const applicationRate = cell.getRow().getData().Application_Rate;
        const matEAScale = cell.getRow().getData().Mat_EA_Scale
        const matUoM = cell.getRow().getData().Mat_UoM
        console.log("test EA", matUoM, "EA")
        if (matUoM == "EA"){
            const estimatedHrs = applicationRate !== 0 ? (actualQuantity * matEAScale) / applicationRate : 0;
            cell.getRow().update({ Crew_Hour_Standard: estimatedHrs });
        }else{
            const estimatedHrs = applicationRate !== 0 ? actualQuantity / applicationRate : 0;
            cell.getRow().update({ Crew_Hour_Standard: estimatedHrs });
        }
        
        // Update Material Cost
        const estimatedQty = parseFloat(cell.getRow().getData().Mat_Quantity_Actual);
        const unitCost = parseFloat(cell.getRow().getData().Mat_Unit_Rate);
        const materialCost = estimatedQty * unitCost;
        cell.getRow().update({ Mat_Cost: materialCost });

        Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current);

    }

    useEffect(() => {
        console.log("Table Initialized", MaterialLoad)
        if ( !MaterialLoad && el.current && !tabulator.current) {
            const columns = [
                { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: false },
                {
                    title: "<span style='color: #007bff;'>✎</span> Section",
                    field: "Header_ID",
                    editor: "list",
                    editable: editableCheck,
                    editorParams: { values: options },
                    cellEdited: onHeaderIDCellEdited,
                    cellEditing: onHeaderIDCellEdited,
                    hozAlign: "center"
                },
                {
                    title: "<span style='color: #007bff;'>✎</span> SKU #",
                    field: "SKU_Item_ID",
                    editor: "list",
                    editable: editableCheck,
                    editorParams: { values: skuItemIdOptions, search: true, autocomplete: true },
                    cellEdited: onSKUItemIDCellEdited,
                    cellEditing: onSKUItemIDCellEdited,
                    hozAlign: "center"
                },
                {
                    title: "Description",
                    field: "SKU_Item_Desc",
                    formatter: backgroundColorFormatter,
                    width: 225,
                    tooltip: true
                },
                {
                    title: "Truck Type",
                    field: "SKU_Group",
                    editorParams: { values: skuGroupOptions },
                    formatter: backgroundColorFormatter
                },
                {
                    title: "<span style='color: #007bff;'>✎</span> SKU Family",
                    field: "SKU_Family",
                    editor: "list",
                    editable: editableCheck,
                    editorParams: { values: skuFamilyOptions },
                    cellEdited: onSKUFamilyCellEdited,
                    cellEditing: onSKUFamilyCellEdited
                },
                {
                    title: "<span style='color: #007bff;'>✎</span> Activity",
                    field: "SKU_Activity",
                    editor: "list",
                    editable: editableCheck,
                    editorParams: { values: skuActivityOptions },
                    cellEdited: onSKUActivityCellEdited,
                    cellEditing: onSKUActivityCellEdited
                },
                {
                    title: "UoM",
                    field: "Mat_UoM",
                    formatter: backgroundColorFormatter,
                    hozAlign: "center"
                },
                {
                    title: "Unit Cost",
                    field: "Mat_Unit_Rate",
                    formatter: function (cell) {
                        cell.getElement().style.backgroundColor = "#f5f5f5";
                        return "$" + Helper.formatNumber(cell.getValue(), 3, 3, 0)
                    },
                    hozAlign: "center"
                },
                {
                    title: "<span style='color: #007bff;'>✎</span> Estimated Qty",
                    field: "Mat_Quantity_Actual",
                    editor: "number",
                    editable: editableCheck,
                    cellEdited: onEstimatedQtyCellEdited,
                    cellEditing: onEstimatedQtyCellEdited,
                    validator:"max:10000000",
                    formatter: function (cell) { return Helper.formatNumber(cell.getValue(), 0, 2, 0) },
                    hozAlign: "center"
                },
                {
                    title: "Estimated Hrs",
                    field: "Crew_Hour_Standard",
                    bottomCalc: Helper.formattedCalc,
                    bottomCalcParams: { precision: 2, },
                    formatter: function (cell) {
                        cell.getElement().style.backgroundColor = "#f5f5f5";
                        return Helper.formatNumber(cell.getValue(), 0, 0, 0)
                    },
                    hozAlign: "center"
                },
                {
                    title: "Total Material Cost",
                    field: "Mat_Cost",
                    bottomCalc: Helper.formattedCalcMoney,
                    bottomCalcParams: { precision: 2, },
                    formatter: function (cell) {
                        cell.getElement().style.backgroundColor = "#f5f5f5";
                        return "$" + Helper.formatNumber(cell.getValue(), 0, 2, 0)
                    },
                    hozAlign: "center"
                },
                { title: "App Rate", field: "Application_Rate", formatter: backgroundColorFormatter },
                { title: "EA", field: "Mat_EA_Scale", formatter: backgroundColorFormatter },

                { title: "Headcount", field: "Labour_Headcount", formatter: backgroundColorFormatter },
                {
                    formatter: "buttonCross",
                    width: 40,
                    headerSort: false,
                    cellClick: function (e, cell) {
                      const deleteCostLine = async () => {
                        // abortControllerRef.current?.abort();
                        // abortControllerRef.current = new AbortController();
                        //setIsLoading(true);
                
                        try {
                          const options = {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                            }
                          };
                          const resp = await fetch(`${config_url.url}/delete_projectCostLineItem/${cell.getRow().getData().Project_Cost_Line_Item_ID}`, options);
                          //const projectInfo = await resp.json();
                          cell.getRow().delete(); 
                          Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current); 
                        }
                        catch (err) {
                          if (err.name === "AbortError") {
                            console.log("Aborted");
                            return;
                          }
                          console.error(err)
                          setError(err);
                        }
                        finally {
                          //setIsLoading(false);
                        }
                      }
                      
                      deleteCostLine(); 
                    }
                }
            ];

            tabulator.current = new Tabulator(el.current, {
                responsiveLayoutCollapseStartOpen: false,
                responsiveLayout: "collapse",
                history: true,
                data: costInformation,
                columns: columns,
                resizableColumnFit: true,
                autoResize: true,
                reactiveData: true,
                pagination: "local",
                paginationSize: 15,
                paginationSizeSelector: [10, 15, 20, 25],
                // initialSort: [ // Set initial sort order by "Bid#" field in descending order
                //     { column: "Project_ID", dir: "desc" }
                // ]
            });

            tabulator.current.on("dataLoaded", function () {
            });

            //trigger editing of component so that onCellEditCancelled is trigger after table undo/redo
            tabulator.current.on("historyUndo", function (action, component, data) {
                if (action === "cellEdit") {
                    component.edit()
                }
            });

            tabulator.current.on("historyRedo", function (action, component, data) {
                if (action === "cellEdit") {
                    component.edit()
                }
            });

        } 

    // Call fetchDataAfterPatch to execute the fetch request after the patch requests
    //fetchDataAfterPatch();
    const postData = async (endpoint) => {
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        };
        //console.log("JSON for body ", options.body);
        const response = await fetch(endpoint, options);
      } catch (error) {
        console.error("Error patching data:", error);
      }
    };

        return () => {
            if (tabulator.current) {
                tabulator.current.destroy();
                tabulator.current = null;
            }
        };
    }, [costInformation, MaterialLoad, isDisabled]);

    return (
        <>
            { (
                <div>
                    <div className="d-flex justify-content-end align-items-center mb-1" style={{marginTop: '-10px'}}>
                        <Button size="sm" variant="light" onClick={() => { tabulator.current.addRow(); Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current); tabulator.current.recalc(); }} className="mx-1">
                            <RiMenuAddLine /> New
                        </Button>
                        <Button size="sm" variant="link" onClick={() => { tabulator.current.undo(); Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current); tabulator.current.recalc(); }} className="mx-1">
                            <RiArrowGoBackLine />
                        </Button>
                        <Button size="sm" variant="link" onClick={() => { tabulator.current.redo(); Helper.updateLaborCostTable(driveDistanceRef.current, costMobalizationRef.current); tabulator.current.recalc(); }} className="mx-1">
                            <RiArrowGoForwardLine />
                        </Button>
                    </div>
                    <div id="material-cost" ref={el} className="CrudTable"/>
                </div>
            )}
        </>
    );
};

export default MaterialCostv1;