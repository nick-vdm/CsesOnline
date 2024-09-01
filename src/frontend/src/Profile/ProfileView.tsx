import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

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

const ErrorMessage = styled.div`
    color: red;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 20px;
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
    <div>
      <div style={{ padding: '20px' }}>
        <h1>{username}'s Profile</h1>
        <h2>Problems Solved</h2>
        {submissions.length === 0 ? (
          <div>No problems solved!</div>
        ) : (
          <ul>
            {submissions.map((submission) => (
              <li key={submission.id}>
                {submission.problem_id}:{submission.title} - Status: {submission.status} - Result: {submission.result}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
