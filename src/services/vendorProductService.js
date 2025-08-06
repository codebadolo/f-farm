// src/services/vendorProductService.js

import api from './api'; // réutilise la config axios et les interceptors

/**
 * Récupère la liste des produits du vendeur connecté
 * Optionnellement, on peut passer des paramètres (ex : pagination, filtre)
 * @param {Object} params
 */
export const getProduitsVendeur = (params = {}) => {
  return api.get('products/vendor/', { params }).then(res => res.data);
};

/**
 * Récupère le détail d’un produit du vendeur par slug
 * @param {string} slug
 */
export const getProduitVendeurBySlug = (slug) => {
  return api.get(`products/vendor/${slug}/`).then(res => res.data);
};

/**
 * Crée un nouveau produit pour le vendeur connecté
 * @param {FormData|Object} produitData
 */
export const createProduitVendeur = (produitData) => {
  const config = produitData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : { headers: { 'Content-Type': 'application/json' } };

  return api.post('products/vendor/create/', produitData, config).then(res => res.data);
};

/**
 * Met à jour un produit du vendeur
 * @param {string} slug
 * @param {FormData|Object} produitData
 */
export const updateProduitVendeur = (slug, produitData) => {
  const config = produitData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : { headers: { 'Content-Type': 'application/json' } };

  return api.put(`products/vendor/${slug}/update/`, produitData, config).then(res => res.data);
};

/**
 * Supprime un produit du vendeur
 * @param {string} slug
 */
export const deleteProduitVendeur = (slug) => {
  return api.delete(`products/vendor/${slug}/delete/`).then(res => res.data);
};
