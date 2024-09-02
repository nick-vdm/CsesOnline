import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  stdout?: string;
  error?: string;
}

const Container = styled.div`
    padding: 20px;
    background-color: #282c34;
    color: #abb2bf;
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    color: #abb2bf;
`;

const Button = styled.button`
    background-color: #61dafb;
    color: #282c34;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    border-radius: 5px;
`;

const TestCaseList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const TestCaseItem = styled.li`
    background-color: #282c34;
    color: #abb2bf;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #abb2bf;
    border-radius: 5px;
`;

const Input = styled.input`
    padding: 10px;
    margin: 5px 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #21252b;
    color: #abb2bf;
    border: 1px solid #abb2bf;
    border-radius: 5px;
`;

const HorizontalLine = styled.hr`
    border: 1px solid #abb2bf;
`;

const TestCasesComponent: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [newInput, setNewInput] = useState('');

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: testCases.length + 1,
      input: newInput,
      expectedOutput: '', // Placeholder for expected output
    };
    setTestCases([...testCases, newTestCase]);
    setNewInput('');
  };

  useEffect(() => {
    addTestCase();
  }, []);

  const runTestCases = () => {
    // Implement logic to run test cases and update actualOutput, stdout, and error
  };

  const submitSolution = () => {
    // Implement logic to submit the solution against all test cases

  };

  return (
    <Container>
      <HorizontalLine />
      <TitleContainer>
        <Title>Test Cases</Title>
        <div>
          <Button onClick={addTestCase}>Add Test Case</Button>
          <Button onClick={runTestCases}>Run Test Cases</Button>
          <Button onClick={submitSolution}>Submit Solution</Button>
        </div>
      </TitleContainer>
      <TestCaseList>
        {testCases.map((testCase) => (
          <TestCaseItem key={testCase.id}>
            <div>
              <strong>Input:</strong>
              <Input
                type="text"
                value={testCase.input}
                onChange={(e) => {
                  const updatedTestCases = testCases.map((tc) =>
                    tc.id === testCase.id ? { ...tc, input: e.target.value } : tc
                  );
                  setTestCases(updatedTestCases);
                }}
              />
            </div>
            {testCase.actualOutput && <div><strong>Actual Output:</strong> {testCase.actualOutput}</div>}
            {testCase.stdout && <div><strong>Stdout:</strong> {testCase.stdout}</div>}
            {testCase.error && <div><strong>Error:</strong> {testCase.error}</div>}
          </TestCaseItem>
        ))}
      </TestCaseList>
      <div>
      </div>
    </Container>
  );
};

export default TestCasesComponent;
