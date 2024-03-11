import 'bootstrap/dist/css/bootstrap.min.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Button, Input, Page, setOptions } from '@mobiscroll/react';
import React, { useState, useEffect } from 'react';
import './Forms.css';
import config_url from '../data/config_url';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});


function EditBidTable({ selectedBid }) {

  const [projectInfo, setProjectInfo] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState('');

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  
  useEffect(() => {
    if (selectedBid) {
      const fetchProjectInfo = async () => {
        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();

        try {
          const resp = await fetch(`${config_url.url}/get_project_information/smc/${selectedBid}`);
          const projectInfo = await resp.json();
          setProjectInfo(projectInfo);
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
    if (projectInfo.length > 0) {
      const startDate = new Date(projectInfo[0]?.Project_Start);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      setProjectStartDate(formattedStartDate);
    }
  }, [projectInfo]);

  return (
    <Page>
      <div className="mbsc-col-md-8 mbsc-col-xl-8 mbsc-form-grid mbsc-no-padding">
        <div className="mbsc-row">
        <div className="mbsc-col-3">
            <Input label="Bid Status" inputStyle="box" className="InputBoxText" labelStyle="floating" value={projectInfo[0]?.Status || ''} required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="State" inputStyle="box" className="InputBoxText" labelStyle="floating" value={projectInfo[0]?.State_CD || ''} required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="Type of Work" inputStyle="box" className="InputBoxText" labelStyle="floating" value={projectInfo[0]?.Quote_Type || ''} required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="Project Number" inputStyle="box" className="InputBoxText" labelStyle="floating" value={selectedBid || ''} required readOnly />
          </div>
        </div>

        <div className="mbsc-row">
          <div className="mbsc-col-3">
            <Input label="Bid ID" inputStyle="box" labelStyle="floating" className="InputBoxText" value={projectInfo[0]?.Project_ID || ''} required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="County/Region" inputStyle="box" labelStyle="floating" className="InputBoxText" value={projectInfo[0]?.TownCounty_Desc || ''} required readOnly />
          </div>  
          <div className="mbsc-col-3">
            <Input label="Project Start" inputStyle="box" labelStyle="floating" className="InputBoxText" value={projectStartDate || ''} required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="Project Name" inputStyle="box" labelStyle="floating" className="InputBoxText" value={projectInfo[0]?.Project_Name || ''} required readOnly />
          </div>
        </div>

        <div className="mbsc-row">
          <div className="mbsc-col-3">
            <Input label="Notes" inputStyle="box" labelStyle="floating" className="InputBoxText" required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="Job Type" inputStyle="box" labelStyle="floating" value={projectInfo[0]?.Project_Type || ''} className="InputBoxText" required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="Service Hub" inputStyle="box" labelStyle="floating" value={projectInfo[0]?.Service_Hub || ''} className="InputBoxText" required readOnly />
          </div>
          <div className="mbsc-col-3">
            <Input label="Duration" inputStyle="box" labelStyle="floating" value={projectInfo[0]?.Duration || ''} className="InputBoxText" required readOnly />
          </div>
        </div>
      </div>

      {/* <div className="mbsc-button-group-block" style={{ marginLeft: '40%', marginRight: '40%' }}>
        <Button color="primary">Save Bid</Button>
      </div> */}
    </Page>
  );
};

export default EditBidTable;
