import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { emacsStyleKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { vim } from '@replit/codemirror-vim';
import React, { useEffect, useRef, useState } from 'react';

const CodeEditor: React.FC<{ problemName: string }> = ({ problemName }) => {
 const editorRef = useRef<HTMLDivElement>(null);
 const [language, setLanguage] = useState('python');
 const [editorMode, setEditorMode] = useState('normal');

 useEffect(() => {
  if (!editorRef.current) return;

  const extensions = [basicSetup, oneDark];
  if (language === 'javascript') {
   extensions.push(javascript());
  }
  if (editorMode === 'emacs') {
   extensions.push(keymap.of(emacsStyleKeymap as any));
  } else if (editorMode === 'vim') {
   extensions.push(vim());
  }

  const view = new EditorView({
   doc: `// Write your solution here for ${problemName}. \n// Input will come through STDIN and you can print your answer\n`,
   extensions,
   parent: editorRef.current,
  });

  return () => {
   view.destroy();
  };
 }, [problemName, language, editorMode]);

 return (
   <div>
    <div className="editor-settings">
     <label>
      Language:
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
       <option value="javascript">JavaScript</option>
       <option value="python">Python</option>
       {/* Add more languages as needed */}
      </select>
     </label>
     <label>
      Editor Mode:
      <select value={editorMode} onChange={(e) => setEditorMode(e.target.value)}>
       <option value="normal">Normal</option>
       {/* <option value="emacs">Emacs</option> not sure if this works*/}
       <option value="vim">Vim</option>
      </select>
     </label>
    </div>
    <div ref={editorRef} className="code-editor" />
    <div className="test-cases">
     {/* Placeholder for test cases component */}
    </div>
   </div>
 );
};

export default CodeEditor;
