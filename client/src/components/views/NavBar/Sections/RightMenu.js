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

  if (!isAuthed) {
    return (
      <Menu mode={mode}>
        <Menu.Item key="signin">
          <Link to="/login">Signin</Link>
        </Menu.Item>
        <Menu.Item key="signup">
          <Link to="/register">Signup</Link>
        </Menu.Item>
      </Menu>
    );
  }

  return (
    <Menu mode={mode}>
      <Menu.Item key="logout" onClick={logoutHandler}>
        Logout
      </Menu.Item>
    </Menu>
  );
}

export default RightMenu;
