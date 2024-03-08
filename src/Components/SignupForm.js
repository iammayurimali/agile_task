import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";

import { useNavigate } from "react-router-dom";
import { SIGNUP } from "../GraphQl/Mutation";

const SignupForm = ({ setIsLoggedIn }) => {
  const isValidName = (name) => /^[A-Za-z]+$/.test(name);
  const navigate = useNavigate();
  const [signup, { loading }] = useMutation(SIGNUP);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [accountType, setAccountType] = useState("Developer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function changeHandler(event) {
    const { name, value } = event.target;

    if (name === "firstName" && !isValidName(value)) {
      console.error("Invalid first name. Use alphabets only.");
      return;
    }

    if (name === "lastName" && !isValidName(value)) {
      console.error("Invalid last name. Use alphabets only.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    signup({
      variables: {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: accountType,
      },
    })
      .then((response) => {
        toast.success("Account Created");
        console.log("Signup Response:", response);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        toast.error("Error creating account. Please try again.");
      });
  }

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
    //console.log("Account: ", accountType)
  };

  return (
    <div>
      <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
        <div className="py-2 px-5 rounded-full transition-all duration-200 bg-gray-200">
          <label
            htmlFor="user"
            className="py-2 px-5 rounded-full transition-all duration-200 text-gray-800"
          >
            Are you an employee or manager?
          </label>

          <select
            id="user"
            value={accountType}
            onChange={handleAccountTypeChange}
            className="border-none focus:outline-none"
          >
            <option value="Developer" className="py-2 px-5">
              Developer
            </option>
            <option value="Manager" className="py-2 px-5">
              Manager
            </option>
          </select>
        </div>
      </div>

      <form onSubmit={submitHandler}>
        {/* first name and lastName */}
        <div className="flex gap-x-4 mt-[20px]">
          <label className="w-full">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              First Name<sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              onChange={changeHandler}
              placeholder="Enter First Name"
              value={formData.firstName}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>

          <label className="w-full">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Last Name<sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              onChange={changeHandler}
              placeholder="Enter Last Name"
              value={formData.lastName}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>
        </div>
        {/* email Add */}
        <div className="mt-[20px]">
          <label className="w-full mt-[20px]">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Email Address<sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              onChange={changeHandler}
              placeholder="Enter Email Address"
              value={formData.email}
              pattern=".+@gmail\.com"
              title="Please enter a valid Gmail address"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>
        </div>

        {/* createPassword and Confirm Password */}
        <div className="w-full flex gap-x-4 mt-[20px]">
          <label className="w-full relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Create Password<sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={changeHandler}
              placeholder="Enter Password"
              value={formData.password}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <label className="w-full relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Confirm Password<sup className="text-pink-400">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={changeHandler}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          className="w-full bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
