import React, { useState } from 'react';
import axios from './utils/axiosInterceptor';



const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); 


  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("1")
      const userId = localStorage.getItem("userId")
      const nonEmptyOptions = options.filter(option => option.trim() !== '');
      console.log(nonEmptyOptions)

      const response = await axios.post(`http://localhost:5000/create`, { question, options: nonEmptyOptions, userId });
      console.log("5")

      console.log('Poll created:', response.data);
      setQuestion('');
      setOptions(['', '', '', '']);
  
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const canAddOption = options.length < 4; 

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <input
        type="text"
        placeholder="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        className="block w-full mb-4 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          required
          onChange={(e) => handleOptionChange(index, e.target.value)}
          
          className="block w-full mb-4 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
        />
      ))}
      {canAddOption && (
        <button
          type="button"
          onClick={() => setOptions([...options, ''])}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
        >
          Add Option
        </button>
      )}
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Poll
      </button>
    </form>
  );
};

export default CreatePoll;
