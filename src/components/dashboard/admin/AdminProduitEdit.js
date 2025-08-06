import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const AdminProduitEdit = () => {
  const { slug } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Charger le produit
    const fetchProduit = async () => {
      try {
        setInitialLoading(true);
        const [produitRes, catsRes] = await Promise.all([
          axios.get(`/api/products/${slug}/`),
          axios.get('/api/products/categories/'),
        ]);
        const produit = produitRes.data;
        setCategories(catsRes.data);

        // Initialiser le formulaire avec les données du produit (attention noms de champs)
        form.setFieldsValue({
          nom: produit.nom,
          description: produit.description,
          prix: produit.prix,
          categorie_id: produit.categorie?.id,
          status: produit.status,
        });
      } catch (error) {
        message.error("Erreur chargement du produit");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProduit();
  }, [slug, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`/api/products/${slug}/update/`, values);
      message.success('Produit mis à jour');
      navigate('/admin/products');
    } catch {
      message.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Spin size="large" style={{ padding: 100 }} />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Modifier le produit</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="prix" label="Prix (FCFA)" rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber style={{ width: '100%' }} min={0} step={100} />
        </Form.Item>

        <Form.Item name="categorie_id" label="Catégorie" rules={[{ required: true }]}>
          <Select placeholder="Sélectionner une catégorie">
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id}>{cat.nom}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Statut" rules={[{ required: true }]}>
          <Select>
            <Option value="BROUILLON">Brouillon</Option>
            <Option value="PUBLIE">Publié</Option>
            <Option value="ARCHIVE">Archivé</Option>
            <Option value="RUPTURE">Rupture de stock</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Enregistrer</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminProduitEdit;
