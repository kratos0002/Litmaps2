import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Globe from './components/Globe';
import StoryPage from './components/StoryPage'; // Create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Globe />} />
        <Route path="/story/:id" element={<StoryPage />} />
      </Routes>
    </Router>
  );
};


export default App;