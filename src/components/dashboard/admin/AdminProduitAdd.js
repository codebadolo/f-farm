import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  DatePicker,
  Switch,
  Breadcrumb,
  Row,
  Col,
  Typography,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';

// Import des fonctions API centralisées
import { createProduit, getCategories } from '../../../services/adminProductService';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const AdminProduitAdd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const list = Array.isArray(data) ? data : data.results || [];
        setCategories(list);
      } catch {
        message.error('Erreur chargement catégories');
      }
    };

    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date_peremption: values.date_peremption ? values.date_peremption.format('YYYY-MM-DD') : null,
        featured: !!values.featured,
      };

      // Utilisation de la fonction createProduit du service
      await createProduit(payload);

      message.success('Produit créé avec succès');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Erreur création produit:', error);
      message.error('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: 'auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Accueil</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dashboard/products">Produits</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Nouvel article</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} style={{ marginBottom: 24 }}>
        Ajouter un produit
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'BROUILLON', featured: false }}
        scrollToFirstError
      >
        <Row gutter={24}>
          {/* Colonne gauche */}
          <Col xs={24} md={12}>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: 'Veuillez saisir le nom du produit' }]}
            >
              <Input placeholder="Nom du produit" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez saisir la description' }]}
            >
              <TextArea rows={5} placeholder="Description détaillée" />
            </Form.Item>

            <Form.Item
              name="prix"
              label="Prix (FCFA)"
              rules={[
                { required: true, message: 'Veuillez saisir le prix' },
                {
                  validator: (_, value) =>
                    !value || !isNaN(value) ? Promise.resolve() : Promise.reject(new Error('Prix doit être un nombre')),
                },
              ]}
            >
              <Input placeholder="Ex: 2500" />
            </Form.Item>

            <Form.Item
              name="categorie"
              label="Catégorie"
              rules={[{ required: true, message: 'Sélectionnez une catégorie' }]}
            >
              <Select placeholder="Sélectionnez une catégorie" loading={categories.length === 0} allowClear>
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Colonne droite */}
          <Col xs={24} md={12}>
            <Form.Item name="poids" label="Poids">
              <Input placeholder="Ex: 500g, 1kg, etc." />
            </Form.Item>

            <Form.Item name="date_peremption" label="Date de péremption">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="status" label="Statut" rules={[{ required: true }]}>
              <Select>
                <Option value="BROUILLON">Brouillon</Option>
                <Option value="PUBLIE">Publié</Option>
                <Option value="ARCHIVE">Archivé</Option>
                <Option value="RUPTURE">Rupture de stock</Option>
              </Select>
            </Form.Item>

            <Form.Item name="featured" label="Produit en vedette" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Créer le produit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AdminProduitAdd;
