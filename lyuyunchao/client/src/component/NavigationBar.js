// NavigationBar.js

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // 使用 useNavigate 替换 useHistory
import SearchIcon from '@mui/icons-material/Search';

export const NavigationBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // 使用 useNavigate hook

  const handleSearch = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    navigate(`/search?q=${searchTerm}`); // 使用 navigate 进行导航
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>

        {/* 直接链接在工具栏 */}
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <Button color="inherit" component={Link} to="/register">Register</Button>
        <Button color="inherit" component={Link} to="/createpost">Create Post</Button>
        {/* 根据需要添加更多按钮 */}

        <div>
          <form onSubmit={handleSearch}> {/* 添加表单并处理提交事件 */}
            <SearchIcon />
            <InputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </Toolbar>
    </AppBar>
  );
};
