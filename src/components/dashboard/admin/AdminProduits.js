import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  message,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Image,
  Breadcrumb,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { getProduits, deleteProduit } from '../../../services/adminProductService';

const { Search } = Input;
const { Title } = Typography;

const AdminProduits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const navigate = useNavigate();

  const fetchProduits = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getProduits(params);
      const list = Array.isArray(data) ? data : data.results || [];
      setProduits(list);
      setFilteredProduits(list);
    } catch (error) {
      console.error('Erreur API:', error);
      message.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const onSearch = (value) => {
    const filtered = produits.filter(
      (prod) =>
        prod.nom.toLowerCase().includes(value.toLowerCase()) ||
        (prod.description && prod.description.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredProduits(filtered);
  };

  const handleDelete = async (slug) => {
    try {
      await deleteProduit(slug);
      message.success('Produit supprimé');
      setProduits((prev) => prev.filter((p) => p.slug !== slug));
      setFilteredProduits((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      message.error('Erreur lors de la suppression du produit');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image_principale',
      key: 'image_principale',
      render: (url) =>
        url ? <Image src={url} alt="Image produit" width={50} height={50} /> : '—',
      width: 70,
      align: 'center',
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: (a, b) => a.nom.localeCompare(b.nom),
      sortDirections: ['ascend', 'descend'],
      ellipsis: true,
    },
    {
      title: 'Catégorie',
      dataIndex: 'categorie_nom',
      key: 'categorie_nom',
      sorter: (a, b) => (a.categorie_nom || '').localeCompare(b.categorie_nom || ''),
      ellipsis: true,
    },
    {
      title: 'Vendeur',
      dataIndex: 'vendeur_nom',
      key: 'vendeur_nom',
      sorter: (a, b) => (a.vendeur_nom || '').localeCompare(b.vendeur_nom || ''),
    },
    {
      title: 'Prix (FCFA)',
      dataIndex: 'prix',
      key: 'prix',
      sorter: (a, b) => a.prix - b.prix,
      render: (prix) => prix.toLocaleString(),
      align: 'right',
      width: 110,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Publié', value: 'PUBLIE' },
        { text: 'Brouillon', value: 'BROUILLON' },
        { text: 'Archivé', value: 'ARCHIVE' },
        { text: 'Rupture', value: 'RUPTURE' },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
      align: 'center',
    },
    {
      title: 'Date ajout',
      dataIndex: 'date_ajout',
      key: 'date_ajout',
      sorter: (a, b) => new Date(a.date_ajout) - new Date(b.date_ajout),
      render: (date) => new Date(date).toLocaleDateString(),
      width: 130,
    },
    {
      title: 'Note Moyenne',
      dataIndex: 'note_moyenne',
      key: 'note_moyenne',
      sorter: (a, b) => a.note_moyenne - b.note_moyenne,
      render: (note) => (note ? note.toFixed(1) : '0.0'),
      width: 110,
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 140, // un peu plus large pour confort
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Voir">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/dashboard/products/${record.slug}`)}
              type="default"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/dashboard/products/${record.slug}/edit`)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Confirmer la suppression ?"
              onConfirm={() => handleDelete(record.slug)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb + titre + bouton Add alignés */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/dashboard">
              <HomeOutlined />
              <span>Accueil</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Produits</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={3} style={{ margin: 0, marginTop: 8 }}>
            Liste des Produits
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard/products/add')}
          >
            Ajouter un produit
          </Button>
        </Col>
      </Row>

      {/* Barre de recherche */}
      <Search
        placeholder="Rechercher par nom ou description"
        enterButton={<SearchOutlined />}
        size="middle"
        onSearch={onSearch}
        allowClear
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      {/* Tableau avec style amélioré */}
      <Table
        dataSource={filteredProduits}
        columns={columns}
        rowKey={(record) => record.id || record.slug}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
        scroll={{ x: 1400 }}
        bordered
        size="middle"
        style={{ background: '#fff' }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />

      {/* Quelques styles personnalisés en inline, tu peux aussi passer par un fichier CSS */}
      <style>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default AdminProduits;
