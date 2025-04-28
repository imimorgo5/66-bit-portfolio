import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/projects-page.js';
import ProjectDetailPage from './pages/project-detail-page.js';
import CardsPage from './pages/cards-page.js';
import CardDetailPage from './pages/card-detail-page';
import TeamsPage from './pages/teams-page.js';
import AchievementsPage from './pages/achievements-page.js';
import UserPage from './pages/user-page.js';
import LoginPage from './pages/login-page.js';
import RegistrationPage from './pages/registration-page.js';
import NotificationPage from './pages/notification-page.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/cards/:id" element={<CardDetailPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
