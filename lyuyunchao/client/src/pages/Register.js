// RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send the username, email, and password to your backend
      const response = await axios.post('http://localhost:1234/users/register', {
        username,
        email,
        password,
      });
      console.log(response.data); // Handle the response from the server here
    } catch (error) {
      console.error('Registration failed:', error.response.data); // Error handling
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" style={{ color: 'blue' }}>
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           <TextField
          margin="normal"
          fullWidth
          name="adminCode"
          label="Admin Code (Optional)"
          type="text"
          id="adminCode"
          autoComplete="off"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
        />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'blue' }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
