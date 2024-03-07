import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import 'react-time-picker/dist/TimePicker.css';
import {LOGIN} from "../GraphQl/Mutation"
import { useMutation } from "@apollo/client";
import { jwtDecode } from 'jwt-decode';
const LoginForm = ({setIsLoggedIn}) => {

  const navigate = useNavigate();
  const [login] = useMutation(LOGIN);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
 // const [accountType, setAccountType] = useState("Developer");

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    login({
      variables: {
        email: formData.email,
        password: formData.password,
        },
    })
      .then((response) => {
        const { token,id } = response.data.login;
        toast.success("Logged In");

       localStorage.setItem("userID", JSON.stringify(id))
       localStorage.setItem("token", JSON.stringify(token));

        const localtoken = JSON.parse(localStorage.getItem('token'));
        const decoded = jwtDecode(localtoken);
        const accountType = decoded.role
        setIsLoggedIn(true);

        accountType === "Manager"
          ? navigate("/assignProject")
          : navigate("/addTaskHours");
      })
      .catch((error) => {
        console.error("Login Error:", error);
        toast.error("Invalid credentials. Please try again.");
      });
  }



   
  return (
    <form onSubmit={submitHandler}
    className="flex flex-col w-full gap-y-4 mt-6">

        <label className='w-full'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                Email Address<sup className='text-pink-400'>*</sup>
            </p>
            <input 
                required
                type="email"
                value = {formData.email}
                onChange={changeHandler}
                placeholder="Enter email address"
                name="email"
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
            />
        </label>
        <label className='w-full relative'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                Password<sup className='text-pink-400'>*</sup>
            </p>
            <input 
                required
                type= {showPassword ? ("text") : ("password")}
                value = {formData.password}
                onChange={changeHandler}
                placeholder="Enter Password"
                name="password"
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
            />

            <span 
            className='absolute right-3 top-[38px] cursor-pointer'
            onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? 

                (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : 

                (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
            </span>

            <Link to="#">
                <p className='text-xs mt-1 text-red-200 max-w-max ml-auto'>
                    Forgot Password
                </p>
            </Link>
        </label>

        <button className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
            Sign In
        </button>
      

    </form>
  )
}

export default LoginForm