import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Submission {
  id: number;
  program_lang: string;
  linked_user: number;
  problem_id: number;
  status: string;
  result: string;
  result_time_ms: number;
  result_memory_kb: number;
  submission_time: string; // Add submission_time field
}

interface SubmissionsSummaryProps {
  problemId: number;
}

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 1em;
    min-width: 400px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
`;

const TableHeader = styled.th`
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    padding: 12px 15px;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #dddddd;
    &:nth-of-type(even) {
        background-color: #f3f3f3;
    }
    &:last-of-type {
        border-bottom: 2px solid #009879;
    }
    &:hover {
        background-color: #e0e0e0; // Lighter shade for hover effect
        cursor: pointer;
    }
`;

const TableCell = styled.td`
    padding: 12px 15px;
`;

const SubmissionsSummary: React.FC<SubmissionsSummaryProps> = ({ problemId }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const username = localStorage.getItem('username');
      if (!username) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/${username}/problems/${problemId}/submissions`);
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        setSubmissions(data.submissions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const handleRowClick = (submissionId: number) => {
    window.open(`/submission/${submissionId}`, '_blank');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Submissions</h2>
      <Table>
        <thead>
        <tr>
          <TableHeader>Language</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Runtime (ms)</TableHeader>
          <TableHeader>Submission Time</TableHeader> {/* New column for submission time */}
        </tr>
        </thead>
        <tbody>
        {submissions.map((submission) => (
          <TableRow key={submission.id} onClick={() => handleRowClick(submission.id)}>
            <TableCell>{submission.program_lang}</TableCell>
            <TableCell>{submission.status}</TableCell>
            <TableCell>{submission.result_time_ms}</TableCell>
            <TableCell>{new Date(submission.submission_time).toLocaleString()}</TableCell> {/* Format submission time */}
          </TableRow>
        ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubmissionsSummary;
