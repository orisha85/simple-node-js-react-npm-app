import React, { useState, useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "./BidTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config_url from "../../data/config_url.js";
import Loading from '../Pages/Loading.js';

const BidTable = ({ setRedirectToCosting, setSelectedBid, setSelectedBidVersion, setSelectedBidLifecycle, setIsSidebarVisible, selectedBid }) => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const abortControllerRef = useRef(null);

  const el = useRef(null);
  let tabulator = useRef(null);
  //const [selectedBid, setSelectedBid] = useState(null);
  //const [projectStartDate, setProjectStartDate] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const resp = await fetch(`${config_url.url}/get_projects/smc`, {
          signal: abortControllerRef.current?.signal,
        });
        const projects = await resp.json();
        setTableData(projects);
      }
      catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted");
          return;
        }
        setError(err);
      }
      finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, []);
  
  function convertLifecycleCDToOrder(lifecycleCD) {
    switch (lifecycleCD) {
      case 'CR':
        return 1;
      case 'CO':
        return 2;
      case 'P':
        return 3;
      case 'AP':
        return 4;
      case 'AF':
        return 5;
      case 'OP':
        return 6;
      case 'DE':
        return 7;
      case 'CL':
        return 9;
      case 'V':
        return 99;
      default:
        return null;
    }
  } 

  useEffect(() => {
    if (el.current && !tabulator.current) {
      const columns = [
        { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: true },
        { title: 'Project Name', maxWidth: 400, field: 'Project_Name', headerFilter: "input", tooltip: true },
        { title: 'Bid #', field: 'Project_ID', headerFilter: "input", hozAlign: "center" },
        { title: 'Status', field: 'Status', headerFilter: "input", hozAlign: "center" },
        { title: 'State', field: 'State_CD', headerFilter: "input", hozAlign: "center" },
        { title: 'Region/Country', field: 'TownCounty_Desc', headerFilter: "input" },
        { title: 'Bid Type', field: 'Project_Type', headerFilter: "input" },
        {
          title: 'Bid Amount', field: 'Project_Value', headerFilter: "input", formatter: "money", hozAlign: "center",
          formatterParams: {
            symbol: "$",
            precision: 2,
          },
        },
        {
          title: 'Created Date',
          field: 'CreatedDate',
          headerFilter: "input",
          formatter: function (cell) {
            const startDate = new Date(cell.getValue());
            const formattedStartDate = startDate.toISOString().split('T')[0];
            return formattedStartDate;

          }
        },
      ];

      tabulator.current = new Tabulator(el.current, {
        responsiveLayoutCollapseStartOpen: false,
        data: tableData,
        columns: columns,
        responsiveLayout: "collapse",
        resizableColumnFit: true,
        autoResize: true,
        pagination: "local",
        paginationSize: 15,
        paginationSizeSelector: [10, 15, 20, 25],
        reactiveData: true,
        initialSort: [ // Set initial sort order by 'Bid#' field in descending order
          { column: 'Project_ID', dir: 'desc' }
        ]
      });

      if (tabulator.current) {
        tabulator.current.on("rowClick", function (e, row) {
          const rowData = row.getData(); // Get the data of the clicked row
          const selectedBid = rowData['Project_ID']; // Extract the Bid# from the row data
          const selectedBidVersion = rowData['Current_Project_Version_ID']; // Extract the current Bid# from the row data
          let selectedBidLifecycle = rowData['Project_Lifecycle_CD'];
          console.log(selectedBidLifecycle + " This is being extracted");
          selectedBidLifecycle = convertLifecycleCDToOrder(selectedBidLifecycle);
          setSelectedBid(selectedBid);
          setSelectedBidVersion(selectedBidVersion);
          setSelectedBidLifecycle(selectedBidLifecycle);
          setRedirectToCosting(true); // Set the state to redirect
          setIsSidebarVisible(true);
        });
      }
    } else {
      tabulator.current.setData(tableData);
    }

    return () => {
      if (tabulator.current) {
        tabulator.current.destroy();
        tabulator.current = null;
      }
    };
  }, [tableData, setRedirectToCosting, setIsSidebarVisible]);

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
      <div ref={el} className="CrudTable" />
    </div>
  );
};

export default BidTable;