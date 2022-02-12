import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
export default function AuthenLayout({children,req=-1}) {
  
  const role=useSelector(s=>s?.user?.role ?? -1)
  console.log(req,role);
 if(role>=req){
  return <div>
  {children}
</div>;
 }
 return <Redirect to="/login"/>
}
