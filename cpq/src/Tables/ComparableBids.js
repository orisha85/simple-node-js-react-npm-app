import React from "react";
import Table from "./CrudTable";

const BidTable = () => {
  const tableData = [
    { id: 1, name: 'John Doe', age: 25, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 30, city: 'Los Angeles' },
    { id: 3, name: 'Bob Johnson', age: 22, city: 'Chicago' },
  ];

  const columns = [
    { title: 'Bid ID', field: 'id'},
    { title: 'Project Name', field: 'name', editor: true },
    { title: 'Region', field: 'age', editor: true },
    { title: 'Type of Work', field: 'city', editor: true },
    { title: 'Bid Date', field: 'city', editor: true },
    { title: '$ Value', field: 'city', editor: true }
  ];

  const tableProperties = {
    history:true,
    data: tableData,
    reactiveData: true,
    columns: columns,
    layout: 'fitColumns',
    responsiveLayout: "collapse",
    resizableColumnFit: true,
    rowMouseEnter: function (e, row) {
      // Add custom styling on row hover if needed
      row.getElement().style.backgroundColor = '#eff5fb';
    },
    rowMouseLeave: function (e, row) {
      // Remove custom styling on row leave
      row.getElement().style.backgroundColor = '';
    },
    // Add any additional options or styling here
  }

  return (
      <Table tableProperties={tableProperties} style={{ fontSize: '14px' }}/>
  );
};

export default BidTable;