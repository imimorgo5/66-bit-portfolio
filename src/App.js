import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.js';
import ProjectsPage from './pages/projects-page.js';
import CardsPage from './pages/cards-page.js';
import TeamsPage from './pages/teams-page.js';
import AchievementsPage from './pages/achievements-page.js';
import UserPage from './pages/user-page.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
