import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProblemSelector: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('all');
  const [problems, setProblems] = useState<
    Array<{ id: string; title: string; difficulty: string; section: string }>
  >([]);

  const handleSelectProblem = (problemId: string) => {
    navigate(`/problem/${problemId}`);
  };

  const generateRandomProblems = () => {
    const sections = ['Introduction', 'Searching and Finding', 'Graph'];
    const difficulties = ['easy', 'medium', 'hard'];
    const randomProblems = [];

    for (let i = 1; i <= 200; i++) {
      const section = sections[Math.floor(Math.random() * sections.length)];
      const difficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      randomProblems.push({
        id: `${i}`,
        title: `Problem ${i}`,
        difficulty,
        section,
      });
    }

    return randomProblems;
  };

  useEffect(() => {
    setProblems(generateRandomProblems());
  }, []);

  const filteredProblems =
    difficulty === 'all'
      ? problems
      : problems.filter((problem) => problem.difficulty === difficulty);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#282c34',
        color: '#abb2bf',
      }}
    >
      <h1 style={{ color: '#61dafb' }}>Problem Selector</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="difficulty" style={{ marginRight: '10px' }}>
          Filter by difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            padding: '5px',
            backgroundColor: '#21252b',
            color: '#abb2bf',
            border: '1px solid #444c56',
          }}
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      {['Introduction', 'Searching and Finding', 'Graph'].map((section) => (
        <div key={section} style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#e06c75' }}>{section}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px',
                    borderBottom: '1px solid #444c56',
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '5px',
                    borderBottom: '1px solid #444c56',
                  }}
                >
                  Problem Name
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '10px',
                    borderBottom: '1px solid #444c56',
                  }}
                >
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems
                .filter((problem) => problem.section === section)
                .map((problem) => (
                  <tr
                    key={problem.id}
                    onClick={() => handleSelectProblem(problem.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#3a3f4b')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #444c56',
                      }}
                    >
                      {problem.id}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #444c56',
                      }}
                    >
                      {problem.title}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        textAlign: 'right',
                        borderBottom: '1px solid #444c56',
                      }}
                    >
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ProblemSelector;
