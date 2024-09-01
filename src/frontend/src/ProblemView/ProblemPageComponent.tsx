import React, { useEffect, useState } from 'react';
import ProblemViewView from './ProblemViewView';

interface ProblemData {
  id: number;
  title: string;
  difficulty: string;
  problem_description: string;
  tags: string[];
}

interface ProblemPageProps {
  problemId: string;
}

const ProblemPage: React.FC<ProblemPageProps> = ({ problemId }) => {
  const [problemData, setProblemData] = useState<ProblemData | null>(null);

  useEffect(() => {
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
  }, [problemId]);

  return (
    <div>
      {problemData ? (
        <ProblemViewView problemData={problemData} />
      ) : (
        <p>Loading problem...</p>
      )}
    </div>
  );
};

export default ProblemPage;
