import React, { useEffect } from "react";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import ProductsSection from "../Products/ProductsSection";

const RelatedItems = ({ catDataLoading, catProducts, handleAddToCart, handleWishlist }) => {
  useEffect(() => {
    console.log(catProducts);
  }, [ catProducts]);
  return (
    <>
      {!catDataLoading ? 
      <ProductsSection currentProducts={catProducts} handleAddToCart={handleAddToCart} handleWishlist={handleWishlist} /> 
      : <div><Spinner animation="grow" role="status"></Spinner></div>}
    </>

  );
};

export default RelatedItems;
