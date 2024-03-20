import React, { useState, useEffect, useRef } from 'react';
//import Table from "./CrudTable";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Helper from './HelperCosting';
import config_url from '../../data/config_url';

const CompBids = ({ selectedBid }) => {
  //const [projectVersion, setProjectVersion] = useState([]);
  const [projectBidInformation, setProjectBidInformation] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const el = useRef(null);
  let tabulator = useRef(null);

  // Define custom formatter to set background color to #f5f5f5
  function backgroundColorFormatter(cell, formatterParams, onRendered) {
      cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
      return cell.getValue();
  }

  function backgroundColorFormatterEdit(cell, formatterParams, onRendered) {
      cell.getElement().style.color = '#00A7FF';
      return cell.getValue();
  }

  useEffect(() => {
    const fetchProjectInfo = async () => {
      // abortControllerRef.current?.abort();
      // abortControllerRef.current = new AbortController();

      try {
        const resp = await fetch(`${config_url.url}/get_projectValuation/smc`);
        const projectBidInfo = await resp.json();
        setProjectBidInformation(projectBidInfo);
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
  }, []);

  //console.log(projectBidInformation[0]?.Project_Name);

  useEffect(() => {
    if (el.current && !tabulator.current) {
        const columns = [
            { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: false },
            { title: 'Project Name', field: 'Project_Name', formatter: backgroundColorFormatter, width:350, tooltip:true },
            { title: 'Won/Lost', field: 'Bid_Outcome', formatter: backgroundColorFormatter },
            { title: 'Quoted Margin', field: 'Quoted_Margin', formatter: backgroundColorFormatter, bottomCalc: Helper.formattedCalcAvgPercent, hozAlign: "center" },
            { title: 'Actual Margin', field: 'Actual_Margin_Percentage', bottomCalc: Helper.formattedCalcAvgPercent, hozAlign: "center", formatter: function(cell){
                cell.getElement().style.backgroundColor = "#f5f5f5"; 
                return Helper.formatNumber(cell.getValue(),0,2,0) + "%"
            } },
            { title: 'Value', minWidth: 100, field: 'Actual_Cost_Billed_Total', bottomCalc: "avg", hozAlign: "center", bottomCalc: Helper.formattedCalcMoney, formatter: function(cell){
                cell.getElement().style.backgroundColor = "#f5f5f5"; 
                return "$" + Helper.formatNumber(cell.getValue(),0,2,0)
            }},
            { title: 'State', field: 'State_CD', formatter: backgroundColorFormatter, hozAlign: "center" },
            { title: 'Region', field: 'Region_CD', formatter: backgroundColorFormatter, hozAlign: "center" },
            { title: 'Project Type', field: 'Project_Type', formatter: backgroundColorFormatter },
            //{ title: "Type of Work", field: 'Work_Type', formatter: backgroundColorFormatterEdit},
            { title: 'Bid Type', field: 'Quote_Type', formatter: backgroundColorFormatter },
            { title: 'Bid Date', field: 'Project_Year_Month_Desc', formatter: backgroundColorFormatter }

            //{ title: 'Link to Quote', field: 'Quote_Link', formatter: backgroundColorFormatter},
            // { title: 'Link to Quote', field: 'cost', formatter: function(cell) {
            //     const rowData = cell.getRow().getData();
            //     cell.getElement().style.backgroundColor = "#f5f5f5";
            //     return (rowData.Total_Line_Cost / rowData.Mat_Quantity_Actual / 100).toFixed(2)
            // }}
        ];

        tabulator.current = new Tabulator(el.current, {
            responsiveLayoutCollapseStartOpen: false,
            data: projectBidInformation,
            columns: columns,
            layout: 'fitData',
            responsiveLayout: "collapse",
            resizableColumnFit: true,
            pagination: "local",
            paginationSize: 15,
            paginationSizeSelector: [10, 15, 20, 25],
            autoResize: true,
            reactiveData: true,
        });
    }
    else{
        tabulator.current.setData(projectBidInformation);
    }
    return () => {
        if (tabulator.current) {
            tabulator.current.destroy();
            tabulator.current = null;
        }
    };
  }, [projectBidInformation]);

  return (
      <div >
          <div id="cost-summary" ref={el} className="DefaultTable" />
      </div>
  );
};

export default CompBids;