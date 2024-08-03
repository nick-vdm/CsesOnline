import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import React, { useRef, useEffect } from 'react';

const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: `// Write your solution here\n`,
      extensions: [basicSetup, javascript(), oneDark],
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editorRef} className="code-editor" />;
};

export default CodeEditor;
