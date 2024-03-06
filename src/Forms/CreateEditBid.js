import React, { useState, useEffect, useRef } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Button, Input, Dropdown, Page, setOptions } from '@mobiscroll/react';
import './Forms.css';
import Loading from '../Pages/Loading'
import config_url from '../data/config_url';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

function CreateEditBid({onRowClick, setSelectedBid, setSelectedBidVersion, selectedBid}) {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [region, setRegion] = useState([]);
  const [townCounty, setTownCounty] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [bidType, setBidType] = useState([]);
  const [serviceHub, setServiceHub] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTownCounty, setSelectedTownCounty] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedServiceHub, setSelectedServiceHub] = useState('');
  const [selectedBidType, setSelectedBidType] = useState('');
  const [formData, setFormData] = useState({}); // State to hold form data

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const requestUrls = [
        `${config_url.url}/get_lov_state/smc`,
        `${config_url.url}/get_lov_region/smc`,
        `${config_url.url}/get_lov_town/smc`,
        `${config_url.url}/get_lov_jobtype/smc`,
        `${config_url.url}/get_lov_bidtype/smc`,
        `${config_url.url}/get_lov_service_hub/smc`,
      ];
      
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
  
      try {
        const responses = [];
        for (const requestUrl of requestUrls) {
          const resp = await fetch(requestUrl, {
            signal: abortControllerRef.current?.signal,
          });
          const data = await resp.json();
          responses.push(data)
        }
        const [state, region, town, jobtype, bidtype, service_hub] = responses;
        setStates(state);
        setRegion(region);
        setTownCounty(town);
        setProjectType(jobtype);
        setBidType(bidtype);
        setServiceHub(service_hub);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDropdownData();
  }, []);  

  useEffect(() => {
    if (selectedState) {
      const fetchRegion = async () => {
        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();
  
        try {
          const resp = await fetch(`${config_url.url}/get_lov_region_state/smc/${selectedState}`);
          const regions = await resp.json();
          setRegion(regions);
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
      
      fetchRegion();
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedRegion) {
      const fetchTown = async () => {
  
        try {
          console.log(selectedRegion);
          const resp = await fetch(`${config_url.url}/get_lov_town_region/smc/${selectedRegion}`);
          const towns = await resp.json();
          console.log(towns);
          setTownCounty(towns);
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
      
      fetchTown();
    }
  }, [selectedRegion]);

  // Function to handle form field changes and update formData
  const handleInputChange = (name, value, desc) => {
    setFormData({ ...formData, [name]: value, [`${name}_desc`]: desc });
  };

  const handleSubmit = async () => {
    const newProjectId = 0
    const newProjectVersionId = 0
    try {
      // Fetch the new project ID
      const response = await fetch(`${config_url.url}/create_new_project_id`);
      const data = await response.json();
  
      // // Update formData with the new project ID
      const newProjectId = data.projectId;
      const newProjectVersionId = parseInt(data.projectId)*10+1;
      // const formDataWithProjectId = {
      //   ...formData,
      //   projectId: newProjectId
      // };
      // Send formData with the updated project ID to the endpoint 
      const mergeResponse = await fetch(`${config_url.url}/merge_project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // Handle mergeResponse as needed
      console.log("Project Details:",JSON.stringify(formData))
      console.log('Merge Project Response:', mergeResponse);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setSelectedBid(newProjectId);
    setSelectedBidVersion(newProjectVersionId);
    onRowClick('Project Costing, Pricing & Quoting',"Costing",1);
  };

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
        Error: Please refresh!
      </div>
    )
  }

  return (
    <div>
      <Page>
        <div className='mbsc-row justify-content-left' style={{ marginLeft: '20%', marginRight: '20%' }}>
          <div className='mbsc-col'>
          <label className='mbsc-col' style={{ paddingTop: '20px', textAlign: 'center' }}>
            <span style={{ color: 'red' }}>*</span> Required Fields
          </label>

            <Input
              label="Project Name *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              placeholder="Enter the project name"
              required
              maxLength="50"
              onChange={(event) => handleInputChange('projectName', event.target.value)}
            />

            <Dropdown
              label="State *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              required
              value={selectedState}
              onChange={(event) => {
                event && setSelectedState(event.target.value);
                handleInputChange('state', event.target.value, event.target.options[event.target.selectedIndex].getAttribute('desc')); // Update formData
              }}
            >
              <option value="">Select Project State</option>
              {states.length > 0 && states.map((state) => (
                <option key={state.ReferenceValueItem_CD} value={state.Item_CD} desc={state.Item_CD}>
                  {state.Item_CD}
                </option>
              ))}
            </Dropdown>

            <Dropdown
              label="Region *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              required
              value={selectedRegion}
              onChange={(event) => {
                event && setSelectedRegion(event.target.value);
                handleInputChange('region', event.target.value, event.target.options[event.target.selectedIndex].getAttribute('desc')); // Update formData
              }}
            >
              <option value="">Select Region</option>
              {region.length > 0 && region.map((region) => (
                <option key={region.ReferenceValueItem_CD} value={region.Item_CD} desc={region.Item_Desc}>
                  {region.Item_Desc}
                </option>
              ))}
            </Dropdown>

            <Dropdown
              label="Town/County *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              required
              value={selectedTownCounty}
              onChange={(event) => {
                event && setSelectedTownCounty(event.target.value);
                handleInputChange('townCounty', event.target.value, event.target.options[event.target.selectedIndex].getAttribute('desc')); // Update formData
              }}
            >
              <option value="">Select Town/County</option>
              {townCounty.length > 0 && townCounty.map((townCounty) => (
                <option key={townCounty.ReferenceValueItem_CD} value={townCounty.Item_CD} desc={townCounty.Item_Desc}>
                  {townCounty.Item_Desc}
                </option>
              ))}
            </Dropdown>

            <Dropdown
              label="Bid Type *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              required
              value={selectedBidType}
              onChange={(event) => {
                event && setSelectedBidType(event.target.value);
                handleInputChange('bidType', event.target.value, event.target.options[event.target.selectedIndex].getAttribute('desc')); // Update formData
              }}
            >
              <option value="">Select Bid Type</option>
              {bidType.length > 0 && bidType.map((bidType) => (
                <option key={bidType.ReferenceValueItem_CD} value={bidType.Item_CD} desc={bidType.Item_Desc}>
                  {bidType.Item_Desc}
                </option>
              ))}
            </Dropdown>
            
        <Dropdown
              label="Project Type *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              required
              value={selectedProjectType}
              onChange={(event) => {
                event && setSelectedProjectType(event.target.value);
                handleInputChange('projectType', event.target.value, event.target.options[event.target.selectedIndex].getAttribute('desc')); // Update formData
              }}
            >
              <option value="">Select Project Type</option>
              {projectType.length > 0 && projectType.map((projectType) => (
                <option key={projectType.ReferenceValueItem_CD} value={projectType.Item_CD} desc={projectType.Item_Desc}>
                  {projectType.Item_Desc}
                </option>
              ))}
            </Dropdown>

            <Dropdown
              label="Service Hub *"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              required
              value={selectedServiceHub}
              onChange={(event) => {
                event && setSelectedServiceHub(event.target.value);
                handleInputChange('serviceHub', event.target.value, event.target.options[event.target.selectedIndex].getAttribute('desc')); // Update formData
              }}
            >
              <option value="">Select Service Hub</option>
              {serviceHub.length > 0 && serviceHub.map((serviceHub) => (
                <option key={serviceHub.ReferenceValueItem_CD} value={serviceHub.Item_Desc} desc={serviceHub.Item_Desc}>
                  {serviceHub.Item_Desc}
                </option>
              ))}
            </Dropdown>
          </div>
          <div className='mbsc-col'>
            <label className='mbsc-col' style={{ paddingTop: '20px', textAlign: 'center' }}> Optional Fields</label>

            <Input
              label="Project Start"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              placeholder="Project Start"
              maxLength="10"
              onChange={(event) => handleInputChange('projectStart', event.target.value)}
            />

            <Input
              label="Duration"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              placeholder="Duration"
              maxLength="10"
              onChange={(event) => handleInputChange('Duration', event.target.value)}
            />

            <Input
              label="Project Number"
              inputStyle="box" className="InputBoxTextBigger"
              labelStyle="floating"
              placeholder="Enter project number"
              maxLength="7"
              onChange={(event) => handleInputChange('projectNumber', event.target.value)}
            />
          </div>
        </div>

        <div className="mbsc-button-group-block" style={{ marginLeft: '40%', marginRight: '40%' }}>
          <Button color="primary" onClick={handleSubmit}>Create Bid</Button>
        </div>
      </Page>
    </div>
  );
}

export default CreateEditBid;
