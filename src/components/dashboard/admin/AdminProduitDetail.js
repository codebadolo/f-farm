import React, { useEffect, useState } from 'react';
import { Descriptions, Spin, message, Image, List, Divider, Breadcrumb, Typography } from 'antd';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';

// Import de la fonction API depuis ton service centralisé
import { getProduitBySlug } from '../../../services/adminProductService';

const { Title } = Typography;

const AdminProduitDetail = () => {
  const { slug } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduit = async () => {
      setLoading(true);
      try {
        const data = await getProduitBySlug(slug);
        setProduit(data);
        if (data.images && data.images.length > 0) {
          setSelectedImg(data.images[0].image);
        } else {
          setSelectedImg(null);
        }
      } catch (error) {
        console.error('Erreur fetch produit:', error);
        message.error('Erreur lors du chargement du produit');
        setProduit(null);
        setSelectedImg(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: 100, textAlign: 'center' }}>
        <Spin size="large" tip="Chargement du produit..." />
      </div>
    );
  }

  if (!produit) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'red' }}>
        <h3>Produit introuvable.</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: 'auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item icon={<HomeOutlined />}>
          <RouterLink to="/dashboard">Accueil</RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item icon={<AppstoreOutlined />}>
          <RouterLink to="/admin/products">Produits</RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{produit.nom}</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>{produit.nom}</Title>

      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        {/* Colonne gauche : images + miniatures */}
        <div style={{ minWidth: 250 }}>
          {/* Image principale avec zoom (antd Image supporte) */}
          {selectedImg ? (
            <Image
              src={selectedImg}
              alt={produit.nom}
              width={250}
              style={{ marginBottom: 16, cursor: 'zoom-in' }}
              placeholder
              fallback="https://via.placeholder.com/250x250?text=Pas+d%27image"
              // Zoom automatique quand l'user clique sur l'image principale
              preview={{ mask: <div>Cliquez pour zoom</div> }}
            />
          ) : (
            <div
              style={{
                width: 250,
                height: 250,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                marginBottom: 16,
              }}
            >
              Pas d’image disponible
            </div>
          )}

          {/* Miniatures */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {produit.images && produit.images.length > 0 ? (
              produit.images.map((img) => (
                <Image
                  key={img.id}
                  src={img.image}
                  alt={img.alt_text || produit.nom}
                  width={60}
                  height={60}
                  style={{
                    objectFit: 'cover',
                    border: selectedImg === img.image ? '2px solid #1890ff' : '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                  preview={false}
                  onClick={() => setSelectedImg(img.image)}
                  fallback="https://via.placeholder.com/60x60?text=No+Image"
                />
              ))
            ) : (
              <div style={{ color: '#888' }}>Aucune miniature disponible</div>
            )}
          </div>
        </div>

        {/* Colonne droite : détails texte */}
        <div style={{ flex: 1 }}>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Description">{produit.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="Catégorie">{produit.categorie?.nom || '-'}</Descriptions.Item>
            <Descriptions.Item label="Vendeur">{produit.vendeur_nom || '-'}</Descriptions.Item>
            <Descriptions.Item label="Prix">
              {typeof produit.prix === 'number'
                ? produit.prix.toLocaleString() + ' FCFA'
                : produit.prix || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">{produit.status || '-'}</Descriptions.Item>
            <Descriptions.Item label="Date d'ajout">
              {produit.date_ajout ? new Date(produit.date_ajout).toLocaleString() : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date de modification">
              {produit.date_modification
                ? new Date(produit.date_modification).toLocaleString()
                : '-'}
            </Descriptions.Item>
          </Descriptions>

          {/* Attributs du produit */}
          {produit.attributs && produit.attributs.length > 0 && (
            <>
              <Divider orientation="left" style={{ marginTop: 32 }}>
                Attributs du produit
              </Divider>
              <List
                bordered
                size="small"
                dataSource={produit.attributs}
                renderItem={(attr) => (
                  <List.Item>
                    <strong>{attr.nom_attribut}:</strong> {attr.valeur}
                  </List.Item>
                )}
                style={{ marginBottom: 24 }}
              />
            </>
          )}

          {/* Avis associés */}
          {produit.avis && produit.avis.length > 0 ? (
            <>
              <Divider orientation="left">Avis récents</Divider>
              <List
                itemLayout="vertical"
                dataSource={produit.avis}
                renderItem={(avis) => (
                  <List.Item key={avis.id}>
                    <List.Item.Meta
                      title={avis.auteur_nom || 'Anonyme'}
                      description={
                        <>
                          <span>Note: {avis.note || 'N/A'}</span> -{' '}
                          <small>{new Date(avis.date_creation).toLocaleDateString()}</small>
                        </>
                      }
                    />
                    <div>{avis.commentaire}</div>
                  </List.Item>
                )}
              />
            </>
          ) : (
            <p style={{ marginTop: 24, fontStyle: 'italic' }}>Pas d’avis pour ce produit.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProduitDetail;
