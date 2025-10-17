/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RightMenu({ mode }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_SERVER}/logout`);
      if (res.status === 200) {
        navigate('/login'); // v6 내비게이션
      } else {
        alert('Log Out Failed');
      }
    } catch (e) {
      alert('Log Out Failed');
    }
  };

  const isAuthed = !!user?.userData?.isAuth;

 // --- 비로그인 메뉴 아이템 ---
  const guestItems = [
    {
      key: 'signin',
      label: <Link to="/login">Signin</Link>,
    },
    {
      key: 'signup',
      label: <Link to="/register">Signup</Link>,
    },
  ];

  // --- 로그인 메뉴 아이템 ---
  const authedItems = [
    {
      key: 'logout',
      label: 'Logout',
      onClick: logoutHandler, // 항목 클릭 시 로그아웃 실행
      // danger: true, // (선택) 빨간색 항목으로 표시하고 싶으면
    },
  ];

  return (
    <Menu
      mode={mode}
      items={isAuthed ? authedItems : guestItems}
      selectable={false}
    />
  );
}

export default RightMenu;
