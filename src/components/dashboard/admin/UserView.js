import React, { useEffect, useState } from 'react';
import { Descriptions, Spin, message, Button, Breadcrumb, Row, Col } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchUserById } from '../../../services/userService';

const UserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await fetchUserById(id);
        setUser(data);
      } catch (error) {
        message.error("Erreur lors du chargement de l'utilisateur");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  if (loading) return <Spin size="large" />;

  if (!user) return <p>Utilisateur non trouvé</p>;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Tableau de bord</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/users">Gestion des utilisateurs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Détails utilisateur</Breadcrumb.Item>
      </Breadcrumb>

      {/* Boutons Retour / Modifier */}
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate(`/dashboard/users/edit/${id}`)}>
            Modifier
          </Button>
        </Col>
      </Row>

      {/* Details utilisateur */}
      <Descriptions title="Détails de l'utilisateur" bordered column={1}>
        <Descriptions.Item label="Nom complet">{user.prenom} {user.nom}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{user.telephone || 'Non renseigné'}</Descriptions.Item>
        <Descriptions.Item label="Rôle">{user.role}</Descriptions.Item>
        <Descriptions.Item label="Statut">{user.status}</Descriptions.Item>
        <Descriptions.Item label="Date d'inscription">
          {new Date(user.date_inscription).toLocaleDateString()}
        </Descriptions.Item>
        {/* Ajouter d’autres champs ici si besoin */}
      </Descriptions>
    </div>
  );
};

export default UserView;
