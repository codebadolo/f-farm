import axios from 'axios';

// Instanciation d'axios avec config globale, baseURL et gestion du token en interceptor
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // adapte selon ton API
  // headers globaux additionnels peuvent être ajoutés ici
});

// Interceptor pour injecter automatiquement le token JWT dans chaque requête (si existant)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Adapté selon ta gestion du token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Gestion des produits - appels API admin

/**
 * Récupère la liste paginée de produits (optionnellement filtrée)
 * @param {Object} params - paramètres query (pagination, filtre, tri, recherche)
 */
export const getProduits = (params = {}) => {
  return api.get('products/', { params }).then(res => res.data);
};

/**
 * Récupère le détail d’un produit par slug
 * @param {string} slug - slug du produit
 */
export const getProduitBySlug = (slug) => {
  return api.get(`products/${slug}/`).then(res => res.data);
};

/**
 * Crée un nouveau produit
 * @param {FormData|Object} produitData - données du produit à créer
 */
export const createProduit = (produitData) => {
  // Si upload fichier, produitData doit être FormData sinon JSON
  const config = produitData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : { headers: { 'Content-Type': 'application/json' } };

  return api.post('products/create/', produitData, config).then(res => res.data);
};

/**
 * Met à jour un produit existant
 * @param {string} slug - slug du produit
 * @param {FormData|Object} produitData - données mises à jour
 */
export const updateProduit = (slug, produitData) => {
  const config = produitData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : { headers: { 'Content-Type': 'application/json' } };

  return api.put(`products/${slug}/update/`, produitData, config).then(res => res.data);
};

/**
 * Supprime un produit
 * @param {string} slug - slug du produit à supprimer
 */
export const deleteProduit = (slug) => {
  return api.delete(`products/${slug}/delete/`).then(res => res.data);
};

/**
 * Ajoute une image à un produit
 * @param {string} produitId - ID du produit
 * @param {FormData} imageData - FormData avec l’image
 */
export const uploadImageProduit = (produitId, imageData) => {
  return api.post(`products/${produitId}/images/`, imageData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

/**
 * Ajoute un attribut à un produit
 * @param {string} produitId - ID du produit
 * @param {Object} attributData - données attribut (ex: { nom_attribut: '', valeur: '' })
 */
export const addAttributProduit = (produitId, attributData) => {
  return api.post(`products/${produitId}/attributs/`, attributData).then(res => res.data);
};

/**
 * Récupère la liste des catégories (pour formulaire produit)
 */
export const getCategories = () => {
  return api.get('products/categories/').then(res => res.data);
};

/**
 * Récupère les avis d’un produit
 * @param {string} produitId
 */
export const getAvisProduit = (produitId) => {
  return api.get(`products/${produitId}/avis/`).then(res => res.data);
};

/**
 * Crée un avis produit
 * @param {string} produitId
 * @param {Object} avisData
 */
export const createAvisProduit = (produitId, avisData) => {
  return api.post(`products/${produitId}/avis/`, avisData).then(res => res.data);
};
