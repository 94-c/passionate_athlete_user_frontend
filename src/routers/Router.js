import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notice from '../pages/Notice';
import Search from '../pages/Search'; 
import PostForm from '../pages/PostForm';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/search" element={<Search />} /> 
      <Route path="/notices-insert" element={<PostForm />} />
    </Routes>
  );
};

export default AppRoutes;
