import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const ProduitForm = ({ onFinish, initialValues = {}, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      encType="multipart/form-data"
    >
      <Form.Item
        label="Nom"
        name="nom"
        rules={[{ required: true, message: 'Veuillez saisir le nom du produit' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Veuillez saisir la description' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Prix"
        name="prix"
        rules={[{ required: true, message: 'Veuillez saisir le prix' }]}
      >
        <InputNumber min={0} step={100} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Catégorie"
        name="categorie"
        rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
      >
        {/* Un Select, à peupler dynamiquement selon tes catégories */}
        <Select placeholder="Sélectionner une catégorie">
          <Option value={1}>Catégorie 1</Option>
          <Option value={2}>Catégorie 2</Option>
          {/* ... */}
        </Select>
      </Form.Item>

      <Form.Item
        label="Images"
        name="images_data"
        valuePropName="fileList"
        getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
      >
        <Upload
          listType="picture-card"
          multiple
          beforeUpload={() => false} // upload après formulaire
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Ajouter</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Enregistrer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProduitForm;
