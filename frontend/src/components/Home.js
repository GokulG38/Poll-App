
import React, { useState, useEffect } from 'react';
import axios from './utils/axiosInterceptor';
import { Link } from 'react-router-dom';

const Home = ({ myPolls }) => {
  const [polls, setPolls] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        let response;
        if (myPolls) {
          response = await axios.get(`http://localhost:5000/user/${userId}/polls`);
        } else {
          response = await axios.get(`http://localhost:5000/polls`);
        }
        setPolls(response.data);
      } catch (error) {
        console.error('Error fetching polls:', error);
    
      }
    };

    fetchPolls();
  }, [myPolls, userId]);

  if (!polls || polls.length === 0) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container mx-auto p-4 px-24">
      <h1 className="text-3xl font-bold mb-4">{myPolls ? 'My Polls' : 'All Polls'}</h1>
      <div className="space-y-4">
        {polls.map((poll) => (
          <Link key={poll._id} to={`/poll/${poll._id}`}>
            <div className="bg-white shadow-md rounded px-6 py-4">
              <h3 className="text-xl font-semibold mb-2">{poll.question}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
