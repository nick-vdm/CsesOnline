import React from 'react';
import CodeEditor from './CodeEditor';

const ProblemPage: React.FC = () => {
  return (
    <div>
      <h1>Problem Title</h1>
      <p>Problem description goes here.</p>
      <CodeEditor />
    </div>
  );
};

export default ProblemPage;
