import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProblemSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectProblem = (problemId: string) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div>
      <button onClick={() => handleSelectProblem('problem1')}>Problem 1</button>
      <button onClick={() => handleSelectProblem('problem2')}>Problem 2</button>
    </div>
  );
};

export default ProblemSelector;
