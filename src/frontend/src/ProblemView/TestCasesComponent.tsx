import React, { useState } from 'react';
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
    margin: 10px 0;
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
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin: 5px 0;
  width: 100%;
  box-sizing: border-box;
`;

const HorizontalLine = styled.hr`
  border: 1px solid #abb2bf;
`;

const TestCasesComponent: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [newInput, setNewInput] = useState('');
  const [newExpectedOutput, setNewExpectedOutput] = useState('');

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: testCases.length + 1,
      input: newInput,
      expectedOutput: newExpectedOutput,
    };
    setTestCases([...testCases, newTestCase]);
    setNewInput('');
    setNewExpectedOutput('');
  };

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
          <Button onClick={runTestCases}>Run Test Cases</Button>
          <Button onClick={submitSolution}>Submit Solution</Button>
        </div>
      </TitleContainer>
      <TestCaseList>
        {testCases.map((testCase) => (
          <TestCaseItem key={testCase.id}>
            <div><strong>Input:</strong> {testCase.input}</div>
            <div><strong>Expected Output:</strong> {testCase.expectedOutput}</div>
            {testCase.actualOutput && <div><strong>Actual Output:</strong> {testCase.actualOutput}</div>}
            {testCase.stdout && <div><strong>Stdout:</strong> {testCase.stdout}</div>}
            {testCase.error && <div><strong>Error:</strong> {testCase.error}</div>}
          </TestCaseItem>
        ))}
      </TestCaseList>
      <div>
        <Input
          type="text"
          placeholder="Input"
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
        />
        <TextArea
          placeholder="Expected Output"
          value={newExpectedOutput}
          onChange={(e) => setNewExpectedOutput(e.target.value)}
        />
        <Button onClick={addTestCase}>Add Test Case</Button>
      </div>
    </Container>
  );
};

export default TestCasesComponent;
