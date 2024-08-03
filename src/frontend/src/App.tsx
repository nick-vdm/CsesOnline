import React from 'react';
import { ResizableBox } from 'react-resizable';
import ProblemPage from './ProblemPage';
import CodeEditor from './CodeEditor';
import 'react-resizable/css/styles.css';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="container">
      <ResizableBox
        className="resizable left-pane"
        width={window.innerWidth * 0.4}
        height={Infinity}
        minConstraints={[0, Infinity]}
        maxConstraints={[window.innerWidth * 0.8, Infinity]}
        axis="x"
      >
        <ProblemPage />
      </ResizableBox>
      <div className="right-pane">
        <CodeEditor />
      </div>
    </div>
  );
};

export default App;
