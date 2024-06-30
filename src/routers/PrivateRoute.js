import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 수정: import from 'jwt-decode'
import { Alert } from 'react-bootstrap';

const getUserRoleAndStatusFromToken = (token) => {
  if (typeof token !== 'string') {
    return { roles: [], status: 'ING' };
  }

  try {
    const decoded = jwtDecode(token);
    return {
      roles: decoded.roles || [],
      status: decoded.status || 'ING',
    };
  } catch (error) {
    console.error('Failed to decode token', error);
    return { roles: [], status: 'ING' };
  }
};

const PrivateRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const { roles, status } = getUserRoleAndStatusFromToken(token);

    if (!token || !allowedRoles.some(role => roles.includes(role)) || status === 'WAIT' || status === 'STOP') {
      setIsAuthorized(false);
      setShowAlert(true);
    } else {
      setIsAuthorized(true);
    }
  }, [allowedRoles, token]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate('/login'); // 경고 메시지를 닫을 때 로그인 페이지로 리디렉션
  };

  return (
    <>
      {showAlert && (
        <Alert variant="danger" onClose={handleCloseAlert} dismissible>
          접근 권한이 없습니다.
        </Alert>
      )}
      {isAuthorized ? <Outlet /> : null}
    </>
  );
};

export default PrivateRoute;
