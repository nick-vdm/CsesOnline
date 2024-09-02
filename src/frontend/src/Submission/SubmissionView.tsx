// SubmissionView.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const PageWrapper = styled.div`
    min-height: 100vh;
    background-color: #282c34; /* OneDark background color */
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #282c34; /* OneDark background color */
    color: #abb2bf; /* OneDark text color */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    width: 80%;
    max-width: 800px;
`;

const Title = styled.h1`
    color: #61afef; /* OneDark accent color */
`;

const Detail = styled.div`
    margin-bottom: 10px;
`;

const CodeBlockContainer = styled.div`
    margin-bottom: 10px;
    border: 4px solid #3e4451; /* OneDark border color */
    border-radius: 4px;
    overflow: hidden; /* Ensures border-radius applies to CodeMirror content */
    background-color: #2c313c; /* Matches CodeMirror background */
`;

interface Submission {
  id: number;
  program_lang: string;
  linked_user: number;
  problem_id: number;
  status: string;
  result: string;
  result_time_ms: number;
  result_memory_kb: number;
  code: string;
  output_text: string;
  error_text: string;
  _links: {
    collection: {
      href: string;
    };
    self: {
      href: string;
    };
  };
}

const SubmissionView: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/submissions/${submissionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  if (!submission) {
    return <Container>Loading...</Container>;
  }

  return (
    <PageWrapper>
      <Container>
        <Title>Submission Details</Title>
        <Detail><strong>ID:</strong> {submission.id}</Detail>
        <Detail><strong>Language:</strong> {submission.program_lang}</Detail>
        <Detail><strong>User ID:</strong> {submission.linked_user}</Detail>
        <Detail><strong>Problem ID:</strong> {submission.problem_id}</Detail>
        <Detail><strong>Status:</strong> {submission.status}</Detail>
        <Detail><strong>Result:</strong> {submission.result}</Detail>
        <Detail><strong>Execution Time (ms):</strong> {submission.result_time_ms}</Detail>
        <Detail><strong>Memory Usage (KB):</strong> {submission.result_memory_kb}</Detail>

        <Detail><strong>Code:</strong></Detail>
        <CodeBlockContainer>
          <CodeMirror
            value={submission.code}
            extensions={[javascript()]} // Adjust according to your language
            theme={oneDark}
            readOnly={true}
            basicSetup={{ lineNumbers: true }}
          />
        </CodeBlockContainer>

        <Detail><strong>Output:</strong></Detail>
        <CodeBlockContainer>
          <CodeMirror
            value={submission.output_text}
            extensions={[javascript()]} // Adjust according to your language
            theme={oneDark}
            readOnly={true}
            basicSetup={{ lineNumbers: true }}
          />
        </CodeBlockContainer>

        <Detail><strong>Error:</strong></Detail>
        <CodeBlockContainer>
          <CodeMirror
            value={submission.error_text}
            extensions={[javascript()]} // Adjust according to your language
            theme={oneDark}
            readOnly={true}
            basicSetup={{ lineNumbers: true }}
          />
        </CodeBlockContainer>
      </Container>
    </PageWrapper>
  );
};

export default SubmissionView;
