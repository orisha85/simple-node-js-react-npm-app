import React, { useRef, useEffect } from "react";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator_bootstrap3.min.css";
//import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { RiArrowGoBackLine, RiArrowGoForwardLine, RiMenuAddLine  } from "react-icons/ri";
import { LuSave } from "react-icons/lu";
import { Button } from 'react-bootstrap';
import './BidTable.css';


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
      <div className="d-flex justify-content-end align-items-center mb-1">
        {/* <Button variant="light" onClick={() => tabulatorRef.current.undo()} className="mx-1">
          <RiArrowGoBackLine />
        </Button>
        <Button variant="light" onClick={() => tabulatorRef.current.redo()} className="mx-1">
          <RiArrowGoForwardLine />
        </Button>
        <Button onClick={() => console.log(tabulatorRef.current.getEditedCells())} className="mx-1">
         <LuSave/> Save
        </Button> */}
      </div>
      <div className="crudTable" ref={tableRef} />
      <div className="d-flex justify-content-end align-items-center mt-1">
        <Button variant="light" onClick={() => tabulatorRef.current.addRow()} className="mx-1">
          <RiMenuAddLine /> New
        </Button>
      </div>
    </div>
  );
}

export default Table;
