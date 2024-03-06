import { useState } from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import {
  RiHome4Line,
  RiMessage2Line,
  RiFileEditLine,
  RiPriceTag2Line,
  RiExpandRightLine,
  RiExpandLeftLine,
  RiSettings4Line,
  RiMoneyDollarBoxLine
} from "react-icons/ri";
import {
  Homepage,
  Costing,
  Pricing,
  Quotation,
  BidFeedback
} from "../Pages/allPages.js"
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarFooter
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./styles.css";






function Sidebars({ onSidebarItemClick, onCollapseChange, onSettingsButtonClick, selectedMenuItem, selectedBid }) {
  const [collapsed, setCollapsed] = useState(true);
  const [toggled] = useState(false);

  const message = `Project Costing, Pricing & Quoting - Bid #${selectedBid}`;
  //console.log(message);

  const menuItems = [
    { title: "Home", headerTitle: 'Project Costing, Pricing & Quoting - Home', icon: <RiHome4Line />, path: '/Homepage', component: "Homepage" },
    { title: "Costing", headerTitle: message, icon: <RiMoneyDollarBoxLine />, path: '/Costing', component: "Costing" },
    { title: "Pricing", headerTitle: message, icon: <RiPriceTag2Line />, path: '/Pricing', component: "Pricing" },
    { title: "Quotation", headerTitle: message, icon: <RiFileEditLine />, path: '/Quotation', component: "Quotation" },
    { title: "Bid Feedback", headerTitle: message, icon: <RiMessage2Line />, path: '/BidFeedback', component: "BidFeedback" },
  ];

  const handleCollapsedChange = () => {
    const newCollapsed = !collapsed;
    setCollapsed(!collapsed);
    onCollapseChange(newCollapsed);
  };

  const handleSidebarItemClick = (id, title, component) => {
    onSidebarItemClick(title, component, id);
  };

 


  return (
    <Router>
      <div>
        <ProSidebar
          className={`app ${toggled ? "toggled" : ""}`}
          style={{ height: "calc(100% - 41.59px)", position: "absolute" }} //adjusted to account for the header
          collapsed={collapsed}
          toggled={toggled}
        >
          <main>
            <Menu>
              {collapsed ? (
                <MenuItem
                  icon={<RiExpandRightLine />}
                  onClick={handleCollapsedChange}
                ></MenuItem>
              ) : (
                <MenuItem
                  suffix={<RiExpandLeftLine />}
                  onClick={handleCollapsedChange}
                >
                  <div
                    style={{
                      padding: "9px",
                      fontWeight: "bold",
                      fontSize: 14,
                      letterSpacing: "1px"
                    }}
                  >
                    Menu
                  </div>
                </MenuItem>
              )}
              <hr />
            </Menu>
            <Menu>

              {menuItems.map((menuItem, index) => (
                <MenuItem
                  key={index}
                  icon={menuItem.icon}
                  onClick={() => handleSidebarItemClick(index, menuItem.headerTitle, menuItem.component)}
                  style={{
                    color: selectedMenuItem === index ? 'blue' : 'inherit'
                  }}
                >
                  <NavLink to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>{menuItem.title}</NavLink>
                </MenuItem>
              ))}
            </Menu>



          </main>

          <SidebarFooter style={{ position: "absolute", bottom: 0, width: "100%" }}>
            <Menu>
              <MenuItem icon={<RiSettings4Line />}
                onClick={onSettingsButtonClick}
              >Settings

              </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>

      </div>
    </ Router>
  );
}

export default Sidebars;