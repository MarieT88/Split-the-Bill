import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSplits, fetchUsers, fetchBills } from '../store';
import { useParams } from 'react-router-dom';


const BillSplitDetails = () => {
  
  const dispatch = useDispatch();
  const { bills, users, splits } = useSelector(state => state);
  const { id } = useParams();
  const bill = bills.find(bill => bill.id === id);
  
  
  useEffect(() => {
    dispatch(fetchSplits());
    dispatch(fetchBills());
    dispatch(fetchUsers());
  }, []);
  
  
  const groupedSplits = splits.reduce((acc, split) => {
    if (split.billId === bill.id) {
      const existing = acc.find((g) => g.billId === bill.id);
      if (existing) {
        existing.userIds.push({
          userId: split.userId,
          amount: split.amount,
        });
      } else {
        acc.push({
          billId: bill.id,
          name: bill.name,
          amount: bill.amount,
          note: bill.note,
          dueDate: bill.dueDate,
          userIds: [{ userId: split.userId, amount: split.amount }],
          isPaid: bill.isPaid,
        });
      }
    }
    return acc;
  }, []);

  const checkBillPaid = (bill) => {
    const totalAmountContributed = bill.userIds.reduce(
      (sum, user) => sum + user.amount,
      0
    );
  console.log(`totalAmountContributed: ${totalAmountContributed}`);
    return totalAmountContributed === bill.amount;
  };
  
  return (
    <div className='columns'>
      <div className='card'>
        <h2 className='card-header'>Split Details</h2>
          <div className='card-body'>
            <ul className='split_card'>
              {groupedSplits.map((group) => {
                const totalAmountContributed = group.userIds.reduce(
                  (sum, user) => sum + user.amount, 0);
                return (
                  <li key={group.billId}>
                    <p><span className="bold-text">Bill: </span>{group.name}</p>
                    <div>
                      {group.isPaid ? (
                        <p><span className="bold-text">Status: </span><span style={{ color: 'green' }}>Paid</span></p>
                      ) : checkBillPaid(group) ? (
                        <p><span className="bold-text">Status: </span><span style={{ color: 'green' }}>Paid</span></p>
                      ) : (
                        <p><span className="bold-text">Status: </span><span style={{ color: 'red' }}>
                          Unpaid - ${(group.amount - totalAmountContributed).toFixed(2)} remaining</span>
                        </p>
                      )}
                    </div>
                      <p><span className="bold-text">Split Between:</span></p>
                      <ul className='split_ul'>
                        {group.userIds.map((user) => (
                          <li key={user.userId}>
                            {users.find((u) => u.id === user.userId)?.name} - $
                            {user.amount}
                          </li>
                        ))}
                      </ul>
                  </li>
                );
              })}
            </ul>
        </div>  
      </div>
    </div>
  );
  
};

export default BillSplitDetails;