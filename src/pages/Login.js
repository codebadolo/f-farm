import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setError(null);
    setLoading(true);
    try {
      // Attempt login
      await login(values.email, values.password);
      // Redirect to originally requested page or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      // Show error message
      setError(
        err.response?.data?.non_field_errors?.[0] || 
        err.message || 
        'Email ou mot de passe incorrect'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: 8 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Connexion</Title>
      
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ email: '', password: '' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Veuillez saisir votre email' },
            { type: 'email', message: 'Email invalide' },
          ]}
        >
          <Input placeholder="Votre adresse email" />
        </Form.Item>

        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
        >
          <Input.Password placeholder="Votre mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Se connecter
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <span>Pas encore inscrit ? </span>
        <Link to="/register">Créer un compte</Link>
      </div>
    </div>
  );
};

export default Login;
