import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemsPage from './pages/items-page.js';
import ProjectDetailPage from './pages/project-detail-page.js';
import CardDetailPage from './pages/card-detail-page';
import TeamsDetailPage from './pages/team-detail-page.js';
import TeamsPage from './pages/teams-page.js';
import UserPage from './pages/user-page.js';
import AuthPage from './pages/auth-page.js';
import { ItemType, FormType, PageMode } from './consts.js';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ItemsPage itemType={ItemType.PROJECT}/>} />
          <Route path="/cards" element={<ItemsPage itemType={ItemType.CARD}/>} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/projects/:identifier" element={<ProjectDetailPage pageMode={PageMode.PRIVATE} />} />
          <Route path="/cards/:identifier" element={<CardDetailPage pageMode={PageMode.PRIVATE} />} />
          <Route path="/teams/:id" element={<TeamsDetailPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/login" element={<AuthPage formType={FormType.LOGIN} />} />
          <Route path="/register" element={<AuthPage formType={FormType.REGISTRATION} />} />
          <Route path="cards/shared/:identifier" element={<CardDetailPage pageMode={PageMode.PUBLIC} />} />
          <Route path="projects/shared/:identifier" element={<ProjectDetailPage pageMode={PageMode.PUBLIC} />} />
        </Routes>
      </Router>
    </div>
  );
}
