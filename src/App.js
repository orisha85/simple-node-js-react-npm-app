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


// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.set('port', process.env.PORT || 5000);

// console.log("+++++++++++++++"+ app.get('port'));

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;

// app.listen(app.get('port'), function(){
//           console.log('Express server listening on port ' + app.get('port'));
//           });

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

  const handleSidebarItemClick = (newTitle, pageName, menuItem) => {
    setPageTitle(newTitle);
    setActivePage(pageName);
    setSelectedMenuItem(menuItem)
  };

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
        onRowClick={handleSidebarItemClick} />;
      case "Costing":
        return <Costing 
        selectedBid={selectedBid}
        selectedBidVersion={selectedBidVersion}
        onSaveButtonClick={handleSidebarItemClick}
       isDisabled={tableDisabled}
       />;
      case "Pricing":
        return <Pricing
          selectedBid={selectedBid}
          buttonText={buttonText}
          setButtonText={setButtonText}
          isDisabled={tableDisabled}
          setDisabled={setTableDisabled}
          selectedBidVersion={selectedBidVersion}
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