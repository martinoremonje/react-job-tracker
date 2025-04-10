import React from 'react'
import {  SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className='mx-auto bg-green-800 flex justify-center items-center h-screen'>   
        <SignIn />
    </div>
  )
}

export default Login