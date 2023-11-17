import React from 'react';
import { useSelector, useDispatch } from 'react-redux';


const Home = ()=> {
    
  const { auth } = useSelector(state => state);
  
  return (
    <div>
      {!!auth.id && (<h3>Welcome { auth.username }!</h3>)}
      <p>Paragraph about how to use this app</p>
    </div>
  );
  
};


export default Home;
