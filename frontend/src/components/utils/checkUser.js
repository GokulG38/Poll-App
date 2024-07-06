
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from './axiosInterceptor'; 

const checkUser = (WrappedComponent) => {
  return (props) => { 
    const navigate = useNavigate();
    const [userExists, setUserExists] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      
      const fetchProfile = async () => {
        try {
          const authRes = await axios.get(`${API_URL}/user/${userId}`);
          if (authRes.status === 200) {
            setUserExists(true);
          } else {
            setUserExists(false);
            navigate("/login"); 
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setUserExists(false);
          navigate("/login"); 
        }
      };

      if (userId) {
        fetchProfile();
      } else {
        setUserExists(false);
        navigate("/login"); 
      }
    }, [navigate]); 

    return userExists ? <WrappedComponent {...props} /> : null;
  };
};

export default checkUser;
