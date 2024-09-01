import React from 'react';
import { ProblemViewViewProps } from './types';

const ProblemPage: React.FC<ProblemViewViewProps> = ({ problemName }) => {
 return (
  <div>
   <h1>{problemName}</h1>
   <p>
    Problem description goes here.
    Testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
   </p>
   <p>
    one two three four one two three four one two three four one two three
    four one two three four one two three four one two three four one two
    three four one two three four one two three four one two three four one
    two three four one two three four one two three four one two three four
    one two three four one two three four one two three four one two three
    four one two three four one two three four one two three four one two
    three four one two three four one two three four one two three four one
    two three four one two three four one two three four one two three four
    one two three four one two three four one two three four one two three
    four one two three four one two three four one two three four one two
    three four one two three four one two three four one two three four one
    two three four one two three four one two three four one two three four
    one two three four one two three four one two three four one two three
    four one two three four one two three four one two three four{' '}
   </p>
  </div>
 );
};

export default ProblemPage;
