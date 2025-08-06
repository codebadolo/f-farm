import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProduitForm from './ProduitForm';
import { createProduit } from '../../../services/vendorProductService';

const ProduitCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gérer les images en FormData si besoin
      await createProduit(values);
      message.success('Produit créé avec succès');
      navigate('/dashboard/products');
    } catch (error) {
      message.error("Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Créer un nouveau produit</h2>
      <ProduitForm onFinish={onFinish} loading={loading} />
    </div>
  );
};

export default ProduitCreate;
