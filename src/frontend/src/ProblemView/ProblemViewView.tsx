import React, { useEffect, useState } from 'react';
import CodeEditor from './CodeEditorComponent';
import AuthPage from '../Auth/AuthPageComponent';
import 'react-resizable/css/styles.css';
import '../App.css';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface ProblemViewViewProps {
 problemId: string;
}

interface ProblemData {
 id: number;
 title: string;
 difficulty: string;
 problem_description: string;
 tags: string[];
}

const ProblemViewView: React.FC<ProblemViewViewProps> = ({ problemId }) => {
 const [dividerPosition, setDividerPosition] = useState(50); // initial position at 50%
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [problemData, setProblemData] = useState<ProblemData | null>(null);

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
   setIsAuthenticated(true);
  }
 }, []);

 useEffect(() => {
  const fetchProblemData = async () => {
   try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/problems/${problemId}`);
    if (!response.ok) {
     throw new Error('Failed to fetch problem data');
    }
    const data = await response.json();
    setProblemData(data);
   } catch (error) {
    console.error('Error fetching problem data:', error);
   }
  };

  if (isAuthenticated) {
   fetchProblemData();
  }
 }, [isAuthenticated, problemId]);

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
    {isAuthenticated ? (
      <div className="container">
       <div className="pane left-pane" style={{ width: `${dividerPosition}%` }}>
        {problemData ? (
          <div>
           <h1>{problemData.title}</h1>
           <MathJaxContext config={{
            tex2jax: {
             inlineMath: [['$', '$'], ['\\(', '\\)']],
             displayMath: [['$$', '$$'], ['\\[', '\\]']],
             processClass: 'math display'
            }
           }}>
            <MathJax>
             <div dangerouslySetInnerHTML={{ __html: problemData.problem_description }} />
            </MathJax>
           </MathJaxContext>
          </div>
        ) : (
          <p>Loading problem...</p>
        )}
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
       <div className="pane right-pane" style={{ width: `${100 - dividerPosition}%` }}>
        <CodeEditor problemName={problemData?.title ?? "invalid_name"} />
       </div>
      </div>
    ) : (
      <AuthPage onAuthSuccess={handleAuthSuccess} />
    )}
   </div>
 );
};

export default ProblemViewView;
