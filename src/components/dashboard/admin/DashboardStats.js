// src/components/dashboard/admin/DashboardStats.js
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

const DashboardStats = () => {
  // In real app fetch stats from your API
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="Utilisateurs Totaux" value={2457} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Vendeurs Validés" value={123} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Clients Actifs" value={2314} />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
