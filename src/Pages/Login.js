import React from 'react'
import Template from '../Components/Template'
import loginImg from "../assets/login.png"

const Login = ({setIsLoggedIn}) => {
  return (
    <Template
      title="Welcome To Agile Task"
      desc1="Unlock your day with a login."
      desc2="Where tasks align and success begins"
      image={loginImg}
      formtype="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Login