import React from "react";
import TrendImg from "../../assets/images/trend-products/trend-products.jpg";
import subCatImg1 from "../../assets/images/trend-products/sub-cat-body-care.jpg";
import subCatImg2 from "../../assets/images/trend-products/sub-cat-spf.jpg";
import subCatImg3 from "../../assets/images/trend-products/sub-cat-hair-care.jpg";
import subCatImg4 from "../../assets/images/trend-products/sub-cat-vitamin.jpg";
import { Col, Row } from "react-bootstrap";

const Trend = () => {
  return (
    <>
      <div className="p-2 mt-5">
        <img
          src={TrendImg}
          alt="tred products"
          className="w-100 p-1 rounded-4"
        />
      </div>
      <Row>
          <Col xs={6} md={3} className="p-4">
            <img
              src={subCatImg1}
            alt="sub category"
            className="w-100 p-1 rounded-4"
          />
        </Col>
        <Col xs={6} md={3} className="p-4">
          <img
            src={subCatImg2}
            alt="sub category"
            className="w-100 p-1 rounded-4"
          />
        </Col>
        <Col xs={6} md={3} className="p-4">
          <img
            src={subCatImg3}
            alt="sub category"
            className="w-100 p-1 rounded-4"
          />
        </Col>
        <Col xs={6} md={3} className="p-4">
          <img
            src={subCatImg4}
            alt="vitamin"
            className="w-100 p-1 rounded-4"
          />
        </Col>
        </Row>
    </>
  );
};

export default Trend;
