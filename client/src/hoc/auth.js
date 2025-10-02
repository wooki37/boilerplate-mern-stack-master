// src/hoc/auth.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_actions';

function withAuth(SpecificComponent, option, adminRoute = null) {
  // option:
  //   null  => 누구나 접근 가능
  //   true  => 로그인한 유저만 접근 가능
  //   false => 로그인한 유저는 접근 불가(예: 로그인/회원가입 페이지)

  function AuthenticationCheck(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      let mounted = true;

      (async () => {
        try {
          const { payload } = await dispatch(auth());
          if (!mounted) return;

          const isAuth = !!payload?.isAuth;
          const isAdmin = !!payload?.isAdmin;

          // 1) 로그인 필수 페이지인데 비로그인
          if (option === true && !isAuth) {
            navigate('/login', { replace: true });
            return;
          }

          // 2) 관리자 전용인데 관리자가 아님
          if (adminRoute === true && !isAdmin) {
            navigate('/', { replace: true });
            return;
          }

          // 3) 비로그인 전용(로그인/회원가입)인데 로그인 상태
          if (option === false && isAuth) {
            navigate('/', { replace: true });
            return;
          }
        } catch (err) {
          // auth 요청 실패(401 등)
          if (option === true) {
            // 로그인 필수면 로그인으로
            navigate('/login', { replace: true });
          }
          // 공개 페이지나 비로그인 전용은 조용히 통과
        }
      })();

      return () => {
        mounted = false;
      };
    }, [dispatch, navigate]);

    return <SpecificComponent {...props} user={user} />;
  }

  return AuthenticationCheck;
}

export default withAuth;
