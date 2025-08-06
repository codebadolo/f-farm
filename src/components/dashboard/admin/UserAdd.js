import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Breadcrumb,
  Row,
  Col,
} from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../../services/userService';

const { Option } = Select;

// ...imports unchanged

const UserAdd = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let username = values.username;
      if (!username) {
        const randNum = Math.floor(Math.random() * 1000);
        username = `${values.prenom.toLowerCase()}${randNum}`;
      }

      await registerUser({ ...values, username, password_confirm: values.password });
      message.success('Utilisateur ajouté avec succès');
      navigate('/dashboard/users');
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        const allErrors = Object.values(errors).flat().join(' ');
        message.error(allErrors || 'Erreur lors de l\'ajout de l\'utilisateur');
      } else {
        message.error('Erreur lors de l\'ajout de l\'utilisateur');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Les mots de passe ne correspondent pas.'));
    },
  });

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/users">Gestion des utilisateurs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Ajouter un utilisateur</Breadcrumb.Item>
      </Breadcrumb>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            >
              <Input placeholder="Nom" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            >
              <Input placeholder="Prénom" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Nom d'utilisateur"
              name="username"
              rules={[
                { required: true, message: "Veuillez saisir le nom d'utilisateur" },
                { min: 3, message: "Le nom d'utilisateur doit contenir au moins 3 caractères" },
              ]}
            >
              <Input placeholder="Nom d'utilisateur" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Veuillez saisir l\'email' },
                { type: 'email', message: 'Email invalide' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Téléphone"
              name="telephone"
              rules={[
                {
                  pattern: /^\+?1?\d{9,15}$/,
                  message: 'Numéro de téléphone invalide, ex: +22670000000',
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Téléphone (optionnel)" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Rôle"
              name="role"
              rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
            >
              <Select placeholder="Sélectionner un rôle">
                <Option value="CLIENT">Client</Option>
                <Option value="VENDEUR">Vendeur</Option>
                <Option value="ADMIN">Administrateur</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                { required: true, message: 'Veuillez saisir le mot de passe' },
                { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Mot de passe" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Confirmer le mot de passe"
              name="password_confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Veuillez confirmer le mot de passe' },
                validatePasswords,
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Confirmer le mot de passe" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Ajouter
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate('/dashboard/users')}
          >
            Annuler
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserAdd;
