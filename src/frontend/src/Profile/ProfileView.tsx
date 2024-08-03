import React from 'react';

const ProfileView: React.FC = () => {
  const problemsSolved = [
    { id: 1, title: 'Problem 1', dateSolved: '2023-01-01' },
    { id: 2, title: 'Problem 2', dateSolved: '2023-01-05' },
    { id: 3, title: 'Problem 3', dateSolved: '2023-01-10' },
  ];

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <h1>Profile View</h1>
        <h2>Problems Solved</h2>
        <ul>
          {problemsSolved.map((problem) => (
            <li key={problem.id}>
              {problem.title} - Solved on {problem.dateSolved}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileView;
