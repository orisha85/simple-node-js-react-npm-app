import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import BidTable from '../Forms/EditBidTable.js';
import CostSummary from '../Tables/CostSummary';
import CompBids from '../Tables/CompBids';
import BidPricingSummary from '../Forms/BidPricingSummary';
import { Panel, PanelGroup } from "react-resizable-panels";
import ResizablePanel from "./ResizablePanel.js";
import styles from './Pages.css';
import BidPricing from '../Tables/BidPricing.js';
import * as Helper from '../Tables/HelperCosting';
import { Button, Input, Page } from '@mobiscroll/react'; // Import the Table component
import Footer from '../Modules/Footer'
import Loading from './Loading'
import config_url from '../data/config_url';

function Pricing({ selectedBid, setSelectedBidVersion, selectedBidVersion, buttonText, setButtonText, isDisabled, setDisabled }) {
  //const [buttonText, setButtonText] = useState('Submit for Approval');
  const [totalBidPrice, setTotalBidPrice] = useState([]);
  const [PriceLoad, setPriceLoad] = useState(true);

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const onButtonClick = () => {
    let newText;
    console.log(buttonText)
    switch (buttonText) {
      case 'Edit':
        newText = 'Submit for Approval';
        setDisabled(false);
        updateProjectVersion(selectedBidVersion, "Is_Current", 0);
        setButtonText(newText);
        break;
      case 'Submit for Approval':
        newText = 'Approve';
        setDisabled(false);
        updateProjectVersion(selectedBidVersion, "Project_Lifecycle_CD", "P");
        setButtonText(newText);
        break;
      case 'Approve':
        newText = 'Edit';
        setDisabled(true);
        updateProjectVersion(selectedBidVersion, "Project_Lifecycle_CD", "AP");
        setButtonText(newText);
        break;
    }
  };

  const updateProjectVersion = async (projectVersion, fieldName, fieldValue) => {
    const formattedValue = typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue;
   // console.log(projectVersion + " This is the projectVersion being passed");
    const data = {
        field_name: fieldName,
        field_value: formattedValue
    };

    // abortControllerRef.current?.abort();
    // abortControllerRef.current = new AbortController();

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
        //signal: abortControllerRef.current?.signal,
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

  const handleBidPricingClick = () => {
    if (Helper.isTableEmpty("#bid-pricing")) {
      Helper.updateBidPricingTable()
    }
  };

  return (
    <div>
      <div style={{ display: !PriceLoad ? 'none' : 'inline' }}>
        <Loading />
      </div>
      <div style={{ display: PriceLoad ? 'none' : 'inline' }}>
        <div style={{ paddingBottom: '50px' }}>
          <Accordion defaultActiveKey={['0']} alwaysOpen style={{ height: '40%' }} className='custom-accordion'>
            <Accordion.Item eventKey="0" className='single-accordion'>
              <Accordion.Header>Bid Information</Accordion.Header>
              <Accordion.Body>
                <BidTable selectedBid={selectedBid} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className='single-accordion'>
              <Accordion.Header>Bid Pricing Summary</Accordion.Header>
              <Accordion.Body>
                <BidPricingSummary selectedBid={selectedBid} totalBidPrice={totalBidPrice} setTotalBidPrice={setTotalBidPrice} setPriceLoad={setPriceLoad} PriceLoad={PriceLoad} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className='single-accordion'>
              <Accordion.Header>Cost Summary</Accordion.Header>
              <Accordion.Body>
                <CostSummary isDisabled={isDisabled} selectedBid={selectedBid} setPriceLoad={setPriceLoad} PriceLoad={PriceLoad} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className='single-accordion'>
              <Accordion.Header onClick={handleBidPricingClick}>Bid Pricing / Comparable Bids</Accordion.Header>
              <Accordion.Body>
                <PanelGroup direction="horizontal">
                  <Panel
                    className={styles.Panel}
                    collapsible={true}
                    defaultSize={50}
                  >
                    <div style={{ textAlign: 'center', marginTop: '-5px', marginBottom: '12px' }}>Bid Pricing</div>
                    <BidPricing isDisabled={isDisabled} selectedBid={selectedBid} setTotalBidPrice={setTotalBidPrice} />
                  </Panel>
                  <ResizablePanel />
                  <Panel>
                    <div style={{ textAlign: 'center', marginTop: '-5px', marginBottom: '12px' }}>Comparable Bids</div>
                    <CompBids selectedBid={selectedBid} />
                  </Panel>
                </PanelGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <Footer>
          <div className="mbsc-button-group-block" style={{ marginLeft: '85%', fontSize: '14px', paddingRight: '8px' }}>
            <Button color="primary" onClick={onButtonClick}>{buttonText}</Button>
          </div>
        </Footer>
        </div>
      </div>
      );
}


      export default Pricing;
