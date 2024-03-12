import 'bootstrap/dist/css/bootstrap.min.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Button, Input, Page } from '@mobiscroll/react';
import React, { useState, useEffect } from 'react';
//import './BidTable.css';
import './Forms.css';
//import './BidTable.css';
//import {editFieldValue} from './BidPricing';
import config_url from '../data/config_url';

function BidTable({ selectedBid, totalBidPrice, PriceLoad, setPriceLoad }) {
  const [projectVersion, setProjectVersion] = useState([]);
  const [priceInformation, setPriceInformation] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const [formattedData, setFormattedData] = useState({
    formattedLabourHrs: 0,
    formattedMaterialCost: 0,
    formattedVehicleCost: 0,
    formattedOverheadCost: 0,
    formattedLabourCost: 0,
    formattedTotalCost: 0,
    formattedTotalProfit: 0,
    formattedMargin: 0,
  });

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  //console.log(editFieldValue)

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

  console.log("ProjectVersion", projectVersion[0]?.Current_Project_Version_ID);

  useEffect(() => {
    if (projectVersion[0]?.Current_Project_Version_ID) {
      const fetchDropdownData = async () => {
        const requestUrls = [
          `${config_url.url}/get_ProjectPriceLineItem/smc/${projectVersion[0]?.Current_Project_Version_ID}`,
          `${config_url.url}/get_ProjectPriceSummary/smc/${projectVersion[0]?.Current_Project_Version_ID}`,
        ];
        
        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();
  
        setPriceLoad(true);
    
        try {
          const responses = [];
          for (const requestUrl of requestUrls) {
            const resp = await fetch(requestUrl);
            const data = await resp.json();
            responses.push(data)
          }
          const [price_info, total_price] = responses;
          setPriceInformation(price_info);
          setTotalPrice(total_price);
        } catch (err) {
          console.error(err);
          setError(err);
        } finally {
          setPriceLoad(false);
        }
      };
      
      fetchDropdownData();
      
    }
  }, [projectVersion]);

  useEffect(() => {
    // Calculate the sum of Material Cost values
    const sumLabourHrs = priceInformation.reduce((acc, item) => acc + item.Mob_Weighted_Labour_Hour, 0);
    const sumLabourCost = priceInformation.reduce((acc, item) => acc + item.Mob_Weighted_Labour_Cost, 0);
    const sumOverheadCost = priceInformation.reduce((acc, item) => acc + item.Overhead_Cost, 0);
    const sumVehicleCost = priceInformation.reduce((acc, item) => acc + item.Equipment_Cost, 0);
    const sumTotalCost = priceInformation.reduce((acc, item) => acc + item.Total_Line_Cost, 0);
    const sumMaterialCost = priceInformation.reduce((acc, item) => acc + item.Mat_Cost, 0);
    //const sumTotalPrice = totalPrice.reduce((acc, item) => acc + item.Total_Line_Price, 0);

    let totalProfit;
    let margin;

    totalProfit = totalBidPrice - sumTotalCost
    margin = totalProfit / totalBidPrice;

    // Format numbers with commas and 2 decimals
    setFormattedData(prevData => ({...prevData, formattedLabourHrs: sumLabourHrs !== null ? sumLabourHrs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedMaterialCost: sumMaterialCost !== null ? sumMaterialCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedVehicleCost: sumVehicleCost !== null ? sumVehicleCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedOverheadCost: sumOverheadCost !== null ? sumOverheadCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedLabourCost: sumLabourCost !== null ? sumLabourCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedTotalCost: sumTotalCost !== null ? sumTotalCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedTotalProfit: totalProfit !== null ? totalProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}));
    setFormattedData(prevData => ({...prevData, formattedMargin: margin !== null ? (margin * 100).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%" : ''}));
  }, [priceInformation, totalPrice, totalBidPrice]);

  return (
    <Page>
      <div className="mbsc-col-md-3 mbsc-col mbsc-form-grid">
        <div className="mbsc-row">
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Material Cost" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedMaterialCost} required readOnly/>
          </div>
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Labor Hours" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedLabourHrs} required readOnly />
          </div>
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Vehicle Charge" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedVehicleCost} required readOnly />
          </div>
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Margin" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedMargin} required readOnly />
          </div>
        </div>

        <div className="mbsc-row">
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Overhead Charge" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedOverheadCost} required readOnly />
          </div>
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Labor Charge" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedLabourCost} required readOnly />
          </div>
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Total Cost" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedTotalCost} required readOnly />
          </div>
          <div className="mbsc-col-md-3 mbsc-col-3">
            <Input label="Total Profit" inputStyle="box" className="InputBoxText" labelStyle="floating" value={formattedData.formattedTotalProfit} required readOnly />
          </div>
        </div>
      </div>
    </Page>
  );
}

export default BidTable;
