import React from 'react';
import { useState } from 'react';
import ProblemPage from './ProblemPageComponent';
import CodeEditor from './CodeEditorComponent';
import 'react-resizable/css/styles.css';
import '../App.css';

interface ProblemViewViewProps {
  problem: string;
}

const ProblemViewView: React.FC<ProblemViewViewProps> = ({ problem }) => {
  const [dividerPosition, setDividerPosition] = useState(50); // initial position at 50%

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const newDividerPosition = (e.clientX / window.innerWidth) * 100;
    setDividerPosition(newDividerPosition);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="container">
      <div className="pane left-pane" style={{ width: `${dividerPosition}%` }}>
        <ProblemPage problem={problem} />
      </div>
      <div className="divider" onMouseDown={handleMouseDown} />
      <div
        className="pane right-pane"
        style={{ width: `${100 - dividerPosition}%` }}
      >
        <CodeEditor problem={problem} />
      </div>
    </div>
  );
};

export default ProblemViewView;
