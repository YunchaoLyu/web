// CreatePostPage.js

import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const editorStyle = {
  border: '1px solid #C0C0C0',
  padding: '5px',
  borderRadius: '4px',
  minHeight: '250px',
};

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [selectedFile, setSelectedFile] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false; // Set the flag to false when the component unmounts
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = editorState.getCurrentContent().getPlainText();

  console.log("Title:", title); // Log the title
  console.log("Content:", content); // Log the content

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:1234/post', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (isMounted.current) {
        console.log(result);
        // Redirect to the posts page or clear the form
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error creating post:', error);
      }
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Create a New Post</Typography>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <div style={editorStyle}>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
          />
        </div>
        <Box sx={{ mb: 2, mt: 2 }}>
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        <Button type="submit" variant="contained" color="primary">Submit Post</Button>
      </Box>
    </Container>
  );
}

export default CreatePostPage;
