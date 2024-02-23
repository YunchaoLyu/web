// SideContent.js

import React from 'react';
import { Paper, Typography } from '@mui/material';
import { List, ListItem } from 'antd';

export const SideContent = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Trending Topics</Typography>
      <List>
        {/* List items */}
      </List>
    </Paper>
  );
};
