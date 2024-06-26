import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notice from '../pages/Notice';
import Search from '../pages/Search';
import NoticeForm from '../pages/NoticeForm';
import NoticeDetail from '../pages/NoticeDetail';
import PrivateRoute from './PrivateRoute';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute allowedRoles={['USER', 'MANAGER', 'ADMIN']} />}>
        <Route path="/main" element={<Main />} />
        <Route path="/notices" element={<Notice />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notices-insert" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeDetail />} />
      </Route>
    </Routes>
  );
};

export default Router;
