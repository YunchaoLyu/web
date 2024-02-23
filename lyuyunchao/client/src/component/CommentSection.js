import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { SendOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const CommentSection = ({ postId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments for the post
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:1234/post/${postId}/comments`);
        const data = await response.json();
        console.log(data)
        const formattedComments = data.map(comment => ({ ...comment, isEditing: false, editedContent: comment.content }));
        setComments(formattedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);
  const handleCommentSubmit = async () => {
    try {
      console.log(`Submitting comment for post ${postId} with token ${token}:`, newComment);
      const response = await fetch(`http://localhost:1234/post/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment })
      });
  
      if (!response.ok) {
        const errorDetails = await response.json(); // Assuming the server sends JSON-formatted error messages
        console.error(`HTTP error! status: ${response.status}`, errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`, errorDetails);
      }
  
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  
  
  const toggleEdit = (commentId) => {
    setComments(comments.map(comment => {
      if (comment._id === commentId) {
        return { ...comment, isEditing: !comment.isEditing };
      }
      return comment;
    }));
  };

  const handleEditChange = (commentId, content) => {
    setComments(comments.map(comment => {
      if (comment._id === commentId) {
        return { ...comment, editedContent: content };
      }
      return comment;
    }));
  };

  const handleSaveEdit = async (commentId) => {
    const editedComment = comments.find(comment => comment._id === commentId);
    try {
      const response = await fetch(`http://localhost:1234/post/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedComment.editedContent })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedComment = await response.json();
      setComments(comments.map(comment => comment._id === commentId ? { ...updatedComment, isEditing: false } : comment));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>Comments:</Typography>
      {comments.map(comment => (
        <div key={comment._id}>
          {comment.isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              value={comment.editedContent}
              onChange={(e) => handleEditChange(comment._id, e.target.value)}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
        {/* Check if author exists and has a username */}
        {comment.author ? `${comment.author.username}: ${comment.content}` : `Unknown user: ${comment.content}`}
      </Typography>
          )}
          <Button 
            size="small" 
            startIcon={comment.isEditing ? <SaveOutlined /> : <EditOutlined />} 
            onClick={() => comment.isEditing ? handleSaveEdit(comment._id) : toggleEdit(comment._id)}
          >
            {comment.isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      ))}
      <TextField
        fullWidth
        variant="outlined"
        label="New Comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        margin="normal"
      />
      <Button size="small" startIcon={<SendOutlined />} onClick={handleCommentSubmit}>
        Post Comment
      </Button>
    </div>
  );
};

export default CommentSection;
