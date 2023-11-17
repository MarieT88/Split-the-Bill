import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


const Nav = () => {
    
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return (
        <div>
            <nav className="navbar navbar-inverse">
              <div className="navbar-header">
                <h2 className="navbar-brand" style={{ fontSize: '28px',  textShadow: '2px 2px 2px #00cc00' }}>SplitTheBill</h2>
              </div>
                <Link to="/newbill" className="nav navbar-nav">New Bill</Link>
                <Link to="/mybills" className="nav navbar-nav">My Bills</Link>
                <Link to="/splits" className="nav navbar-nav">Shared Bills</Link>
                <Link to="/profile" className="nav navbar-nav">Profile</Link>
                {!!auth.id && ( <Link to="/logout" className="nav navbar-nav">Logout</Link>)}
                {!auth.id && ( <Link to="/login" className="nav navbar-nav">Login</Link>)}
            </nav>
        </div>
    );
};

export default Nav;