// src/components/views/LoginPage/LoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ v6
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";

import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // ✅ antd v5

const { Title } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ v6
  const rememberMeChecked = !!localStorage.getItem("rememberMe");

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => setRememberMe(!rememberMe);

  const initialEmail = localStorage.getItem("rememberMe") || "";

  return (
    <Formik
      initialValues={{ email: initialEmail, password: "" }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email("Email is invalid").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        const dataToSubmit = { email: values.email, password: values.password };

        dispatch(loginUser(dataToSubmit))
          .then((response) => {
            if (response.payload?.loginSuccess) {
              window.localStorage.setItem("userId", response.payload.userId);

              // ✅ rememberMe는 email을 저장하는 게 일반적입니다.
              if (rememberMe) {
                window.localStorage.setItem("rememberMe", values.email);
              } else {
                localStorage.removeItem("rememberMe");
              }

              // ✅ v6 라우팅
              navigate("/", { replace: true });
            } else {
              setFormErrorMessage("Check your account or password again");
            }
          })
          .catch(() => {
            setFormErrorMessage("Check your account or password again");
            setTimeout(() => setFormErrorMessage(""), 3000);
          })
          .finally(() => setSubmitting(false));
      }}
    >
      {(formik) => {
        const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = formik;

        return (
          <div className="app">
            <Title level={2}>Log In</Title>
            <form onSubmit={handleSubmit} style={{ width: "350px" }}>
              <Form.Item required>
                <Input
                  id="email"
                  name="email"
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? "text-input error" : "text-input"}
                />
                {errors.email && touched.email && <div className="input-feedback">{errors.email}</div>}
              </Form.Item>

              <Form.Item required>
                <Input.Password
                  id="password"
                  name="password"
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password ? "text-input error" : "text-input"}
                />
                {errors.password && touched.password && <div className="input-feedback">{errors.password}</div>}
              </Form.Item>

              {formErrorMessage && (
                <label>
                  <p
                    style={{
                      color: "#ff0000bf",
                      fontSize: "0.7rem",
                      border: "1px solid",
                      padding: "1rem",
                      borderRadius: "10px",
                    }}
                  >
                    {formErrorMessage}
                  </p>
                </label>
              )}

              <Form.Item>
                <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>
                  Remember me
                </Checkbox>

                <Link to="/reset_user" className="login-form-forgot" style={{ float: "right" }}>
                  forgot password
                </Link>

                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ minWidth: "100%" }}
                    disabled={isSubmitting}
                  >
                    Log in
                  </Button>
                </div>

                Or <Link to="/register">register now!</Link>
              </Form.Item>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default LoginPage; // ✅ withRouter 제거
