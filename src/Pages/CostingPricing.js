import React, { useState, useEffect, useRef } from "react";
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from '../Forms/EditBidTable';
import MaterialCost from '../Tables/MaterialCost';
import LaborCost from '../Tables/LaborCost';
import BidPricing from '../Forms/BidPricingSummary';
import CostSummary from '../Tables/CostSummary';
import ComparableBids from '../Tables/ComparableBids';
import { Input, Page } from '@mobiscroll/react'; // Import the Table 
import { Button } from '@mobiscroll/react'
import * as Helper from '../Tables/HelperCosting';
import { TabulatorFull as Tabulator } from "tabulator-tables";
import Loading from './Loading'
import Footer from '../Modules/Footer'

function CostingPricing({selectedBid, selectedBidVersion, onSaveButtonClick, isDisabled}) {


  const onButtonClick = () => {
    console.log('Save button clicked');
    const message = `Project Costing, Pricing & Quoting - Bid #${selectedBid}`;
    
    onSaveButtonClick(message, "Pricing", 2)
  };

  const [projectVersion, setProjectVersion] = useState([]);
  const [driveDistance, setDriveDistance] = useState([]);
  const [costMobalization, setCostMobalization] = useState([]);
  const driveDistanceRef = useRef(driveDistance);
  //const costMobalizationRef = useRef(costMobalization);
  //const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const [MaterialLoad, setMaterialLoad] = useState(true);

  //console.log("Costing Pricing", MaterialLoad);


  useEffect(() => {
    if (selectedBid) {
      fetchData(`/get_project_information/smc/${selectedBid}`, setProjectVersion);
    }
  }, [selectedBid]);

  useEffect(() => {
    if (projectVersion.length > 0) {
      Promise.all([
        fetchData(`/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`, setDriveDistance)
        .then(() => fetchData(`/get_projectCostMobalization/smc/${projectVersion[0]?.Current_Project_Version_ID}`, setCostMobalization))
      ])
        .finally(() => setLoad(false));

    }
  }, [projectVersion]);

  useEffect(() => {
    if (driveDistance)
      driveDistanceRef.current = driveDistance[0]?.Distance_Hour;

  }, [driveDistance]);

  //console.log("Costing Pricing", driveDistance);

  const fetchData = async (endpoint, setdata) => {
    try {
      const response = await fetch(endpoint);
      const jsonData = await response.json();
      if (jsonData) {
        setdata(jsonData);
      }

      //console.log("Project", groupOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLaborCostClick = () => {
    if (Helper.isTableEmpty("#labor-cost")) {
      //console.log("Drive", driveDistanceRef.current)
      Helper.updateLaborCostTable(driveDistanceRef.current, costMobalization)
    }
  };

  //const MaterialTable = Tabulator.findTable("#material-cost")[0].getData();

  const patchProjectData = async (endpoint, data) => {
    const replacer = (key, value) =>
      typeof value === 'undefined' ? null : value;
      
    try {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data, replacer),
        };
        console.log("JSON for body ", options.body);
        const response = await fetch(endpoint, options); 
    } catch (error) {
      console.error("Error patching data:", error);
    }
};

  const updateProjectVersion = async (projectVersion, fieldName, fieldValue) => {
    const formattedValue = typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue;
   // console.log(projectVersion + " This is the projectVersion being passed");
    const data = {
        field_name: fieldName,
        field_value: formattedValue
    };
    // Assuming patchData is an existing function that sends a PATCH request.
    patchProjectData(`/update_projectVersion/${projectVersion}`, data);
  };

  const handleSaveClick = () => {
    const materialCostTable = Tabulator.findTable("#material-cost")[0];
    const laborCostTable = Tabulator.findTable("#labor-cost")[0];
    var materialCostTableData = materialCostTable.getData();
    var laborCostTableData = laborCostTable.getData();

    //Add Line_ID to material cost
    materialCostTableData.forEach((obj, index) => obj.Line_ID = index + 1);

    //Add Project_Version to material and labor cost
    materialCostTableData.forEach(obj => obj.Project_Version_ID = projectVersion[0]?.Current_Project_Version_ID); //selectedBidVersion);
    laborCostTableData.forEach(obj => obj.Project_Version_ID = projectVersion[0]?.Current_Project_Version_ID); //selectedBidVersion);

    var laborCostTableDataFixed = laborCostTableData.map(obj => {
      if (obj.Mob_Override == 0) {
        obj['Mob_Override'] = null;
      }
      if (obj.Labour_Hours_Override == 0) {
        obj['Labour_Hours_Override'] = null;
      }
      if (obj.Type == null) {
        obj['Type'] = "";
      }
      return obj;
    });

    var materialCostTableDataFixed = materialCostTableData.map(obj => {
      if (obj.Mob_Override == 0) {
        obj['Mob_Override'] = null;
      }
      if (obj.Labour_Hours_Override == 0) {
        obj['Labour_Hours_Override'] = null;
      }
      if (obj.Type == null) {
        obj['Type'] = "";
      }
      return obj;
    });

    

    // Function to handle the fetch request after patch requests
    const fetchDataAfterPatch = async () => {
      const updateCostMob = async (data) => {
        patchData(`/merge_projectCostMobalization`, data);
      };
      const updateCostLine = async (data) => {
        patchData(`/merge_projectCostLineItem`, data);
      };

      await Promise.all([updateCostMob(laborCostTableDataFixed), updateCostLine(materialCostTableDataFixed)]); // Assuming dataForMob and dataForLine are defined elsewhere
      
      await postData(`/exec_projectPriceLine/${projectVersion[0]?.Current_Project_Version_ID}` ); // Replace '/your-fetch-endpoint' with the actual endpoint and setData with your state update function
    };

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


    const patchData = async (endpoint, data) => {
      const replacer = (key, value) =>
        typeof value === 'undefined' ? null : value;

      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data, replacer),
        };
        //console.log("JSON for body ", options.body);
        const response = await fetch(endpoint, options);
      } catch (error) {
        console.error("Error patching data:", error);
      }
    };
    //updateCostLine(materialCostTableDataFixed);
    //updateCostMob(laborCostTableDataFixed);
    fetchDataAfterPatch();
    const message = `Project Costing, Pricing & Quoting - Bid #${selectedBid}`;
    //console.log(message);
    onSaveButtonClick(message, "Pricing", 2)
    //onSaveButtonClick('Project Costing, Pricing & Quoting', "Pricing", 2)
  };

  return (
    <div>
      <div style={{ display: !MaterialLoad ? 'none' : 'inline' }}> 
        <Loading />
      </div>
      <div style={{ display: MaterialLoad ? 'none' : 'inline' }}>
        <div style={{ paddingBottom: '50px' }}>
          <Accordion defaultActiveKey={['0']} alwaysOpen className='custom-accordion'>
            <Accordion.Item eventKey="0" className='single-accordion'>
              <Accordion.Header>Bid Information</Accordion.Header>
              <Accordion.Body>
                <Table selectedBid={selectedBid} />
              </Accordion.Body>
            </Accordion.Item>
            {/* <Accordion.Item eventKey="1">
          <Accordion.Header>Bid Pricing Summary</Accordion.Header>
          <Accordion.Body>
            <BidPricing />
          </Accordion.Body>
        </Accordion.Item> */}
            <Accordion.Item eventKey="1" className='single-accordion'>
              <Accordion.Header>Material Cost</Accordion.Header>
              <Accordion.Body>
                <MaterialCost selectedBid={selectedBid} setMaterialLoad={setMaterialLoad} MaterialLoad={MaterialLoad} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className='single-accordion'>
              <Accordion.Header onClick={handleLaborCostClick}>Labor Cost</Accordion.Header>
              <Accordion.Body>
                <LaborCost selectedBid={selectedBid} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
          <Footer>
          <div className="mbsc-button-group-block" style={{ marginLeft: '85%', marginRight: '0%', fontSize: '14px', paddingRight: '7px' }}>
            <Button color="primary" onClick={handleSaveClick}>Save & Proceed</Button>
          </div>
          </Footer>
        </div>
    </div>

  );
}

export default CostingPricing;
