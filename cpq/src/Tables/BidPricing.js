import React, { useState, useEffect, useRef } from 'react';
//import Table from "./CrudTable";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import './BidTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Input, Page } from '@mobiscroll/react';
import * as Helper from './HelperCosting';
import config_url from '../../data/config_url';

const BidPricing = ({ selectedBid, isDisabled, setTotalBidPrice }) => {
  const el = useRef(null);
  let tabulator = useRef(null);

  const [projectVersion, setProjectVersion] = useState([]);
  const [priceInformation, setPriceInformation] = useState([]);

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  // Define custom formatter to set background color to #f5f5f5
  function backgroundColorFormatter(cell, formatterParams, onRendered) {
    cell.getElement().style.backgroundColor = "#f5f5f5"; // Set background color
    return cell.getValue();
  }

  function backgroundColorFormatterEdit(cell, formatterParams, onRendered) {
    //cell.getElement().style.color = '#00A7FF';
    return cell.getValue();
  }

  const editFieldValue = (cell) => {
    const row = cell.getRow().getData()
    row.Project_Version_ID = projectVersion[0]?.Current_Project_Version_ID
    //console.log("Attempting to patch BidPricing", row)
    const totalPrice = cell.getTable().getCalcResults().bottom.Total_Price;
    console.log("Total Price", totalPrice);
    //BidPricingSummary.calculateTotalProfit( selectedBid ,totalPrice.bottom.Total_Price);
    setTotalBidPrice(totalPrice);

    const postData = async () => {
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(row),
          //signal: abortControllerRef.current?.signal,
        };

        const response = await fetch(`${config_url.url}/merge_projectPriceSummary`, options);
      }
      catch (err) {
        setError(err);
        console.error("Error patching data:", err);
      }
      finally {
        //setIsSending(false)
      }
    }

    postData();
    //patchData(`/merge_projectPriceSummary`, row);
  }

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

        try {
          const resp = await fetch(`${config_url.url}/get_ProjectPriceLineItem/smc/${projectVersion[0]?.Current_Project_Version_ID}`);
          const priceInfo = await resp.json();
          setPriceInformation(priceInfo);
        }
        catch (err) {
          if (err.name === "AbortError") {
            console.log("Aborted");
            return;
          }
          setError(err);
        }
        finally {
          //setIsLoading(false);
        }
      }

      fetchProjectInfo();
    }
  }, [projectVersion]);

  useEffect(() => {
    if (el.current && !tabulator.current) {
      const columns = [
        { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: false },
        { title: 'Section', field: 'Header_ID', formatter: backgroundColorFormatter, hozAlign: "center" },
        { title: 'Line-Item', field: 'SKU_Item_ID', formatter: backgroundColorFormatter, hozAlign: "center" },
        //{ title: 'Truck Type', field: 'SKU_Group', formatter: backgroundColorFormatter},
        //{ title: 'SKU Family', field: 'SKU_Family', formatter: backgroundColorFormatter},
        //{ title: 'Activity', field: 'SKU_Activity', formatter: backgroundColorFormatter},
        { title: 'UoM', field: 'Mat_UoM', formatter: backgroundColorFormatter, hozAlign: "center" },
        {
          title: "<span style='color: #007bff;'>✎</span> Description", editor: "input", editable: !isDisabled, editorParams: { elementAttributes: { maxlength: "50" } }, field: 'SKU_Item_Desc', mutator: function (value, data) {
            return data.SKU_Alias_Item_Desc ? data.SKU_Alias_Item_Desc : data.SKU_Item_Desc
          }
          , cellEdited: function (cell) { editFieldValue(cell) }
        },
        //{ title: 'Bid QTY', field: 'Mat_Quantity_Actual', formatter: backgroundColorFormatter},
        {
          title: 'Unit Cost', field: 'Unit_Cost', hozAlign: "center", mutator: function (value, data) {
            // previous calculation 2024/02/29
            // const Cost = data.Unit_Cost * data.Quoted_Qty
            // const Revenue = data.Price * data.Quoted_Qty
            // const Margin = (Revenue - Cost) / Cost || 0
            const Cost = data.Total_Line_Cost
            const Quantity = data.Quoted_Qty > 0 ? data.Quoted_Qty : data.Mat_Quantity_Actual
            const UnitCost = Cost / Quantity
            return UnitCost
          }, formatter: function (cell) {
            cell.getElement().style.backgroundColor = "#f5f5f5";
            return "$" + Helper.formatNumber(cell.getValue(), 0, 3, 0)
          }
        },
        {
          title: 'Extended Cost', field: 'Total_Line_Cost', hozAlign: "center", formatter: function (cell) {
            cell.getElement().style.backgroundColor = "#f5f5f5";
            return "$" + Helper.formatNumber(cell.getValue(), 0, 2, 0)
          }
        },
        {
          title: 'Agg. Qty', field: 'Mat_Quantity_Actual', hozAlign: "center", formatter: function (cell) {
            cell.getElement().style.backgroundColor = "#f5f5f5";
            return Helper.formatNumber(cell.getValue(), 0, 2, 0)
          }
        },
        {
          title: "<span style='color: #007bff;'>✎</span> Quoted Qty",
          field: 'Quantity_Actual',
          hozAlign: "center",
          editor: "number",
          editable: !isDisabled,
          validator: "max:1000000",
          formatter: function (cell) {
            return Helper.formatNumber(cell.getValue(), 0, 2, 0)
          },
          mutateLink: ["Margin", "Total_Price"],
          cellEdited: function (cell) { editFieldValue(cell) },
        },
        {
          title: "<span style='color: #007bff;'>✎</span> Price",
          field: 'Price',
          hozAlign: "center",
          editor: "number",
          editable: !isDisabled,
          validator: "max:1000",
          formatter: function (cell) {
            return "$" + Helper.formatNumber(cell.getValue(), 0, 2, 0)
          },
          mutateLink: ["Margin", "Total_Price"],
          cellEdited: function (cell) { editFieldValue(cell) }
        },
        {
          title: 'Margin', field: 'Margin', hozAlign: "center", mutator: function (value, data) {
            //console.log(data)
            const Quantity = data.Quantity_Actual > 0 ? data.Quantity_Actual : data.Mat_Quantity_Actual
            const Cost = data.Unit_Cost * Quantity
            const Revenue = data.Price * Quantity
            const Margin = (Revenue - Cost) / Revenue || 0

            //console.log(Margin)

            return Margin
          }, formatter: function (cell) {
            cell.getElement().style.backgroundColor = "#f5f5f5";
            return Helper.formatNumberPercent(cell.getValue(), 0, 2, 0)
          }
        },
        {
          title: 'Total Price', field: 'Total_Price', hozAlign: "center", bottomCalc: "sum", bottomCalcParams: { precision: 2 },
        mutator: function (value, data) {
          const qty = data.Quantity_Actual > 0 ? data.Quantity_Actual : data.Mat_Quantity_Actual
          const price = data.Price ? data.Price : 0
          return qty * price
        }, formatter: function (cell) {
          cell.getElement().style.backgroundColor = "#f5f5f5";
          return "$" + Helper.formatNumber(cell.getValue(), 0, 2, 0)
        }

        },

        //{ title: 'Total Extended Cost', field: 'Total_Line_Cost', formatter: backgroundColorFormatter},
      ];

tabulator.current = new Tabulator(el.current, {
  responsiveLayoutCollapseStartOpen: false,
  responsiveLayout: "collapse",
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
});
return () => {
  if (tabulator.current) {
    tabulator.current.destroy();
    tabulator.current = null;
  }
};
    }
  }, [priceInformation, isDisabled]);

return (
  <div >
    <div id="bid-pricing" ref={el} className="DefaultTable" />
  </div>
);
};

export default BidPricing;