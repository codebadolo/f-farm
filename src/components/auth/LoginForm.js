import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Form, Input, Button, Alert } from 'antd';

const LoginForm = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setError(null);
    try {
      await login(values.email, values.password);
      // Redirect or notify success
    } catch (err) {
      setError('Email or password incorrect');
    }
  };

  return (
    <>
      {error && <Alert message={error} type="error" />}
      <Form name="login" onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Log in</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
