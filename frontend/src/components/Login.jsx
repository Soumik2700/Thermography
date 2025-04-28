// src/pages/Login.jsx
import React from 'react';
import { useState } from 'react';
import axios from "axios"
import {useDispatch} from "react-redux";
import { loginSuccess } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [inputs, setInputs] = useState({
        email:"",
        password:""
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handelClick() {
        try {
            const response = await axios.post("http://localhost:8100/login", inputs);
            const data = response.data;
            console.log(data);
            const { token, ...user } = data;

            // Save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Save to redux
            dispatch(loginSuccess({ user, token }));

            navigate("/plants")

        } catch (err) {
            alert(err.message);
        }
    }   // ✅ properly close the function here

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {/* Logo Section */}
                <div className="text-3xl font-bold text-blue-600 mb-2 text-center">
                    Demo Company
                </div>
                <div className="text-center text-gray-700 mb-6">
                    Welcome to Thermography Engine
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your email"
                        onChange={(e)=>setInputs((prev) => ({...prev, email: e.target.value}))}
                    />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                    <label className="block text-gray-600 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your password"
                        onChange={(e)=> setInputs((prev) => ({...prev, password: e.target.value}))}
                    />
                </div>

                {/* Sign In Button */}
                <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded"
                    onClick={handelClick}
                >
                    SIGN IN
                </button>
            </div>
        </div>
    );
};

export default Login;
