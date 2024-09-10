import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notice from '../pages/Notice';
import Search from '../pages/Search';
import NoticeForm from '../pages/NoticeForm';
import NoticeDetail from '../pages/NoticeDetail';
import CommentDetail from '../pages/CommentDetail';
import PrivateRoute from './PrivateRoute';
import Attendance from '../pages/Attendance';
import Inbody from '../pages/Inbody';
import InbodyDashboard from '../pages/InbodyDashboard';
import InbodyRegister from '../pages/InbodyRegister';
import InbodyStats from '../pages/InbodyStats';
import InbodyRanking from '../pages/InbodyRanking';
import MyPage from '../pages/MyPage';
import UserInfo from '../pages/UserInfo';
import UserEdit from '../pages/UserEdit';
import Exercise from '../pages/Exercise';
import ExerciseRecord from '../pages/ExerciseRecord';
import ExerciseStats from '../pages/ExerciseStats';
import ExerciseRank from '../pages/ExerciseRanking';
import ExerciseBoard from '../pages/ExerciseBoard';
import ExerciseMain from '../pages/ExerciseMain';
import ExerciseModified from '../pages/ExerciseModified';
import ExerciseCustom from '../pages/ExerciseCustom';
import ExerciseCalendar from '../pages/ExerciseCalendar';
import Membership from '../pages/MemberShip';
import TimeCapsule from '../pages/TimeCapsule';
import TimeCapsuleDetail from '../pages/TimeCapsuleDetail';
import FindPassword from '../pages/FindPassword';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/find-password" element={<FindPassword />} />

      <Route element={<PrivateRoute allowedRoles={['USER', 'MANAGER', 'ADMIN']} />}>
        <Route path="/main" element={<Main />} />
        <Route path="/notices" element={<Notice />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notices/register" element={<NoticeForm />} />
        <Route path="/notices/:id" element={<NoticeDetail />} />
        <Route path="/notices/:noticeId/comments/:commentId" element={<CommentDetail />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/inbody" element={<Inbody />} />
        <Route path="/inbody/dashboard" element={<InbodyDashboard />} />
        <Route path="/inbody/register" element={<InbodyRegister />} />
        <Route path="/inbody/status" element={<InbodyStats />} />
        <Route path="/inbody/ranking" element={<InbodyRanking />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/user/info" element={<UserInfo />} />
        <Route path="/mypage/user/edit" element={<UserEdit />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/exercise/record" element={<ExerciseRecord />} />
        <Route path="/exercise/stats" element={<ExerciseStats />} />
        <Route path="/exercise/rank" element={<ExerciseRank />} />
        <Route path="/exercise/board" element={<ExerciseBoard />} />
        <Route path="/exercise/main" element={<ExerciseMain />} />
        <Route path="/exercise/modified" element={<ExerciseModified />} />
        <Route path="/exercise/additional" element={<ExerciseCustom />} />
        <Route path="/exercise/calendar" element={<ExerciseCalendar />} />
        <Route path="/mypage/membership" element={<Membership/>} />
        <Route path="/timecapsule" element={<TimeCapsule/>} />
        <Route path="/timecapsule/:id" element={<TimeCapsuleDetail />} />
      </Route>
    </Routes>
  );
};

export default Router;
