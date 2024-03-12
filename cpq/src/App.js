// App.js
import React, { useState } from 'react';
import Header from './Modules/Header';
import Sidebar from './Modules/Sidebar';
import Page from './Pages/Page';
import Homepage from './Pages/Homepage';
import SettingsModal from './Pages/SettingsModal';
import { createBrowserRouter, Route, NavLink, createRoutesFromElements } from 'react-router-dom'
import Costing from './Pages/Costing';
import Pricing from './Pages/Pricing'
import Quotation from './Pages/Quotation';
import BidFeedback from './Pages/BidFeedback';
/*
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/">
      <Route index element = {<Homepage/>} />
      <Route path="Costing" element={<Costing/>} />
      <Route path="Pricing" element={<Pricing/>} />
      <Route path="Quotation" element={<Quotation/>} />
      <Route path="Bid Feedback" element={<BidFeedback/>} />
    </Route>
  )
) */

function App() {
  
  const initialTitle = 'Project Costing, Pricing & Quoting - Home';
  const [pageTitle, setPageTitle] = useState(initialTitle);
  const [collapsed, setCollapsed] = useState(true);
  const [activePage, setActivePage] = useState("Homepage");
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedBid, setBid] = useState('');
  const [selectedBidVersion, setSelectedBidVersion] = useState('');
  const [tableDisabled, setTableDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Submit for Approval');
  const [isAlertOpen, setAlertOpen] = useState(false); // Navigation away from costing triggers save prompt
  const [costingDestination, setCostingDestination] = useState(['Project Costing, Pricing & Quoting', "Pricing", 2]); // Allows sidebar to pass navigation destination from costing page
  const [selectedBidLifecycle, setSelectedBidLifecycle] = useState('1');

  const handleSidebarItemClick = (newTitle, pageName, menuItem) => {
    if (selectedBidLifecycle >= menuItem) { 
      if (selectedMenuItem === 1) {
        setAlertOpen(true);
        const costingLocation = [...costingDestination];
        costingLocation[0] = newTitle;
        costingLocation[1] = pageName;
        costingLocation[2] = menuItem;
        setCostingDestination(costingLocation);
      } else {
        setPageTitle(newTitle);
        setActivePage(pageName);
        setSelectedMenuItem(menuItem)
      }
    }
  };

  const handleCostingNavigation = (newTitle, pageName, menuItem) => {
    setPageTitle(newTitle);
    setActivePage(pageName);
    setSelectedMenuItem(menuItem)
  }

  const handleCollapseChange = (newCollapsed) => {
    setCollapsed(newCollapsed);
  };

  const handleSettingsButtonClick = () => {
    setModalVisible(true); // Open the modal when the Settings button is clicked
  };

  const setSelectedBid = (bid) => {
    setBid(bid);
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "Homepage":
        return <Homepage setIsSidebarVisible={setIsSidebarVisible}
        selectedBid={selectedBid}
        setSelectedBid={setSelectedBid} 
        setSelectedBidVersion={setSelectedBidVersion}
        setSelectedBidLifecycle={setSelectedBidLifecycle}
        onRowClick={handleSidebarItemClick} />;
      case "Costing":
        return <Costing 
        selectedBid={selectedBid}
        selectedBidVersion={selectedBidVersion}
        setSelectedBidLifecycle={setSelectedBidLifecycle}
        selectedBidLifecycle={selectedBidLifecycle}
        onSaveButtonClick={handleCostingNavigation}
        isDisabled={tableDisabled}
        isAlertOpen={isAlertOpen}
        setAlertOpen={setAlertOpen}
        pageDestination={costingDestination}
       />;
      case "Pricing":
        return <Pricing 
        selectedBid={selectedBid}
        buttonText={buttonText}
        setButtonText={setButtonText}
        isDisabled={tableDisabled}
        setDisabled={setTableDisabled}
        selectedBidVersion={selectedBidVersion}
        setSelectedBidLifecycle={setSelectedBidLifecycle}
       />
      case "Quotation":
        return <Quotation />
      case "BidFeedback":
        return <BidFeedback />
      default:
        return <Homepage setIsSidebarVisible={setIsSidebarVisible} />;
    }
  };


  return (
    <div>
      <Header title={pageTitle} />
      {isSidebarVisible && <Sidebar
        selectedBid={selectedBid}
        onSidebarItemClick={handleSidebarItemClick}
        onCollapseChange={handleCollapseChange}
        onSettingsButtonClick={handleSettingsButtonClick}
        selectedMenuItem={selectedMenuItem}
      />}
      <Page collapsed={collapsed}>
        {renderActivePage()}
      </Page>
      <SettingsModal setShow={setModalVisible} show={modalVisible} />
    </div>
  );
}

export default App;