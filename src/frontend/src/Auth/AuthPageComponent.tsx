import React, { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PATHS } from '../Consts';

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #282c34;
    color: #abb2bf;
`;

const FormContainer = styled.form`
    background-color: #21252b;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
`;

const FormTitle = styled.h2`
    margin-bottom: 1.5rem;
    color: #61dafb;
    text-align: center;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const FormLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    color: #abb2bf;
`;

const FormInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #abb2bf;
    background-color: #282c34;
    color: #abb2bf;
    box-sizing: border-box;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: #61dafb;
    color: #282c34;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
`;

const SwapLink = styled.a`
    display: block;
    margin-top: 1rem;
    text-align: center;
    color: #61dafb;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    margin-top: 1rem;
    text-align: center;
`;

interface AuthPageComponentProps {
 onAuthSuccess: (token: string) => void;
}

const AuthPageComponent: React.FC<AuthPageComponentProps> = ({
                                                              onAuthSuccess,
                                                             }) => {
 const location = useLocation();
 const isLogin = location.pathname === PATHS.AUTH_LOGIN;
 const [username, setUsername] = useState<string>('');
 const [password, setPassword] = useState<string>('');
 const [error, setError] = useState<string | null>(null);
 const navigate = useNavigate();

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null); // Reset error message
  console.log(process.env.REACT_APP_BACKEND_API);
  const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/signup`, {

   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify({ username: username, password: password }),
  });

  if (response.ok) {
   const data = await response.json();
   localStorage.setItem('token', data.token);
   onAuthSuccess(data.token);
   navigate('/');
  } else {
   const errorData = await response.json();
   setError(errorData.message || 'An error occurred. Please try again.');
  }
 };

 return (
  <PageContainer>
   <FormContainer onSubmit={handleSubmit}>
    <FormTitle>{isLogin ? 'Login' : 'Sign Up'}</FormTitle>
    <FormGroup>
     <FormLabel htmlFor="username">Username</FormLabel>
     <FormInput
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
     />
    </FormGroup>
    <FormGroup>
     <FormLabel htmlFor="password">Password</FormLabel>
     <FormInput
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
     />
    </FormGroup>
    <SubmitButton type="submit">
     {isLogin ? 'Login' : 'Sign Up'}
    </SubmitButton>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <SwapLink href={isLogin ? PATHS.AUTH_SIGNUP : PATHS.AUTH_LOGIN}>
     {isLogin
      ? 'Don\'t have an account? Sign Up'
      : 'Already have an account? Login'}
    </SwapLink>
   </FormContainer>
  </PageContainer>
 );
};

export default AuthPageComponent;
