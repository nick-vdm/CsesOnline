import React, { useEffect, useState } from 'react';
import CodeEditor from './CodeEditorComponent';
import AuthPage from '../Auth/AuthPageComponent';
import 'react-resizable/css/styles.css';
import '../App.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface ProblemViewViewProps {
  problemData: {
    id: number;
    title: string;
    difficulty: string;
    problem_description: string;
    tags: string[];
  };
}

const ProblemViewView: React.FC<ProblemViewViewProps> = ({ problemData }) => {
  const [dividerPosition, setDividerPosition] = useState(50); // initial position at 50%
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (problemData) {
      const mathElements = document.getElementsByClassName('math');
      for (let element of mathElements) {
        katex.render(element.textContent || '', element as HTMLElement, {
          displayMode: element.classList.contains('display'),
          throwOnError: false,
        });
      }
    }
  }, [problemData]);

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
            <div>
              <h1>{problemData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: problemData.problem_description }} />
              <div style={{ height: '200px' }}> </div>
            </div>
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
            <CodeEditor problemName={problemData?.title ?? 'invalid_name'} />
          </div>
        </div>
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default ProblemViewView;
