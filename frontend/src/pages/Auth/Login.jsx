import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext)

  const navigate = useNavigate();

  // Handling login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid address")
      return;
    }

    if (!password) {
      setError("Please Enter a Password");
      return;
    }
    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      })
      const { token, user } = response.data

      if (token) {
        localStorage.setItem("token", token)
        // updateUser(user)
        navigate("/dashboard")
      }
    }
    // catch(error){
    //   if(error.response && error.response.data.message){
    //     setError(error.response.data.message)
    //   }
    //   else{
    //     setError("something went wront,please try agian")
    //     console.log("errrorrrrrrrrrrrrr",error)
    //   }
    // }


    // 2 try

    // catch (error) {
    //   if (error.response) {
    //     console.error("Axios Error Response:", error.response);
    //     setError(error.response.data?.message || "Server error");
    //   } else if (error.request) {
    //     console.error("Axios No Response (Network error):", error.request);
    //     setError("No response from server");
    //   } else {
    //     console.error("Axios Setup Error:", error.message);
    //     setError("Request setup error");
    //   }
    // }

    // 3 perplexity 
    catch (error) {
  if (error.response) {
    // Server responded with status code outside 2xx
    console.error("Server responded with error:", error.response);

    // Customize messages based on status or error code
    switch (error.response.status) {
      case 401:
        setError("Invalid email or password. Please try again.");
        break;
      case 404:
        setError("User not found. Please check your email.");
        break;
      case 500:
        setError("Server error. Please try again later.");
        break;
      default:
        setError(error.response.data?.message || "An error occurred. Please try again.");
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response received:", error.request);
    setError("Unable to connect to the server. Please check your internet connection or try again later.");
  } else {
    // Something else happened setting up the request
    console.error("Request setup error:", error.message);
    setError("An unexpected error occurred. Please try again.");
  }
}

  }
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '>Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
          Please Enter Your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="demo@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 6 Characters"
            type="password"
          />

          {error && <p className='text-red-400 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className="btn-primary">Login</button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{""}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
