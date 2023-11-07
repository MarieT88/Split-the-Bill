import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSplit, fetchUsers, fetchSplits, fetchBills, updateBill } from '../store';
import BillDetails from './BillDetails';
import QuickSplitCalc from './QuickSplitCalc';


const BillSplit = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { bills, users, splits } = useSelector(state => state);
  const { id } = useParams();
  const bill = bills.find(bill => bill.id === id);
  
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [contributedUserIds, setContributedUserIds] = useState([]);

  useEffect(() => {
    dispatch(fetchSplits());
    dispatch(fetchBills());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    // Retrieve the contributed user IDs from the bill object
    if (bill && bill.contributedUserIds) {
      setContributedUserIds(bill.contributedUserIds);
    }
  }, [bill]);

  if (!bill) {
    return null;
  }

  const handleSplit = async () => {
    // Check if the selected user has already contributed
    if (contributedUserIds.includes(userId)) {
      alert('This user has already made a contribution.');
      return;
    }

    const selectedUser = users.find(user => user.id === userId);
    if (!selectedUser) {
      alert('Please select a valid user.');
      return;
    }

    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      alert('Please enter a valid positive contribution amount.');
      return;
    }

    // Calculate the remaining amount for the bill
  const totalContributions = splits
    .filter(split => split.billId === bill.id)
    .reduce((sum, split) => sum + split.amount, 0);
  const remainingAmount = bill.amount - totalContributions;

  if (contributionAmount > remainingAmount) {
    alert('The contribution amount exceeds the remaining amount.');
    return;
  }

   // Create the split and update the bill
  await dispatch(createSplit({ billId: bill.id, userId, amount: contributionAmount }));

  // Check if the remaining amount is fully covered
  if (contributionAmount === remainingAmount) {
    await dispatch(updateBill({ ...bill, contributedUserIds: [...contributedUserIds, userId], isPaid: true, paidAmount: bill.amount }));
  } else {
    await dispatch(updateBill({ ...bill, contributedUserIds: [...contributedUserIds, userId] }));
  }

    // Clear the selected user and amount
    setUserId('');
    setAmount('');
    dispatch(fetchSplits());
    dispatch(fetchBills());
    dispatch(fetchUsers());
    navigate(`/bills/${id}`);
  };

  const availableUsers = users.filter(user => !contributedUserIds.includes(user.id));

  return (
    <div>
      <div>
        <BillDetails />
      </div>
      <div>
        <h2>Split the Bill</h2>
        <form onSubmit={handleSplit}>
            <select value={userId} onChange={ev => setUserId(ev.target.value)}>
              <option value="">Select User</option>
              {
                availableUsers.map(user => (
                  <option value={user.id} key={user.id}>
                    {user.name}
                  </option>
                ))
              }
            </select>
            <input 
              value={amount} 
              onChange={ev => setAmount(ev.target.value)} 
              placeholder="Amount"
              name="Amount"
            />
          <button>Split Bill</button>
        </form>
     </div>
     <div>
        <QuickSplitCalc />
      </div>
  </div>
  );
};

export default BillSplit;







