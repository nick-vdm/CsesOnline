import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { emacsStyleKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { vim } from '@replit/codemirror-vim';
import React, { useEffect, useRef, useState } from 'react';
import TestCasesComponent from './TestCasesComponent';
import styled from 'styled-components';

const Container = styled.div`
 display: flex;
 flex-direction: column;
 height: 100vh;
 background-color: #282c34; /* OneDark background color */
`;

const EditorContainer = styled.div`
 flex: 1;
 overflow: hidden;
`;

const Resizable = styled.div`
 resize: vertical;
 overflow: auto;
 background-color: #282c34;
 color: #abb2bf;
 padding: 10px;
`;

const Divider = styled.div`
 height: 10px;
 background-color: #21252b;
 cursor: row-resize;
 position: relative;
`;

const DividerDent = styled.div`
 width: 20px;
 height: 6px;
 background-color: #fff;
 border-radius: 3px;
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 transition: background-color 0.3s;
`;

const EditorSettings = styled.div`
 background-color: #282c34;
 padding: 10px;
 color: #abb2bf;
`;

const CodeEditor: React.FC<{ problemName: string }> = ({ problemName }) => {
 const editorRef = useRef<HTMLDivElement>(null);
 const [language, setLanguage] = useState('python');
 const [editorMode, setEditorMode] = useState('normal');
 const [dividerPosition, setDividerPosition] = useState(70); // initial position at 70%

 useEffect(() => {
  if (!editorRef.current) return;

  const extensions = [basicSetup, oneDark];
  if (language === 'javascript') {
   extensions.push(javascript());
  } else if (language === 'python') {
   extensions.push(python());
  }
  if (editorMode === 'emacs') {
   extensions.push(keymap.of(emacsStyleKeymap as any));
  } else if (editorMode === 'vim') {
   extensions.push(vim());
  }

  const view = new EditorView({
   doc: `# Write your solution here for ${problemName}. \n# Input will come through STDIN and you can print your answer\n`,
   extensions,
   parent: editorRef.current,
  });

  return () => {
   view.destroy();
  };
 }, [problemName, language, editorMode]);

 const handleMouseDown = () => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
 };

 const handleMouseMove = (e: MouseEvent) => {
  const newDividerPosition = (e.clientY / window.innerHeight) * 100;
  setDividerPosition(newDividerPosition);
 };

 const handleMouseUp = () => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
 };

 return (
   <Container>
    <EditorSettings>
     <label>
      Language:
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
       <option value="python">Python</option>
       <option value="javascript">JavaScript</option>
      </select>
     </label>
     <label>
      Editor Mode:
      <select value={editorMode} onChange={(e) => setEditorMode(e.target.value)}>
       <option value="normal">Normal</option>
       <option value="vim">Vim</option>
      </select>
     </label>
    </EditorSettings>
    <EditorContainer ref={editorRef} style={{ height: `${dividerPosition}%` }} />
    <Divider onMouseDown={handleMouseDown}>
     <DividerDent />
    </Divider>
    <Resizable style={{ height: `${100 - dividerPosition}%` }}>
     <TestCasesComponent />
    </Resizable>
   </Container>
 );
};

export default CodeEditor;
