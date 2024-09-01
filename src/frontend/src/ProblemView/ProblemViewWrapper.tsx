import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProblemViewView from './ProblemViewView';

interface ProblemData {
  id: number;
  title: string;
  difficulty: string;
  problem_description: string;
  tags: string[];
}

const ProblemViewWrapper: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [problemData, setProblemData] = useState<ProblemData | null>(null);

  useEffect(() => {
    if (problemId) {
      const fetchProblemData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/problems/${problemId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch problem data');
          }
          const data = await response.json();
          setProblemData(data);
        } catch (error) {
          console.error('Error fetching problem data:', error);
        }
      };

      fetchProblemData();
    }
  }, [problemId]);

  if (!problemId) {
    return <div>Problem ID is missing</div>;
  }

  return problemData ? <ProblemViewView problemData={problemData} /> : <div>Loading problem...</div>;
};

export default ProblemViewWrapper;
