import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import React, { useRef, useEffect } from 'react';
import { ProblemViewViewProps } from './types';

const CodeEditor: React.FC<ProblemViewViewProps> = ({ problem }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: `// Write your solution here for ${problem}\n`,
      extensions: [basicSetup, javascript(), oneDark],
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [problem]);

  return <div ref={editorRef} className="code-editor" />;
};

export default CodeEditor;
