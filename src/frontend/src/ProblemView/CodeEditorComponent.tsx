import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import React, { useEffect, useRef } from 'react';
import { ProblemViewViewProps } from './types';

const CodeEditor: React.FC<ProblemViewViewProps> = ({ problemName }) => {
 const editorRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (!editorRef.current) return;

  const view = new EditorView({
   doc: `// Write your solution here for ${problemName}. \n// Input will come through STDIN and you can print your answer\n`,
   extensions: [basicSetup, javascript(), oneDark],
   parent: editorRef.current,
  });

  return () => {
   view.destroy();
  };
 }, [problemName]);

 return <div ref={editorRef} className="code-editor" />;
};

export default CodeEditor;
