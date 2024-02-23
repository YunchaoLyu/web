import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, TextField } from '@mui/material';
import { EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import CommentSection from './CommentSection';

export const PostCard = ({ post, handlePostUpdate, handlePostDelete, currentUser, token, isAdmin }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const canEditOrDelete = currentUser === post.author.username || isAdmin;

  const handleSave = () => {
    handlePostUpdate(post._id, editedTitle, editedContent);
    setEditMode(false);
  };

  const handleDelete = () => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this post?")) {
      handlePostDelete(post._id);
    }
  };

  const createMarkup = (htmlContent) => {
    return { __html: hljs.highlightAuto(htmlContent).value };
  };

  return (
    <Card raised sx={{ width: '100%', marginBottom: 2, boxShadow: 3 }}>
      <CardContent>
        {editMode ? (
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>
        ) : (
          <>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              dangerouslySetInnerHTML={createMarkup(post.content)}
            />
            <Typography variant="caption" color="text.secondary">
              {`Posted by ${post.author.username} on ${new Date(post.createdAt).toLocaleDateString()}`}
            </Typography>
            <CommentSection postId={post._id} token={token} />
          </>
        )}
      </CardContent>
      <CardActions>
        {canEditOrDelete && (
          <>
            {editMode ? (
              <Button size="small" startIcon={<SaveOutlined />} onClick={handleSave}>
                Save
              </Button>
            ) : (
              <>
                <Button size="small" startIcon={<EditOutlined />} onClick={() => setEditMode(true)}>
                  Edit
                </Button>
                <Button size="small" startIcon={<DeleteOutlined />} onClick={handleDelete} color="secondary">
                  Delete
                </Button>
              </>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};
