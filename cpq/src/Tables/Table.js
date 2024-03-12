import React, { useRef, useEffect } from "react";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
//import "tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

const Table = ({ tableProperties }) => {
  const tabulatorRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    // instantiate Tabulator when component is mounted
    tabulatorRef.current = new Tabulator(tableRef.current, tableProperties);

    // cleanup function to destroy the table when component is unmounted
    return () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.destroy();
        tabulatorRef.current = null;
      }
    };
  }, [tableProperties]); // Pass tableProperties as a dependency to useEffect

  return (
  <div>
  <div ref={tableRef}/>
  </div>
  )
}

export default Table;
