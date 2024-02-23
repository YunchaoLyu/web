// SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PostCard } from './Post'; // 确保路径正确
import { Box, Grid } from '@mui/material';

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const currentUser = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Assuming 'isAdmin' is stored as a string
  const handlePostUpdate = async (postId, newTitle, newContent) => {
    try {
      const response = await fetch(`http://localhost:1234/post/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      setPosts(posts.map(post => post._id === postId ? { ...post, ...updatedPost } : post));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  const handlePostDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:1234/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // ... other headers if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the posts state to remove the deleted post
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  useEffect(() => {
    const fetchSearchResults = async () => {
        const response = await fetch(`http://localhost:1234/post/search?q=${searchQuery}`);
        const data = await response.json();
        setPosts(data.posts); // 直接使用 data.posts 访问搜索结果数组
      };
      

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              handlePostUpdate={handlePostUpdate}
              handlePostDelete={handlePostDelete}
              currentUser={currentUser}
              token={token}
              isAdmin={isAdmin}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchResults;
