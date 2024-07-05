import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import CreatePoll from './components/CreatePoll';
import Home from './components/Home';
import VotePoll from './components/VotePoll';

import PollResults from './components/PollResults';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<><Navbar/><Profile /></>}/>
          <Route path="/create" element={<><Navbar/><CreatePoll /></>}/>
          <Route path="/home" element={<><Navbar/><Home myPolls={false} /></>}/>
          <Route path="/mypolls" element={<><Navbar /><Home myPolls={true} /></>} />
          <Route path="/poll/:id" element={<><Navbar/><VotePoll /></>}/>
          <Route path="/poll/:id/result" element={<><Navbar/><PollResults /></>}/>
        </Routes>
      </Router>

  );
};

export default App;
