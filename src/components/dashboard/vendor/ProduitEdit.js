import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ProduitForm from './ProduitForm';
import { getProduitBySlug, updateProduit } from '../../../services/vendorProductService';

const ProduitEdit = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduit() {
      try {
        setInitialLoading(true);
        const data = await getProduitBySlug(slug);
        // Adapter si necessaire la structure des images / attributs ici
        setInitialValues(data);
      } catch (error) {
        message.error("Erreur lors du chargement du produit");
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProduit();
  }, [slug]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateProduit(slug, values);
      message.success('Produit mis à jour avec succès');
      navigate('/dashboard/products');
    } catch (error) {
      message.error("Erreur lors de la mise à jour du produit");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>Modifier le produit</h2>
      <ProduitForm onFinish={onFinish} initialValues={initialValues} loading={loading} />
    </div>
  );
};

export default ProduitEdit;
