import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import ProblemSelector from './ProblemSelector/ProblemSelectorView';
import ProblemViewView from './ProblemView/ProblemViewView';
import AuthPage from './Auth/AuthPageComponent';
import TopBar from './TopBar/TopBar';
import Profile from './Profile/ProfileView';
import { useParams } from 'react-router-dom';

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
        <Route path="/problem/:problemId" element={<ProblemViewWrapper />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/auth"
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
