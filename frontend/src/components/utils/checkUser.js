import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import axios from './axiosInterceptor';


const checkUser = (WrappedComponent) => {
  return () => {
    const navigate = useNavigate();
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      
      const fetchProfile = async () => {
        try {
          const authRes = await axios.get(`http://localhost:5000/user/${userId}`);
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

    return userExists ? <WrappedComponent /> : null;
  };
};

export default checkUser;
