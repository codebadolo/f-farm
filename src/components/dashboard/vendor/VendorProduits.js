import React, { useEffect, useState } from 'react';
import { Table, message, Button, Space, Tooltip, Popconfirm, Input } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// Après correction

// Import service API vendeur (à créer / séparer du service admin si souhaité)
import { getProduitsVendeur, deleteProduitVendeur } from '../../../services/vendorProductService';

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
      setProduits(data);
      setFilteredProduits(data);
    } catch (error) {
      message.error('Erreur chargement produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  // Recherche locale
  const onSearch = (value) => {
    const filtered = produits.filter(
      prod => prod.nom.toLowerCase().includes(value.toLowerCase()) ||
              (prod.description && prod.description.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredProduits(filtered);
  };

  const handleDelete = async (slug) => {
    try {
      await deleteProduitVendeur(slug);
      message.success('Produit supprimé');
      fetchProduits();
    } catch {
      message.error('Erreur suppression');
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
      render: (prix) => prix.toLocaleString() + ' FCFA',
      align: 'right',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir">
            <Button icon={<EyeOutlined />} onClick={() => navigate(`/vendor/products/${record.slug}`)} />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button icon={<EditOutlined />} onClick={() => navigate(`/vendor/products/${record.slug}/edit`)} />
          </Tooltip>
          <Popconfirm title="Confirmer la suppression ?" onConfirm={() => handleDelete(record.slug)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Mes produits</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/vendor/products/add')} style={{ marginBottom: 16 }}>
        Ajouter un produit
      </Button>

      <Search placeholder="Rechercher produit" enterButton={<SearchOutlined />} onSearch={onSearch} style={{ maxWidth: 400, marginBottom: 16 }} allowClear />

      <Table dataSource={filteredProduits} columns={columns} rowKey={(rec) => rec.slug} loading={loading} />
    </div>
  );
};

export default VendorProduits;
