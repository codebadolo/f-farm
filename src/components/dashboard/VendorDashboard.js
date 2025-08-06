import React from 'react';
import { Routes, Route } from 'react-router-dom';

import VendorProduitAdd from './vendor/VendorProduitAdd';
import VendorProduits from './vendor/VendorProduits';
import VendorLayout from './layouts/VendorLayout';
import VendorProduitDetail from './vendor/VendorProduitDetail'
import VendorProduitEdit from './vendor/VendorProduitEdit'
const VendorDashboard = () => {
  return (
    <VendorLayout>
      <Routes>
        {/* Ici, on met des chemins relatifs à la route parente */}
        <Route path="products" element={<VendorProduits />} />
         <Route path="/vendor/products" element={<VendorProduits />} />
  <Route path="/vendor/products/add" element={<VendorProduitAdd />} />
  <Route path="/vendor/products/:slug" element={<VendorProduitDetail />} />
  <Route path="/vendor/products/:slug/edit" element={<VendorProduitEdit />} />

        {/* Tu peux ajouter d’autres routes ici */}

        {/* Route catch-all pour les pages non trouvées */}
        <Route path="*" element={<div>Page vendeur non trouvée.</div>} />
      </Routes>
    </VendorLayout>
  );
};

export default VendorDashboard;
