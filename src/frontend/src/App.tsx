import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProblemSelector from './ProblemSelector/ProblemSelectorView';
import ProblemViewView from './ProblemView/ProblemViewView';
import { useParams } from 'react-router-dom';

const ProblemViewWrapper: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();

  if (!problemId) {
    return <div>Problem ID is missing</div>;
  }

  return <ProblemViewView problem={problemId} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProblemSelector />} />
        <Route path="/problem/:problemId" element={<ProblemViewWrapper />} />
      </Routes>
    </Router>
  );
};

export default App;
