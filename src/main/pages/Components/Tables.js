import React, { useState, useEffect } from 'react';
import configData from "../../../config.json";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NumericFormat }  from 'react-number-format';
import { format } from 'date-fns';
import { useHistory } from "react-router-dom";

const MyTable = (props) => {
  const {docs} = props;
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(5);

  const navigate = (data) => {
    history.push({
      pathname: `/Document-Details/${data?._id}`,
      state: { data: data },
    });
  };


  // Define columns for the table
  const columns = [
    { 
      dataField: 'clientId.passport',
      text: 'Passport', 
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate(row); // Call your custom function with the row data
        }
      },
      formatter: (cell, row) => (
        <img  crossorigin="anonymous" 
          src={`${configData.TEXT_IMG}/${row.clientId.passport}`} 
          className="img-fluid tableImg" 
          alt="img"
        />
      )
    },
    { dataField: 'clientId.fullName', text: 'Client Name', 
    events: {
      onClick: (e, column, columnIndex, row, rowIndex) => {
        navigate(row); // Call your custom function with the row data
      }
    }, },
    { 
      dataField: 'estateId.name', 
      text: 'Estate/Layout', 
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate(row); // Call your custom function with the row data
        }
      }
   },

    { 
      dataField: 'amount', 
      text: 'Amount',  
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate(row); // Call your custom function with the row data
        }
      },
      formatter: (cell, row) => <NumericFormat
        value={row?.amount}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'₦ '}
        renderText={formattedValue => <span>{formattedValue}</span>}
  /> },

    { 
      dataField: 'dateOfPurchase', 
      text: 'Date',  
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate(row); // Call your custom function with the row data
        }
      },
      formatter:(cell, row) => format(new Date(row?.dateOfPurchase), 'do MMM yy')
    },

    { 
      dataField: 'paymentStatus', 
      text: 'Status',  
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate(row); // Call your custom function with the row data
        }
      },
      formatter:(cell, row) => <span className={row?.paymentStatus == 'success' ? "completed" : "pendingStatus"}>{row?.paymentStatus == 'success' ? "completed" : "pending"}</span>},
  ];

  

  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={docs}
        columns={columns}
        pagination={paginationFactory()}/>
    </div>
  );
};

export default MyTable;
