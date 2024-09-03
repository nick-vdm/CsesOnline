import React, { useEffect, useState } from 'react';
import CodeEditor from './CodeEditorComponent';
import AuthPage from '../Auth/AuthPageComponent';
import SubmissionsSummary from './SubmissionsSummary';
import 'react-resizable/css/styles.css';
import '../App.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import styled from 'styled-components';

interface ProblemViewViewProps {
  problemData: {
    id: number;
    title: string;
    difficulty: string;
    problem_description: string;
    tags: string[];
  };
}

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const Pane = styled.div<{ width: number }>`
    width: ${(props) => props.width}%;
    overflow-y: auto;
    background-color: #282c34;
`;

const Divider = styled.div`
    width: 10px;
    background-color: #21252b;
    cursor: col-resize;
    position: relative;
`;

const DividerDent = styled.div`
    width: 6px;
    height: 20px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: background-color 0.3s;
`;

const TabPicker = styled.div`
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #abb2bf;
    background-color: transparent;
    border-radius: 5px 5px 0 0;
`;

const TabButton = styled.button<{ active: boolean }>`
    background-color: ${(props) => (props.active ? '#61dafb' : '#282c34')};
    color: ${(props) => (props.active ? '#282c34' : '#abb2bf')};
    border: 1px solid #abb2bf;
    border-bottom: ${(props) => (props.active ? 'none' : '1px solid #abb2bf')};
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px 5px 0 0;
    margin-right: 10px;
    &:hover {
        color: #61dafb;
    }
`;

const Content = styled.div`
    padding: 20px;
    background-color: #282c34;
    color: #abb2bf;
    border-radius: 5px;
`;

const Title = styled.h1`
    color: #61dafb;
    background-color: #282c34;
    padding: 20px;
    border-radius: 5px;
`;

const ProblemViewView: React.FC<ProblemViewViewProps> = ({ problemData }) => {
  const [dividerPosition, setDividerPosition] = useState(50); // initial position at 50%
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // state to manage active tab

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

  useEffect(() => {
    if (activeTab === 'description') {
      const mathElements = document.getElementsByClassName('math');
      for (let element of mathElements) {
        katex.render(element.textContent || '', element as HTMLElement, {
          displayMode: element.classList.contains('display'),
          throwOnError: false,
        });
      }
    }
  }, [activeTab]);

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
        <Container>
          <Pane width={dividerPosition}>
            <div>
              <Title>{problemData.title}</Title>
              <TabPicker>
                <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>
                  Problem Description
                </TabButton>
                <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>
                  Submissions
                </TabButton>
              </TabPicker>
              <Content>
                {activeTab === 'description' && (
                  <div dangerouslySetInnerHTML={{ __html: problemData.problem_description }} />
                )}
                {activeTab === 'submissions' && (
                  <SubmissionsSummary problemId={problemData.id} />
                )}
              </Content>
            </div>
          </Pane>
          <Divider onMouseDown={handleMouseDown}>
            <DividerDent />
          </Divider>
          <Pane width={100 - dividerPosition}>
            <CodeEditor problemName={problemData?.title ?? 'invalid_name'} problemId={problemData?.id ?? -1} />
          </Pane>
        </Container>
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default ProblemViewView;
