import React, { useState, useEffect, useRef } from 'react';
//import Table from "./CrudTable";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import './BidTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input, Page } from '@mobiscroll/react';
import * as Helper from './HelperCosting';
import config_url from '../../data/config_url';

const CostSummary = ({ selectedBid, isDisabled }) => {
    const el = useRef(null);
    let tabulator = useRef(null);

    const [projectVersion, setProjectVersion] = useState([]);
    const [priceInformation, setPriceInformation] = useState([]);
    const [priceSummary, setPriceSummary] = useState([]);
    const priceSummaryRef = useRef(priceSummary);

    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        priceSummaryRef.current = priceSummary;
    }, [priceSummary]);

    // Define custom formatter to set background color to #f5f5f5
    function backgroundColorFormatter(cell, formatterParams, onRendered) {
        cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
        return cell.getValue();
    }

    function backgroundColorFormatterEdit(cell, formatterParams, onRendered) {
        if (isDisabled) {
            cell.getElement().style.backgroundColor = '#f5f5f5';
        } 
        return cell.getValue();
    }

    const editFieldValue = (cell) => {
        let oldValue = cell.getOldValue();
        let newValue = cell.getValue();
        let lineItem = cell.getRow().getData().Project_Price_Line_ID;
        let field = cell.getField();
        //post to backend on edit
        updateDbRow(lineItem, field, newValue)
        //update bidpricing table in memory
        if (oldValue !== newValue) {
            Helper.updateBidPricingTable(priceSummaryRef.current)
        }
    }

    const updateDbRow = async (id, field, newValue) => {
      const data = {
          field_name: field,
          field_value: newValue
      };
      //patchData(`/update_projectPriceLineItem/${id}`, data);
      try {
        const options = {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify(data),
          //signal: abortControllerRef.current?.signal,
        };
        
        const response = await fetch(`${config_url.url}/update_projectPriceLineItem/${id}`, options); 
      } 
      catch (err) {
        setError(err);
        console.error("Error patching data:", err);
      }
      finally {
        //setIsSending(false)
      }
    };

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


    useEffect(() => {
      if (projectVersion[0]?.Current_Project_Version_ID.length > 1) {
        const fetchProjectInfo = async () => {
          // abortControllerRef.current?.abort();
          // abortControllerRef.current = new AbortController();
          const requestUrls = [
            `${config_url.url}/get_ProjectPriceLineItem/smc/${projectVersion[0]?.Current_Project_Version_ID}`,
            `${config_url.url}/get_projectPriceSummary/smc/${projectVersion[0]?.Current_Project_Version_ID}`
          ];

          try {
            const responses = [];
            for (const requestUrl of requestUrls) {
              const resp = await fetch(requestUrl);
              const data = await resp.json();
              responses.push(data)
            }
            const [priceLineItem, priceSummary] = responses;
            setPriceInformation(priceLineItem);
            setPriceSummary(priceSummary);
          }
          catch (err) {
            if (err.name === "AbortError") {
              console.log("Aborted");
              return;
            }
            setError(err);
          }
          finally {
            //setPriceLoad(false);
          }
        }

        fetchProjectInfo();
      }
    }, [projectVersion]);


    useEffect(() => {
        const columns = [
            { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: false },
            { title: 'Section', field: 'Header_ID', formatter: backgroundColorFormatter, hozAlign: "center" },
            { title: 'Line-Item', field: 'SKU_Item_ID', formatter: backgroundColorFormatter, hozAlign: "center" },
            { title: 'Description', field: 'SKU_Item_Desc', formatter: backgroundColorFormatter},
            { title: 'Truck Type', field: 'SKU_Group', formatter: backgroundColorFormatter},
            { title: 'SKU Family', field: 'SKU_Family', formatter: backgroundColorFormatter},
            { title: 'Activity', field: 'SKU_Activity', formatter: backgroundColorFormatter},
            { title: 'UoM', field: 'Mat_UoM', formatter: backgroundColorFormatter, hozAlign: "center"},
            { title: "<span style='color: #007bff;'>✎</span> Alias SKU", field: 'SKU_Alias_Item_ID', formatter: backgroundColorFormatterEdit, editor: "input", editable: !isDisabled, editorParams:{ elementAttributes:{ maxlength:"25" }}, cellEdited: function(cell){ editFieldValue(cell)}},
            //{ title: "<span style='color: #007bff;'>✎</span> Alias Description", field: 'SKU_Alias_Item_Desc', editor: "input", formatter: backgroundColorFormatterEdit, cellEdited: function(cell){editFieldValue(cell)} },
            { title: 'Unit Cost', field: 'Unit_Cost', hozAlign: "center", mutator: function(value, data){
                return (data.Total_Line_Cost / data.Mat_Quantity_Actual)
            },formatter: function(cell){
                cell.getElement().style.backgroundColor = "#f5f5f5"; 
                return "$" + Helper.formatNumber(cell.getValue(),0,2,0)
            }},
            { title: 'Bid QTY', field: 'Mat_Quantity_Actual', hozAlign: "center", formatter: function(cell){
                cell.getElement().style.backgroundColor = "#f5f5f5"; 
                return Helper.formatNumber(cell.getValue(),0,0,0)
            }},
            { title: 'Extended Cost', field: 'Total_Line_Cost', hozAlign: "center", formatter: function(cell){
                cell.getElement().style.backgroundColor = "#f5f5f5"; 
                return "$" + Helper.formatNumber(cell.getValue(),0,2,0)
            }},
        ];

        tabulator.current = new Tabulator(el.current, {
            responsiveLayoutCollapseStartOpen: false,
            responsiveLayout: "collapse",
            data: priceInformation,
            columns: columns,
            layout: 'fitDataFill',
            //responsiveLayout: "collapse",
            resizableColumnFit: true,
            autoResize: true,
            reactiveData: true,
            pagination: "local",
            paginationSize: 15,
            paginationSizeSelector: [10, 15, 20, 25],
        });
        return () => {
            if (tabulator.current) {
                tabulator.current.destroy();
                tabulator.current = null;
            }
        };
    }, [priceInformation, isDisabled]);

    return (
        <div >
            <div id="cost-summary" ref={el} className="DefaultTable" />
        </div>
    );
};

export default CostSummary;