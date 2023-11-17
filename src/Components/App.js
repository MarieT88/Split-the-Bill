import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Routes, Route } from 'react-router-dom';
import Logout from './Logout';
import Login from './Login';
import UserProfile from "./UserProfile";
import BillCreate from './BillCreate';
import BillList from "./BillList";
import Split from "./Split";
import BillSplit from "./BillSplit";
import Home from "./Home";
import Nav from "./Nav";
import { loginWithToken, fetchUsers, fetchSplits, fetchBills } from '../store';


const App = ()=> {
  
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const prevAuth = useRef(auth);

  useEffect(()=> {
    dispatch(loginWithToken());
  }, []);
  
  useEffect(()=> {
    if(!prevAuth.current.id && auth.id){
      console.log(`${auth.firstName} is logged in`);
      dispatch(fetchUsers());
      dispatch(fetchBills());
      dispatch(fetchSplits());
    }
    if(prevAuth.current.id && !auth.id){
      console.log('logged out');
    }
  }, [auth]);
  
  useEffect(()=> {
    prevAuth.current = auth;
  });

  return (
    <div>
      <Nav />
      {
        !!auth.id && (
          <div>
            <Routes>
             <Route path="/nav" element={<Nav />} />
             <Route path="/profile" element={<UserProfile />} />
             <Route path="/newbill" element={<BillCreate />} />
             <Route path="/mybills" element={<BillList />} />
             <Route path="/bills/:id" element={<BillSplit />} />
             <Route path="/splits" element={<Split />} />
             <Route path="/" element={<Home/>} />
             <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        )
      }
            {
        !auth.id && (
          <div>
            <Routes>
             <Route path="/login" element={<Login />} />
             <Route path="/nav" element={<Nav />} />
             <Route path="/" element={<Home/>} />
            </Routes>
          </div>
        )
      }
    </div>
  );
};


export default App; 

