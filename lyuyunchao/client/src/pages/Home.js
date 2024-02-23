import React, { useState, useEffect } from 'react';
import { PostCard } from '../component/Post';
import { Box, Grid } from '@mui/material';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Assuming 'isAdmin' is stored as a string

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:1234/post?page=${page}&limit=10`);
        const data = await response.json();

        if (data.posts && Array.isArray(data.posts)) {
          const newUniquePosts = data.posts.filter(newPost => 
            !posts.some(existingPost => existingPost._id === newPost._id)
          );
          setPosts(prevPosts => {
            const combinedPosts = [...prevPosts, ...newUniquePosts];
            const uniquePostSet = new Set(combinedPosts.map(p => p._id));
            return Array.from(uniquePostSet).map(id => combinedPosts.find(p => p._id === id));
          });
          setHasMore(data.currentPage < data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasMore) {
      fetchPosts();
    }
  }, [page, hasMore, posts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || isLoading) return;
      setPage(prevPage => prevPage + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

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
              isAdmin={isAdmin} // Pass isAdmin flag to PostCard
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
