import React, { useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { deleteBill } from '../store';

const BillList = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bills } = useSelector( state => state );

  const destroy = (bill) => {
    dispatch(deleteBill(bill));
    navigate('/mybills');
  };

  return (
    <div>
      <div className="container">
        <h2>Bills</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Bill</th>
              <th>Amount</th>
              <th>Dute Date</th>
              <th>Delete Bill</th>
            </tr>
          </thead>
          <tbody>
          {
            bills.map( bill => {
              return (
                <tr key={ bill.id } className="align-items-center">
                  <td>
                   <Link to={`/bills/${bill.id}`}>{bill.name}</Link>
                  </td>
                  <td>${bill.amount}</td>
                  <td>{bill.dueDate}</td>
                  <td>
                   <button className= "btn btn-outline-dark btn-sm" onClick={ ()=> destroy(bill)}>x</button>
                  </td>
                </tr>
              );  
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default BillList;
