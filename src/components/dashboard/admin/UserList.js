import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Input,
  Breadcrumb,
  Tag,
  Row,
  Col,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUserById } from '../../../services/userService';

const { confirm } = Modal;
const { Search } = Input;

const statusColors = {
  ACTIF: 'green',
  INACTIF: 'volcano',
  SUSPENDU: 'red',
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const loadUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;

      const data = await fetchUsers(params);
      setUsers(data.results || data); // adjust if paginated
    } catch (error) {
      message.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSearch = (value) => {
    setSearchText(value);
    loadUsers({ search: value });
  };

  const handleDelete = (userId) => {
    confirm({
      title: 'Confirmer la suppression',
      icon: <ExclamationCircleOutlined />,
      content: 'Voulez-vous vraiment supprimer cet utilisateur ?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await deleteUserById(userId);
          message.success('Utilisateur supprimé');
          loadUsers({ search: searchText });
        } catch (error) {
          message.error('Erreur lors de la suppression');
        }
      },
    });
  };

const columns = [
  {
    title: 'Nom',
    dataIndex: 'nom',   // correspond au champ 'nom' de l'objet utilisateur
    key: 'nom',
    sorter: (a, b) => (a.nom || '').localeCompare(b.nom || ''),
  },
  {
    title: 'Prénom',
    dataIndex: 'prenom',  // champ 'prenom'
    key: 'prenom',
    sorter: (a, b) => (a.prenom || '').localeCompare(b.prenom || ''),
  },
  {
    title: 'Téléphone',
    dataIndex: 'telephone',  // champ 'telephone'
    key: 'telephone',
    render: (text) => text || 'Non renseigné',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: 'Rôle',
    dataIndex: 'role',
    key: 'role',
    filters: [
      { text: 'Admin', value: 'ADMIN' },
      { text: 'Vendeur', value: 'VENDEUR' },
      { text: 'Client', value: 'CLIENT' },
    ],
    onFilter: (value, record) => record.role === value,
  },
  {
    title: 'Statut',
    dataIndex: 'status',
    key: 'status',
    filters: [
      { text: 'Actif', value: 'ACTIF' },
      { text: 'Inactif', value: 'INACTIF' },
      { text: 'Suspendu', value: 'SUSPENDU' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => (
      <Tag color={statusColors[status] || 'default'} key={status}>
        {status}
      </Tag>
    ),
  },
 {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/dashboard/users/view/${record.id}`)}
            title="Voir"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/users/edit/${record.id}`)}
            title="Modifier"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Supprimer"
          />
        </Space>
      ),
    },
];

    


  return (
    <div>
      {/* Breadcrumb + Add User Button */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item>Tableau de bord</Breadcrumb.Item>
            <Breadcrumb.Item>Gestion des utilisateurs</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard/users/add')}
          >
            Ajouter un utilisateur
          </Button>
        </Col>
      </Row>

      <Search
        placeholder="Rechercher par nom, email..."
        allowClear
        enterButton="Rechercher"
        size="middle"
        style={{ marginBottom: 16, width: 350 }}
        onSearch={onSearch}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default UserList;
