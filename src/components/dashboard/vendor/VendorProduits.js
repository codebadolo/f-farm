import React, { useEffect, useState } from 'react';
import {
  Table,
  message,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Input,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getProduitsVendeur,
  deleteProduitVendeur,
} from '../../../services/vendorProductService';

const { Search } = Input;

const VendorProduits = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProduits = async () => {
    setLoading(true);
    try {
      const data = await getProduitsVendeur();

      // Ensure valid array
      const produitsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.produits)
        ? data.produits
        : [];

      setProduits(produitsArray);
      setFilteredProduits(produitsArray);
    } catch (error) {
      message.error("Erreur lors du chargement des produits");
      setProduits([]);
      setFilteredProduits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const onSearch = (value) => {
    const search = value.toLowerCase();
    const filtered = produits.filter((prod) =>
      prod.nom.toLowerCase().includes(search) ||
      (prod.description && prod.description.toLowerCase().includes(search))
    );
    setFilteredProduits(filtered);
  };

  const handleDelete = async (slug) => {
    try {
      await deleteProduitVendeur(slug);
      message.success('Produit supprimé avec succès');
      fetchProduits();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      render: (prix) => `${prix.toLocaleString()} FCFA`,
      align: 'right',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/vendor/products/${record.slug}`)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/vendor/products/${record.slug}/edit`)}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmer la suppression ?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Oui"
            cancelText="Non"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Mes produits</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate('/vendor/products/add')}
        style={{ marginBottom: 16 }}
      >
        Ajouter un produit
      </Button>

      <Search
        placeholder="Rechercher un produit"
        enterButton={<SearchOutlined />}
        onSearch={onSearch}
        allowClear
        style={{ maxWidth: 400, marginBottom: 16 }}
      />

      <Table
        dataSource={filteredProduits}
        columns={columns}
        rowKey={(record) => record.slug}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default VendorProduits;
