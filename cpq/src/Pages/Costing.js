import React, { useState, useEffect, useRef } from "react";
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from '../Forms/EditBidTable';
import MaterialCost from '../Tables/MaterialCost';
import LaborCost from '../Tables/LaborCost';
import BidPricing from '../Forms/BidPricingSummary';
import CostSummary from '../Tables/CostSummary';
import ComparableBids from '../Tables/ComparableBids';
import { Input, Page, Confirm } from '@mobiscroll/react'; // Import the Table 
import { Button } from '@mobiscroll/react'
import * as Helper from '../Tables/HelperCosting';
import { TabulatorFull as Tabulator } from "tabulator-tables";
import Loading from './Loading'
import Footer from '../Modules/Footer'
import config_url from '../data/config_url';

function Costing({selectedBid, selectedBidVersion, onSaveButtonClick, isDisabled, isAlertOpen, setAlertOpen, pageDestination, selectedBidLifecycle, setSelectedBidLifecycle}) {

  const [projectVersion, setProjectVersion] = useState([]);
  const [driveDistance, setDriveDistance] = useState([]);
  const [costMobalization, setCostMobalization] = useState([]);
  const driveDistanceRef = useRef(driveDistance);


  //const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const [MaterialLoad, setMaterialLoad] = useState(true);

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  

  const abortControllerRef = useRef(null);
  const alert = () => setAlertOpen(true);

  const closeAlert = (proceed) => {
    setAlertOpen(false);
    if (proceed) {
      onSaveButtonClick(pageDestination[0], pageDestination[1], pageDestination[2]);
    }
  };

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
    if(projectVersion.length > 0) {
      const fetchDropdownData = async () => {
        const requestUrls = [
          `${config_url.url}/lookup_drivedistance/smc/${projectVersion[0]?.Service_Hub}/${projectVersion[0]?.TownCounty_Desc}`,
          `${config_url.url}/get_projectCostMobalization/smc/${projectVersion[0]?.Current_Project_Version_ID}`,
        ];
        
        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();

        setLoad(true);
    
        try {
          const responses = [];
          for (const requestUrl of requestUrls) {
            const resp = await fetch(requestUrl);
            const data = await resp.json();
            responses.push(data)
          }
          const [drive_distance, cost_mob] = responses;
          setDriveDistance(drive_distance);
          setCostMobalization(cost_mob)
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoad(false)
        }
      };
    
      fetchDropdownData();
    }
  }, [projectVersion]);

  useEffect(() => {
    if (driveDistance)
      driveDistanceRef.current = driveDistance[0]?.Distance_Hour;
  }, [driveDistance]);

  const handleLaborCostClick = () => {
    if (Helper.isTableEmpty("#labor-cost") && costMobalization) {
      //console.log("Drive", driveDistanceRef.current)
      Helper.updateLaborCostTable(driveDistanceRef.current, costMobalization)
    }
  };

  //const MaterialTable = Tabulator.findTable("#material-cost")[0].getData();

//   const patchProjectData = async (endpoint, data) => {
//     const replacer = (key, value) =>
//       typeof value === 'undefined' ? null : value;
      
//       try {
//           const options = {
//               method: 'PATCH',
//               headers: {
//                   'Content-Type': 'application/json',
//                   'Accept': 'application/json',
//               },
//               body: JSON.stringify(data, replacer),
//           };
//           console.log("JSON for body ", options.body);
//           const response = await fetch(endpoint, options); 
//       } catch (error) {
//         console.error("Error patching data:", error);
//       }
// };

  const updateProjectVersion = async (projectVersion, fieldName, fieldValue) => {
    const formattedValue = typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue;
   // console.log(projectVersion + " This is the projectVersion being passed");
    const data = {
        field_name: fieldName,
        field_value: formattedValue
    };

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const replacer = (key, value) =>
      typeof value === 'undefined' ? null : value;

    // Assuming patchData is an existing function that sends a PATCH request.
    //patchProjectData(`/update_projectVersion/${projectVersion}`, data);
    //setIsSending(true);

    try {
      const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data, replacer),
        signal: abortControllerRef.current?.signal,
      };
      
      const response = await fetch(`${config_url.url}/update_projectVersion/${projectVersion}`, options); 
    } 
    catch (err) {
      setError(err);
      console.error("Error patching data:", err);
    }
    finally {
      //setIsSending(false)
    }
  };

  const handleSaveClick = async () => {
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
      if (obj.Mob_Override == null) {
        obj['Mob_Override'] = null;
      }
      if (obj.Labour_Hours_Override == null) {
        obj['Labour_Hours_Override'] = null;
      }
      if (obj.Type == null) {
        obj['Type'] = "";
      }
      return obj;
    });

    var materialCostTableDataFixed = materialCostTableData.map(obj => {
      if (obj.Mob_Override == null) {
        obj['Mob_Override'] = null;
      }
      if (obj.Labour_Hours_Override == null) {
        obj['Labour_Hours_Override'] = null;
      }
      if (obj.Type == null) {
        obj['Type'] = "";
      }
      return obj;
    });

    // Function to handle the fetch request after patch requests
    const fetchDataAfterPatch = async () => {
      const updateCostLine = async (data) => {
        //setIsSending(true);
        try {
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
            //signal: abortControllerRef.current?.signal,
          };
          
          const response = await fetch(`${config_url.url}/merge_projectCostLineItem`, options); 
        } 
        catch (err) {
          setError(err);
          console.error("Error posting data on material cost:", err);
        }
        finally {
          //setIsSending(false)
        }
        //patchData(`/merge_projectCostMobalization`, data);
        //patchData(`/merge_projectCostLineItem`, data);
      };
      const updateCostMob = async (data) => {
        //setIsSending(true);
        try {
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
            //signal: abortControllerRef.current?.signal,
          };
          
          const response = await fetch(`${config_url.url}/merge_projectCostMobalization`, options); 
        } 
        catch (err) {
          setError(err);
          console.error("Error posting data on labour hours:", err);
        }
        finally {
          //setIsSending(false)
        }
        //patchData(`/merge_projectCostMobalization`, data);
      };
      const updateProjectVersion = async (projectVersion, fieldName, fieldValue) => {
        const formattedValue = typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue;
       // console.log(projectVersion + " This is the projectVersion being passed");
        const data = {
            field_name: fieldName,
            field_value: formattedValue
        };
        // Assuming patchData is an existing function that sends a PATCH request.
        try {
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
            //signal: abortControllerRef.current?.signal,
          };
          
          const response = await fetch(`${config_url.url}/update_projectVersion/${projectVersion}`, options); 
        } 
        catch (err) {
          setError(err);
          console.error("Error posting data on labour hours:", err);
        }
        finally {
          //setIsSending(false)
        }
      }
      const lifecycleCD = "Project_Lifecycle_CD";
      const lifecycleState = "CO";
      await updateCostMob(laborCostTableDataFixed);
      await updateCostLine(materialCostTableDataFixed); 
      if (selectedBidLifecycle <= 2) {
        await updateProjectVersion(projectVersion[0]?.Current_Project_Version_ID, lifecycleCD, lifecycleState);
      }
      
      const postData = async () => {
        //setIsSending(true);
        try {
          const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            //signal: abortControllerRef.current?.signal,
          };
          
          const response = await fetch(`${config_url.url}/exec_projectPriceLine/${projectVersion[0]?.Current_Project_Version_ID}`, options); 
        } 
        catch (err) {
          setError(err);
          console.error("Error patching data on labour hours:", err);
        }
        finally {
          //setIsSending(false)
        }
      };
      await postData();
    };

    await fetchDataAfterPatch();
    if (selectedBidLifecycle === 1) {
      setSelectedBidLifecycle(99); // Trigger useEffect once
    } else {
      onSaveButtonClick(`Project Costing, Pricing & Quoting - Bid #${selectedBid}`, "Pricing", 2);
    }    
  };

  useEffect(() => {
    if (selectedBidLifecycle === 99) {
      setSelectedBidLifecycle(2);
      onSaveButtonClick(`Project Costing, Pricing & Quoting - Bid #${selectedBid}`, "Pricing", 2);
    }    
  }, [selectedBidLifecycle]); 

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        Error: Please refresh
      </div>
    )
  }

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
                <MaterialCost selectedBid={selectedBid} isDisabled={isDisabled} setMaterialLoad={setMaterialLoad} MaterialLoad={MaterialLoad} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className='single-accordion'>
              <Accordion.Header onClick={handleLaborCostClick}>Labor Cost</Accordion.Header>
              <Accordion.Body>
                <LaborCost selectedBid={selectedBid} isDisabled={isDisabled}/>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
          <Confirm
          isOpen={isAlertOpen}
          onClose={closeAlert}
          title="Data is not saved!"
          message="Are you sure you want to proceed without saving your changes?"
          okText= "Proceed"
          cancelText= "Dismiss"
          />
          <Footer>
          <div className="mbsc-button-group-block" style={{ marginLeft: '85%', marginRight: '0%', fontSize: '14px', paddingRight: '7px' }}>
            <Button color="primary" onClick={handleSaveClick}>Save & Proceed</Button>
          </div>
          </Footer>
        </div>
    </div>

  );
}

export default Costing;
