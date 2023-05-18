import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BillSplitDetails from './BillSplitDetails';


const BillDetails = () => {


  const { bills } = useSelector(state => state);
  const { id } = useParams();
  const bill = bills.find(bill => bill.id === id);
  
  if(!bill){
    return null;
  }

  return (
    <div className='columns' >
      <div className="card">
        <h2 className="card-header">Bill Details</h2>
        <div className="card-body">
          <p>Bill: {bill.name}</p>
          <p>Amount: {bill.amount}</p>
          <p>Due Date: {bill.dueDate}</p>
          { bill.note && <p>Note: {bill.note}</p>}
        </div>
      </div>
      <div>
        <BillSplitDetails />
      </div>
    </div>
  );
  
};

export default BillDetails;