import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { emacsStyleKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { vim } from '@replit/codemirror-vim';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #282c34;
`;

const EditorContainer = styled.div`
    flex: 1;
    overflow: hidden;
`;

const ControlBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #282c34;
    padding: 10px;
    color: #abb2bf;
`;

const CodeEditor: React.FC<{ problemName: string }> = ({ problemName }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState('python');
  const [editorMode, setEditorMode] = useState('normal');

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


  const handleSubmit = () => {
    // Handle the submission logic here
    console.log('Submit button clicked');
  };

  return (
    <Container>
      <ControlBar>
        <div>
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
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </ControlBar>
      <EditorContainer ref={editorRef} />
    </Container>
  );
};

export default CodeEditor;
