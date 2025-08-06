import React from 'react';
import { Layout, Carousel, Card, Row, Col } from 'antd';

const { Content } = Layout;

const Home = () => {
  return (
    <Layout>
      <Content style={{ padding: '20px' }}>
        <Carousel autoplay>
          <div><img src="/images/banner1.jpg" alt="Promo 1" /></div>
          <div><img src="/images/banner2.jpg" alt="Promo 2" /></div>
        </Carousel>

        <h2>Featured Products</h2>
        <Row gutter={[16, 16]}>
          {/* Map featured products to cards here */}
          <Col span={6}>
            <Card hoverable cover={<img alt="product" src="/images/product1.jpg" />}>
              <Card.Meta title="Product Title" description="Short description" />
            </Card>
          </Col>
          {/* More product cards */}
        </Row>
      </Content>
    </Layout>
  );
};
export default Home;
