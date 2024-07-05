
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axiosInterceptor";

const checkGuest = (WrappedComponent) => {
  return () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
      const userId = localStorage.getItem('userId');

      const fetchProfile = async () => {
        try {
          const authRes = await axios.get(`http://localhost:5000/user/${userId}`);
          if (authRes.status === 200) {
            setProfile(true); 
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setProfile(false); 
        } finally {
          setLoading(false); 
        }
      };

      if (userId) {
        fetchProfile();
      } else {
        setProfile(false); 
        setLoading(false); 
      }

    }, []);

    useEffect(() => {
      if (profile === true) {
        navigate("/profile");
      }
    }, [profile, navigate]);

   
    return loading ? null : !profile ? <WrappedComponent /> : null;
  };
};

export default checkGuest;
