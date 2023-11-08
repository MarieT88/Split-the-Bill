import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSplits, fetchUsers, fetchBills } from '../store';


function Split() {
  const splits = useSelector(state => state.splits);
  const bills = useSelector(state => state.bills);
  const users = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSplits());
    dispatch(fetchBills());
    dispatch(fetchUsers());
  }, []);

  if (!splits || !Array.isArray(splits)) {
    return (
      <div>
        <div>No splits to display.</div>
      </div>
    );
  }

  const groupedSplits = splits.reduce((acc, split) => {
    const bill = bills.find(b => b.id === split.billId);
    if (!bill) {
      return acc;
    }
    const existing = acc.find(g => g.billId === bill.id);
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
    return acc;
  }, []);

  if (!groupedSplits || !Array.isArray(groupedSplits)) {
    return (
      <div>
        <div>No splits to display.</div>
      </div>
    );
  }

  const checkBillPaid = bill => {
    const totalAmountContributed = bill.userIds.reduce(
      (sum, user) => sum + user.amount,
      0
    );
    return totalAmountContributed === bill.amount;
  };

  return (
  <div>
    <ul>
      {groupedSplits.map(group => {
        const totalAmountContributed = group.userIds.reduce(
          (sum, user) => sum + user.amount,
          0
        );
        return (
          <li key={group.billId}>
            <div>
              <h4>{group.name}</h4>
                <p><span className="bold-text">Total: </span>${group.amount}</p> 
                <p><span className="bold-text">Due Date: </span> {group.dueDate}</p>
                <p><span className="bold-text">Status: </span> 
                  {group.isPaid ? (
                    <span style={{ color: 'green' }}> Paid</span>
                  ) : checkBillPaid(group) ? (
                    <span style={{ color: 'green' }}> Paid</span>
                  ) : (
                    <span style={{ color: 'red' }}>
                      {' '}Unpaid - ${group.amount - totalAmountContributed.toFixed(2)} remaining
                    </span>
                  )}
                </p>
                { group.note && <p><span className="bold-text">Note: </span>{group.note}</p>}
              </div>
              <div>
                <p><span className="bold-text">Split Between:</span></p>
                  <ul>
                    {group.userIds.map(user => (
                      <li key={user.userId}>
                        {users.find(u => u.id === user.userId)?.name} - $
                        {user.amount}
                      </li>
                    ))}
                  </ul>
              </div>
              <hr/>
          </li>
        );
      })}
    </ul>
    <br/>
  </div>
  );
}

export default Split;