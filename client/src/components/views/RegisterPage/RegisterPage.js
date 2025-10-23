import React from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (

    <Formik
      initialValues={{
        email: '',
        lastName: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        lastName: Yup.string()
          .required('Last Name is required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastname: values.lastName,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };

          const action = await dispatch(registerUser(dataToSubmit));
          const res = action?.payload;

          if (res?.success) {
            navigate("/login");
          } else {
            alert(res?.error || 'Failed to register');
          }
        } finally {
          setSubmitting(false);
        }
      }}
      >
        {({ values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
          <div className="app">
            <h2>Sign up</h2>

            <form style={{ minWidth: '375px' }} onSubmit={handleSubmit} >
              <Form.Item required label="Name" validateStatus={errors.name && touched.name ? "error" : ""}
              help={touched.name && errors.name}>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item required label="Last Name" validateStatus={errors.lastName && touched.lastName ? "error" : ""}
               help={touched.lastName && errors.lastName}>
                <Input
                  id="lastName"
                  placeholder="Enter your Last Name"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item required label="Email" hasFeedback validateStatus={errors.email && touched.email ? "error" : (values.email) ? 'success' : ''} 
              help={touched.email && errors.email}>
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item required label="Password" hasFeedback validateStatus={errors.password && touched.password ? "error" : (values.password) ? 'success' : ''}
              help={touched.password && errors.password}>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item required label="Confirm" hasFeedback validateStatus={errors.confirmPassword && touched.confirmPassword ? "error" : (values.confirmPassword) ? 'success' : ''}
              help={touched.confirmPassword && errors.confirmPassword}>
                <Input
                  id="confirmPassword"
                  placeholder="Enter your confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button htmlType="submit" type="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form.Item>
            </form>
          </div>
        )}
    </Formik>
  );
};

export default RegisterPage
