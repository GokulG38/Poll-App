import React, { useState, useEffect } from 'react';
import axios from './utils/axiosInterceptor';
import checkUser from "./utils/checkUser";
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "https://poll-app-backend.vercel.app";
const socket = io(API_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const PollResults = () => {
  const [results, setResults] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/polls/${params.id}/result`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    const handleVoteEvent = (newResults) => {
      setResults(newResults);
    };

    fetchResults();

    socket.on('vote', handleVoteEvent);

    return () => {
      socket.off('vote', handleVoteEvent);
    };
  }, [params.id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pb-56">
      <div className="p-6 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Poll Results</h1>
        {results.map((result, index) => (
          <div key={index} className="p-4 mb-2 bg-gray-200 rounded">
            {`${result._id}: ${result.votes}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default checkUser(PollResults);
