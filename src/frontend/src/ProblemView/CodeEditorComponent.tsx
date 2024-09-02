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
    background-color: #282c34; /* OneDark background color */
`;

const EditorContainer = styled.div`
    flex: 1;
    overflow: hidden;
`;

const ControlBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #21252b; /* Atom One Dark background color */
    padding: 10px 20px; /* Adjusted padding for better spacing */
    color: #abb2bf; /* Atom One Dark text color */
    border-bottom: 1px solid #3e4451; /* Atom One Dark border color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
`;

const Select = styled.select`
    background-color: #2c313c; /* Atom One Dark select background */
    color: #abb2bf; /* Atom One Dark select text color */
    border: 1px solid #3e4451; /* Atom One Dark select border */
    padding: 5px;
    margin-left: 10px;
    border-radius: 4px; /* Rounded corners for better aesthetics */
`;

const Button = styled.button`
    background-color: #61dafb; /* Atom One Dark button background */
    color: #282c34; /* Atom One Dark button text color */
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 4px; /* Rounded corners for better aesthetics */

    &:hover {
        background-color: #528bff; /* Atom One Dark button hover background */
    }
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
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </label>
          <label>
            Editor Mode:
            <Select value={editorMode} onChange={(e) => setEditorMode(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="vim">Vim</option>
            </Select>
          </label>
        </div>
        <Button onClick={handleSubmit}>Submit</Button>
      </ControlBar>
      <EditorContainer ref={editorRef} />
    </Container>
  );
};

export default CodeEditor;
