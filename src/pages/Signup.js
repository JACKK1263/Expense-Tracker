import React from 'react'
import Header from "../components/Header"
import SignupSigninCom from '../components/SignupSignin'

function Signup() {
  return (
        <div><Header />
        <div className="wrapper">
          <SignupSigninCom />
        </div>
        </div>
  )
}

export default Signup