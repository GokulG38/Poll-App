import React, {  useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import checkGuest from "./utils/checkGuest";
import { sendUserLogRequest } from './utils/Authentication';


const LoginForm = () => {


  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");



  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = inputs;
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    handleUserLogData({ inputs });
    setInputs({
      email: "",
      password: "",
    });
  };

  const handleUserLogData = (data) => {
    sendUserLogRequest(data.inputs)
      .then((res) => {
        localStorage.setItem("userId", res.id);
        localStorage.setItem("userToken", res.token);
        navigate("/profile");
      })
      .catch((err) => setError("Invalid email or password"));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-10 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-gray-500">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default checkGuest(LoginForm);
