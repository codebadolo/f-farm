import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  Row,
  Col,
  Breadcrumb,
} from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchUserById, updateUserById } from '../../../services/userService';

const { Option } = Select;

const UserEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        setInitialLoading(true);
        const data = await fetchUserById(id);

        form.setFieldsValue({
          username: data.username,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          role: data.role,
          status: data.status,
          password: '',
          password_confirm: '',
        });
      } catch (error) {
        message.error("Erreur lors du chargement de l'utilisateur");
      } finally {
        setInitialLoading(false);
      }
    }
    loadUser();
  }, [id, form]);

  const validatePasswords = ({ getFieldValue }) => ({
    validator(_, value) {
      const password = getFieldValue('password');
      if (!value && !password) {
        // Aucun mot de passe renseigné => valide
        return Promise.resolve();
      }
      if (value !== password) {
        return Promise.reject(new Error("Les mots de passe ne correspondent pas."));
      }
      if (value && value.length < 6) {
        return Promise.reject(new Error("Le mot de passe doit contenir au moins 6 caractères."));
      }
      return Promise.resolve();
    },
  });

const onFinish = async (values) => {
  setLoading(true);
  try {
    // Supprime password_confirm car backend ne l'attend pas en update
    const { password_confirm, ...payload } = values;

    // Si mot de passe vide ou uniquement espaces => ne pas l'envoyer
    if (!payload.password || !payload.password.trim()) {
      delete payload.password;
    }

    await updateUserById(id, payload);
    message.success('Utilisateur mis à jour avec succès');
    navigate('/dashboard/users/all');
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Erreurs backend :", error.response.data);
      const allErrors = Object.values(error.response.data).flat().join(' ') || 'Erreur lors de la mise à jour';
      message.error(allErrors);
    } else {
      message.error('Erreur lors de la mise à jour');
    }
  } finally {
    setLoading(false);
  }
};


  if (initialLoading) return <Spin size="large" />;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/users/all">Gestion des utilisateurs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Modifier utilisateur</Breadcrumb.Item>
      </Breadcrumb>

      {/* Formulaire */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nom d'utilisateur"
              name="username"
              rules={[
                { required: true, message: "Veuillez saisir le nom d'utilisateur" },
                { min: 3, message: "Le nom d'utilisateur doit contenir au moins 3 caractères" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            >
              <Input />
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
              <Input />
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
              <Input />
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
              label="Statut"
              name="status"
              rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
            >
              <Select placeholder="Sélectionner un statut">
                <Option value="ACTIF">Actif</Option>
                <Option value="INACTIF">Inactif</Option>
                <Option value="SUSPENDU">Suspendu</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Champs mot de passe (optionnel) */}
          <Col span={12}>
            <Form.Item
              label="Nouveau mot de passe"
              name="password"
              hasFeedback
              rules={[
                {
                  min: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              ]}
            >
              <Input.Password placeholder="Laissez vide pour ne pas changer" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Confirmer nouveau mot de passe"
              name="password_confirm"
              dependencies={['password']}
              hasFeedback
              rules={[validatePasswords]}
            >
              <Input.Password placeholder="Confirmez le nouveau mot de passe" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Mettre à jour
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(-1)}
          >
            Annuler
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserEdit;
