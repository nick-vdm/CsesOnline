import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import ProblemSelector from './ProblemSelector/ProblemSelectorView';
import ProblemViewView from './ProblemView/ProblemViewView';
import AuthPage from './Auth/AuthPageComponent';
import TopBar from './TopBar/TopBar';
import Profile from './Profile/ProfileView';
import { PATHS } from './Consts';

const ProblemViewWrapper: React.FC = () => {
 const { problemId } = useParams<{ problemId: string }>();

 if (!problemId) {
  return <div>Problem ID is missing</div>;
 }

 return <ProblemViewView problem={problemId} />;
};

const App: React.FC = () => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
   setIsAuthenticated(true);
  }
 }, []);

 const handleAuthSuccess = (token: string) => {
  localStorage.setItem('token', token);
  setIsAuthenticated(true);
 };

 return (
  <Router>
   <TopBar isAuthenticated={isAuthenticated} /> {}
   <Routes>
    <Route path="/" element={<ProblemSelector />} />
    <Route path={PATHS.PROBLEM_LIST} element={<ProblemSelector />} />
    <Route path="/problem/:problemId" element={<ProblemViewWrapper />} />
    <Route path={PATHS.PROFILE} element={<Profile />} />
    <Route
     // pretty sure I should be able to combine these two routes into one with
     // two different paths specified, but whatever.
     path={PATHS.AUTH_SIGNUP}
     element={
      isAuthenticated ? (
       <Navigate to="/" />
      ) : (
       <AuthPage onAuthSuccess={handleAuthSuccess} />
      )
     }
    />
    <Route
     path={PATHS.AUTH_LOGIN}
     element={
      isAuthenticated ? (
       <Navigate to="/" />
      ) : (
       <AuthPage onAuthSuccess={handleAuthSuccess} />
      )
     }
    />
   </Routes>
  </Router>
 );
};

export default App;
