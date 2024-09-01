import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

interface Submission {
  id: number;
  program_lang: string;
  title: string;
  problem_id: number;
  status: string;
  result: string;
  result_time_ms: number;
  result_memory_kb: number;
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

const SubmissionList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const SubmissionItem = styled.li`
    background-color: #282c34;
    color: #abb2bf;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #abb2bf;
    border-radius: 5px;
`;

const ProfileView: React.FC = () => {
  const { username } = useParams<{ username: string }>();
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

  return (
    <Container>
      <GlobalStyle />
      <Title>{username}'s Profile</Title>
      <Subtitle>Problems Solved</Subtitle>
      {submissions.length === 0 ? (
        <div>No problems solved!</div>
      ) : (
        <SubmissionList>
          {submissions.map((submission) => (
            <SubmissionItem key={submission.id}>
              {submission.problem_id}: {submission.title} - Status: {submission.status} - Result: {submission.result}
            </SubmissionItem>
          ))}
        </SubmissionList>
      )}
    </Container>
  );
};

export default ProfileView;
