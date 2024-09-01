import React, { useEffect, useState } from 'react';
import ProblemPage from './ProblemPageComponent';
import CodeEditor from './CodeEditorComponent';
import AuthPage from '../Auth/AuthPageComponent';
import 'react-resizable/css/styles.css';
import '../App.css';

interface ProblemViewViewProps {
 problem: string;
}

const ProblemViewView: React.FC<ProblemViewViewProps> = ({ problem }) => {
 const [dividerPosition, setDividerPosition] = useState(50); // initial position at 50%
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
   setIsAuthenticated(true);
  }
 }, []);

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

 const handleAuthSuccess = () => {
  setIsAuthenticated(true);
 };

 return (
  <div>
   {!isAuthenticated ? (
    <div className="container">
     <div
      className="pane left-pane"
      style={{ width: `${dividerPosition}%` }}
     >
      <ProblemPage problem={problem} />
     </div>
     <div
      className="divider"
      onMouseDown={handleMouseDown}
      style={{
       width: '10px',
       backgroundColor: '#21252b',
       cursor: 'col-resize',
       position: 'relative',
      }}
     >
      <div
       style={{
        width: '6px',
        height: '20px',
        backgroundColor: '#fff',
        borderRadius: '3px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'background-color 0.3s',
       }}
       className="divider-dent"
      />
     </div>
     <div
      className="pane right-pane"
      style={{ width: `${100 - dividerPosition}%` }}
     >
      <CodeEditor problem={problem} />
     </div>
    </div>
   ) : (
    <AuthPage onAuthSuccess={handleAuthSuccess} />
   )}
  </div>
 );
};

export default ProblemViewView;
