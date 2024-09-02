import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

interface Submission {
  id: number;
  program_lang: string;
  title: string;
  problem_id: number;
  status: string;
  result_time_ms: number;
  result_memory_kb: number;
  submission_time: string; // New field for submission timestamp
}

const GlobalStyle = createGlobalStyle`
    body {
        background-color: #282c34;
        color: #abb2bf;
        font-family: 'Fira Code', monospace;
    }
`;

const Container = styled.div`
    padding: 20px;
    background-color: #282c34;
    color: #abb2bf;
`;

const Title = styled.h1`
    color: #abb2bf;
`;

const Subtitle = styled.h2`
    color: #abb2bf;
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #2e4451;
    border-radius: 8px;
    overflow: hidden;
`;

const TableHeader = styled.th`
    background-color: #61afef;
    color: #282c34;
    padding: 15px;
    border: 1px solid #4b5261;
    text-align: left;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #1b202b;
    }
    &:hover {
        background-color: #3b5261;
        cursor: pointer;
    }
`;

const TableCell = styled.td`
    padding: 15px;
    border: 1px solid #4b5261;
    color: #abb2bf;
`;

const ProfileView: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userExists, setUserExists] = useState<boolean>(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/${username}`);
        if (!userResponse.ok) {
          setUserExists(false);
          setLoading(false);
          return;
        }

        const submissionsResponse = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/${username}/submissions`);
        if (submissionsResponse.ok) {
          const data = await submissionsResponse.json();
          setSubmissions(data.submissions);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userExists) {
    return <ErrorMessage>User {username} not found</ErrorMessage>;
  }

  const handleRowClick = (submissionId: number) => {
    navigate(`/submission/${submissionId}`);
  };

  return (
    <Container>
      <GlobalStyle />
      <Title>{username}'s Profile</Title>
      <Subtitle>Problems Solved</Subtitle>
      {submissions.length === 0 ? (
        <div>No problems solved!</div>
      ) : (
        <Table>
          <thead>
          <tr>
            <TableHeader>Title</TableHeader>
            <TableHeader>Language</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Submitted</TableHeader>
          </tr>
          </thead>
          <tbody>
          {submissions.map((submission) => (
            <TableRow key={submission.id} onClick={() => handleRowClick(submission.id)}>
              <TableCell>{submission.title}</TableCell>
              <TableCell>{submission.program_lang}</TableCell>
              <TableCell>{submission.status}</TableCell>
              <TableCell>{new Date(submission.submission_time).toLocaleString()}</TableCell>
            </TableRow>
          ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProfileView;
