import React from 'react'
import signupImg from "../assets/signup.png"
import Template from '../Components/Template'

const Signup = ({setIsLoggedIn}) => {
  return (
    <Template
      title="TaskTracker: Start Your Journey to Productivity – Sign Up Today!"
      desc1="Join the journey of progress."
      desc2="Sign up now and start shaping your success story."
      image={signupImg}
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Signup