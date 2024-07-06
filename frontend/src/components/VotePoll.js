
import React, { useState, useEffect } from 'react';
import axios from './utils/axiosInterceptor';
import checkUser from "./utils/checkUser"

import io from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;
const socket = io(`${API_URL}`);

const VotePoll = () => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchPollAndComments = async () => {
      try {
       
        const pollResponse = await axios.get(`${API_URL}/polls/${params.id}`);
        setPoll(pollResponse.data);

        
        const commentsResponse = await axios.get(`${API_URL}/polls/${params.id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching poll or comments:', error);
        setError('Error fetching poll or comments.');
      }
    };

   
    socket.on('comment', handleCommentEvent);

    fetchPollAndComments();

   
    return () => {
      socket.off('comment', handleCommentEvent);
    };

  }, [params.id]);

  const handleCommentEvent = (comment) => {
    setComments((prevComments) => [comment, ...prevComments]);
  };

  const handleVote = async () => {
    try {
      await axios.post(`${API_URL}/polls/${params.id}/vote`, { 
        option: selectedOption, 
        userId: localStorage.getItem("userId") 
      });
      setError(''); 
      navigate(`/poll/${params.id}/result`)
    } catch (error) {
      console.error('Error casting vote:', error);
      setError(error.response?.data?.error || 'Error casting vote.');
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post(`${API_URL}/polls/${params.id}/comment`, {
        text: commentText,
        userId: localStorage.getItem("userId"),
      });
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    try {
        console.log({
            text: commentText,
            userId: localStorage.getItem("userId"),
            parentId: parentId,
          })
      await axios.post(`${API_URL}/polls/${params.id}/comment`, {
        text: commentText,
        userId: localStorage.getItem("userId"),
        parentId: parentId,
      });
      setCommentText('');
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };


function renderComment(comment) {
    console.log(comment);
    return (
      <div key={comment._id} className="bg-gray-100 p-4 rounded">
        <p className="text-gray-800">{comment.text}</p>
        {comment.user && (
          <p className="text-sm text-gray-600">Commented by: {comment.user.username}</p>
        )}

        {comment.parentComment && comment.parentComment.user && comment.parentComment.user.username && (
        <p className="text-xs text-gray-500">Replying to: {comment.parentComment.user.username}</p>
      )}
        <button
          onClick={() => handleReplySubmit(comment._id)}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Reply
        </button>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {poll ? (
        <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">{poll.question}</h1>
          {poll.options.map((option, index) => (
            <label key={index} className="flex items-center mb-4 cursor-pointer">
              <input
                type="radio"
                name="option"
                value={option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2 text-blue-600 form-radio"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <button
            onClick={handleVote}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Vote
          </button>
          <button
            onClick={() => navigate(`/poll/${params.id}/result`)}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Show Results
          </button>

         
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className="w-full px-3 py-2 border rounded"
              />
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add Comment
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {comments.map((comment) => renderComment(comment))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">Loading poll...</div>
      )}
    </div>
  );
};

export default checkUser(VotePoll);
