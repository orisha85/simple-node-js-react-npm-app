import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import BidTable from '../Tables/BidTable.js';
import Form from '../Forms/CreateEditBid.js';
import TabPanel from './TabPanel';
//import { BrowserRouter as Router } from 'react-router-dom';
import './Pages.css'
import { Costing } from "../Pages/allPages.js";

const Homepage = ({setSelectedBid, selectedBid,  onRowClick, setIsSidebarVisible, setSelectedBidVersion }) => {
  const [redirectToCosting, setRedirectToCosting] = useState(false);

  const handleTabChange = (index) => {
    //console.log('Selected tab index', index);
  };

  const message = `Project Costing, Pricing & Quoting - Bid #${selectedBid}`;
    //console.log(message);
    //onSaveButtonClick(message, "Pricing", 2)
  return (
    <div>
      {!redirectToCosting && (
        <TabPanel onTabChange={handleTabChange}>
          <div title="Create New Bid">
            <Form onRowClick={onRowClick}  setSelectedBid={setSelectedBid} setSelectedBidVersion={setSelectedBidVersion} selectedBid = {selectedBid} />
          </div>
          <div class='table' title="Select Existing Bid">
          <BidTable setIsSidebarVisible={setIsSidebarVisible} setRedirectToCosting={setRedirectToCosting} setSelectedBid={setSelectedBid} setSelectedBidVersion={setSelectedBidVersion} selectedBid = {selectedBid} />
          </div>
        </TabPanel>
      )}
      {redirectToCosting && onRowClick(message,"Costing",1)}
    </div>
  );
};

export default Homepage;