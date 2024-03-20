import React, { useState, useEffect, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
//import Table from "./CrudTable";
import './BidTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input, Page } from '@mobiscroll/react'; // Import the Table component
import * as Helper from './HelperCosting';
import './Tables.css';
import config_url from '../../data/config_url';

const LabourCost = ({ selectedBid, isDisabled }) => {
    const el = useRef(null);
    let tabulator = useRef(null);

    const [projectType, setProjectType] = useState([]);
    const [driveDistance, setDriveDistance] = useState([]);
    const [projectVersion, setProjectVersion] = useState([]);
    const [costInformation, setCostInformation] = useState([]);
    const [skuItemID, setSKUItemID] = useState([]);
    const [skuGroup, setSKUGroup] = useState([]);
    const [skuFamily, setSKUFamily] = useState([]);
    const [skuActivity, setSKUActivity] = useState([]);
    const [totalMaterialCost, setTotalMaterialCost] = useState([]);
    const [totalLaborCostSum, settotalLaborCostSum] = useState(0);
    
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();  

    const driveDistanceRef = useRef(driveDistance);
    // Enables/disables table editing
    const editableCheck = (cell) => {
        return !isDisabled; // Allow editing if isDisabled is false
    };

    // useEffect(() => {
    //     if (selectedBid) {
    //         fetchData(`/get_project_information/smc/${selectedBid}`, setProjectVersion);
    //     }
    // }, []); // Empty dependency array to run the effect once

    useEffect(() => {
        if (selectedBid) {
          const fetchProjectInfo = async () => {
            // abortControllerRef.current?.abort();
            // abortControllerRef.current = new AbortController();

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
              setError(err);
            }
            finally {
            }
          }

          fetchProjectInfo();
        }
      }, [selectedBid]);

    // useEffect(() => {
    //     // Check if projectVersion has been set and is not empty
    //     if (projectVersion[0]) {
    //         fetchData(`/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`, (data) => {
    //             console.log("Drive Distance:", data); // Log driveDistance here
    //             //const laborCostTable = Tabulator.findTable("#labor-cost")[0];
    //             const laborCostTable = Tabulator.current;
    //             if (laborCostTable) {
    //                 const laborCostData = laborCostTable.getData();
    //                 // Loop through each row in the data
    //                 laborCostData.forEach(row => {
    //                     // Update the row object with the drive distance
    //                     row["Drive_Distance"] = data[0]?.Distance_Hour;
    //                     console.log("new row", row)
    //                     laborCostData.updateData([row])
    //                 });
    //             }
    //             setDriveDistance(data);
    //         });
    //     }
    // }, [projectVersion]); // Run this effect whenever projectVersion changes

    // useEffect(() => {
    //     // Check if projectVersion has been set and is not empty
    //     if (projectVersion[0]) {
    //         Promise.all([
    //             fetchData(`/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`, (data) => {
    //                  // Log driveDistance here
    //                 const laborCostTable = Tabulator.findTable("#labor-cost")[0];
    //                 //const laborCostTable = Tabulator.current;
    //                 // if (laborCostTable) {
    //                 //     const laborCostData = laborCostTable.getData();
    //                 //     // Loop through each row in the data
    //                 //     laborCostData.forEach(row => {
    //                 //         // Update the row object with the drive distance
    //                 //         console.log("Current Row Value", laborCostData);
    //                 //         row["Drive_Distance"] = data[0]?.Distance_Hour;
    //                 //         console.log("new row", row)
    //                 //         //row.updateData({Drive_Distance: data[0]?.Distance_Hour})
    //                 //         //laborCostData.updateData([row])
    //                 //     });
    //                 // }
    //                 setDriveDistance(data);
    //                 //console.log("Drive Distance - Labor Cost:", data);
    //             })
    //         ]).then(() => {
    //             console.log("Data loaded successfully - Labour Cost");
    //         }).catch(error => {
    //             console.error("Error fetching data:", error);
    //         });

    //     }
    // }, [projectVersion]); // Run this effect whenever projectVersion changes

    useEffect(() => {
        if (projectVersion[0]) {
          const fetchProjectInfo = async () => {
            // abortControllerRef.current?.abort();
            // abortControllerRef.current = new AbortController();

            try {
              const resp = await fetch(`${config_url.url}/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`, (data) => {
                const laborCostTable = Tabulator.findTable("#labor-cost")[0];
                setDriveDistance(data);})

              const projectInfo = await resp.json();
              setProjectVersion(projectInfo);
            }
            catch (err) {
              if (err.name === "AbortError") {
                console.log("Aborted");
                return;
              }
              setError(err);
            }
            finally {
            }
          }

          fetchProjectInfo();
        }
      }, [projectVersion]);




    // useEffect(() => {
    //     driveDistanceRef.current = driveDistance[0]?.Distance_Hour;
    //     const laborCostTable = Tabulator.findTable("#labor-cost")[0];
    //     if (laborCostTable && !Helper.isTableEmpty("#labor-cost")) {
    //         laborCostTable.getData().forEach(row => {
    //             row.Drive_Distance = driveDistanceRef.current;
    //             laborCostTable.updateData([row]);
    //         });
    //     }
    // }, [driveDistance]);


    const fetchData = async (endpoint, setdata) => {
        try {
            const response = await fetch(endpoint);
            const jsonData = await response.json();
            if (jsonData && jsonData.length > 0) {
                setdata(jsonData);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 }
    ];


    //console.log("Sum Cost", totalLaborCostSum);

    // Formatter for Mob
    function mobFormatter(cell, formatterParams, onRendered) {
        const hrs = cell.getRow().getData().Labour_Hours_Override || cell.getRow().getData().Crew_Hour_Standard || 0;
        const dist = cell.getRow().getData().Drive_Distance || 0
        const mob = hrs / (12 - 2 * dist ); // Calculate Mob
        cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
        return Helper.formatNumber(mob,0,2,0)
    }

    // Formatter for Time/Mob
    function timeMobFormatter(cell, formatterParams, onRendered) {
        const hrs = cell.getRow().getData().Labour_Hours_Override || cell.getRow().getData().Crew_Hour_Standard || 0;
        const dist = cell.getRow().getData().Drive_Distance || 0
        const mob = cell.getRow().getData().Mob_Override || hrs / (12 - 2 * dist ); // Calculate Mob
        const timeMob = mob !== 0 ? hrs / mob : 0; // Calculate Time/Mob
        cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
        return Helper.formatNumber(timeMob,0,2,0)
    }

    // Define custom formatter to set background color to #f5f5f5
    function backgroundColorFormatter(cell, formatterParams, onRendered) {
        cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
        return cell.getValue();
    }

    useEffect(() => {
        if (el.current && !tabulator.current) {
            const columns = [
                { title: 'Section', field: 'Header_ID', formatter: backgroundColorFormatter, hozAlign: "center" },
                { title: 'Group', field: 'SKU_Group', formatter: backgroundColorFormatter },
                {
                    title: 'Qty', field: 'Mat_Quantity_Actual', hozAlign: "center", formatter: function(cell){
                        cell.getElement().style.backgroundColor = "#f5f5f5"; 
                        return Helper.formatNumber(cell.getValue(),0,2,0)
                    }
                },
                {
                    title: 'Hrs.', field: 'Crew_Hour_Standard', hozAlign: "center", formatter: function(cell){
                        cell.getElement().style.backgroundColor = "#f5f5f5"; 
                        return Helper.formatNumber(cell.getValue(),0,2,0)
                    }
                },
                { title: "<span style='color: #007bff;'>✎</span> Hrs. (override)", mutateLink: "Labour_Hours", editor: "number", editable: editableCheck, validator:"max:1000", hozAlign: "center", field: 'Labour_Hours_Override', cellEdited: function (cell) { cell.getRow().reformat(); }, formatter: function(cell){
                    return Helper.formatNumber(cell.getValue(),0,2,0)
                }},
                { title: 'Mob (Calc.)', field: 'Type', hozAlign: "center", formatter: mobFormatter },
                { title: "<span style='color: #007bff;'>✎</span> Mob (override)", editor: "number", editable: editableCheck, validator:"max:1000", hozAlign: "center", field: 'Mob_Override', cellEdited: function (cell) { cell.getRow().reformat() },formatter: function(cell){
                    return Helper.formatNumber(cell.getValue(),0,2,0)
                }},
                { title: 'Time/Mob', hozAlign: "center", field: 'Mob_Time',formatter:timeMobFormatter },
                { title: 'Labour Hours', hozAlign: "center", field: 'Labour_Hours', bottomCalc: Helper.formattedCalc, 
                mutator: function(value, data){
                    //const estimatedHours = data.Labour_Hours_Override || data.Labour_Hour_Standard
                    const estimatedHours =  data.Labour_Hours_Override || data.Crew_Hour_Standard
                    const labourHeadcount = data.Labour_Headcount
                    const labourHours = estimatedHours * labourHeadcount
                    return labourHours
                }

                ,formatter: function(cell){
                    cell.getElement().style.backgroundColor = "#f5f5f5"; 
                    return Helper.formatNumber(cell.getValue(),0,2,0)
                } },
                { title: 'Distance Hrs.', field: 'Drive_Distance', formatter: backgroundColorFormatter}

            ];

            tabulator.current = new Tabulator(el.current, {
                //responsiveLayoutCollapseStartOpen: false,
                data: [],
                columns: columns,
                layout: 'fitDataFill',
                //responsiveLayout: "collapse",
                resizableColumnFit: true,
                autoResize: true,
                reactiveData: true,
                pagination: "local",
                paginationSize: 15,
                paginationSizeSelector: [10, 15, 20, 25],
                // initialSort: [ // Set initial sort order by 'Bid#' field in descending order
                //     { column: 'Project_ID', dir: 'desc' }
                // ]
            });

            // tabulator.current.on("tableBuilt", function () {
            //     console.log("In Labor Table", driveDistance[0]?.Distance_Hour)
            //     Helper.updateLaborCostTable(driveDistance[0]?.Distance_Hour)
            // });
        }
        // else{
        //     tabulator.current.setData(Helper.updateLaborCostTable()).then(() => 
        //     tabulator.current.getRows().forEach(async (row) => {
        //         console.log("Update Drive Distance", driveDistance);

        //     })

        //     )
        // } 

        return () => {
            if (tabulator.current) {
                tabulator.current.destroy();
                tabulator.current = null;
            }
        };

    }, [costInformation, isDisabled]);

    return (
        <div>
            <div id="labor-cost" ref={el} className="DefaultTable" />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            </div>
        </div>
    );
};

export default LabourCost;