import React from 'react'
import {  SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div className='mx-auto bg-green-800 flex justify-center items-center h-screen'>   
        <SignUp/>
    </div>
  )
}

export default Register