
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './utils/axiosInterceptor';
import checkUser from './utils/checkUser';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${userId}`);
        setUser(res.data.user);
        if (res.data.user.profilePicture) {
          setUploaded(true); 
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    checkUser(navigate);
  }, [navigate]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const res = await axios.post(`http://localhost:5000/user/${userId}/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(res.data.user);
      setUploaded(true);
      alert('Profile picture uploaded successfully');
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      alert('Failed to upload profile picture');
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        {user && (
          <>
            {user.profilePicture && (
              <img
                src={`http://localhost:5000/${user.profilePicture}`}
                alt="Profile"
                className="w-40 h-40 rounded-full mb-4"
              />
            )}
            <p className="text-lg mb-2"><strong>Name:</strong> {user.username}</p>
            <p className="text-lg mb-2"><strong>Email:</strong> {user.email}</p>
            {uploaded ? (
              null
            ) : (
              <>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mb-2 border border-gray-300 p-2 rounded"
                />
                <button
                  onClick={handleUpload}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Upload Profile Picture
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
