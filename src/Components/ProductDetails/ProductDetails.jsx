import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import style from "./ProductDetails.module.css";
import CartContext from "../../shop/CartContext";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Button,
  Form,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import { NavLink } from "react-router";
import BreadCrumb from "../Common/BreadCrumb";
import { productsAPI } from "../../services/api";
import RelatedItems from "./RelatedItems";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReviewTab from "./ReviewTab";
import ProductsContext from "../../shop/ProductsContext";
import { useWishList } from "../../shop/WishListContext";

export default function ProductDetails() {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeItemFromWishlist, isInWishlist } = useWishList();

  // to handle related products
  const {
    handleProductsCatList,
    catProducts,
    catDataLoading,
  } = useContext(ProductsContext);

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const getProdData = async () => {
        try {
          setDetailsLoading(true);
          const res = await productsAPI.getProductById(id);
          console.log(res.data.product);
          setProduct(res.data.product);
          setDetailsLoading(false);
        } catch (err) {
          setDetailsLoading(false);
          if (err.status == 404 || err.status == 500) {
            navigate("/not-found");
          }
        }
      };
      getProdData();
    }
  }, [id]);
  useEffect(() => {
    product && handleProductsCatList(product && product.categoryId);
  }, [product]);


  const breadCrumbData = [
    {
      link: "/",
      name: "Home",
    },
    {
      link: "/products",
      name: "Products",
    },
    {
      link: `${id && `/products/${id}`}`,
      name: product && product.name,
    },
  ];

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };
  const handleWishlist = (product, e) => {
    e.stopPropagation();
    console.log(product);
    if (isInWishlist(product._id)) {
      removeItemFromWishlist(product._id);
      toast.warning(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product._id);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <>
      {/* ===============Navigate Line============ */}
      <BreadCrumb breadCrumbData={breadCrumbData} />

      {product && !detailsLoading ? <Container className="my-5">
        {/* ==================== image & details ================ */}
        <Row>
          <Col md={6} className="position-relative">
            <Image
              src={product.mainImage.path}
              fluid
              className="border rounded-4 p-2"
            />
            <span className="badge bg-danger position-absolute start-0 mx-4 my-3">
              {product.category}
            </span>
          </Col>
          <Col md={6} className="px-5">
            <h5>{product.name}</h5>
            <p className="text-muted">
              {product.discount > 0 && <del>${product.price.toFixed(2)}</del>}{" "}
              <ins>${product.priceAfterDiscount.toFixed(2)}</ins>
            </p>
            <div className="d-flex align-items-center mb-3">
              <div className="me-2">
                <span className="text-warning">
                  &#9733;&#9733;&#9733;&#9733;&#9734;
                </span>
              </div>
              <NavLink
                to="#"
                className={`${style.navLink} text-decoration-none py-3 d-block`}
              >
                (customer review)
              </NavLink>
            </div>
            <p>{product.description}</p>
            <Form className="d-flex align-items-center mb-3">
              <Form.Control
                type="number"
                defaultValue="1"
                min="1"
                className="me-2"
                style={{ width: "80px" }}
              />
              <Button onClick={(e) => handleAddToCart(product, e)} className={`btn bg-warning-400 transition-btn d-lg-block d-none transition-btn-orange-outline border-white rounded-3 text-lowercase`}><span>Add to cart</span></Button>
            </Form>
            <div className="mt-3">
              <p>
                <strong>Categories:</strong> {product.category}
              </p>
              <p>
                <strong>Tags:</strong> Cosmetics, Skin
              </p>
              <p>
                <strong>SKU:</strong> 00027
              </p>
            </div>
          </Col>
        </Row>
        {/* ==================== Tabs option ================ */}
        <Tabs
          defaultActiveKey="description"
          className={`mt-5 ${style.customTabs}`}
        >
          <Tab eventKey="description" title="Description">
            <h2>Description</h2>
            <p>{product.description}</p>
        
            <ul>
              <li>Amet in maencas</li>
              <li>Consequat sit</li>
              <li>Neque purus</li>
              <li>Ligula feugiat</li>
            </ul>
          </Tab>
          <Tab eventKey="additional_information" title="Additional information">
            <h2>Additional information</h2>
            <table className="table">
              <tbody>
                <tr>
                  <th>Weight</th>
                  <td>0.5 kg</td>
                </tr>
                <tr>
                  <th>Dimensions</th>
                  <td>1 × 2 × 3 cm</td>
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <ReviewTab product={product} />
          </Tab>
        </Tabs>

        {/* ==================== Related items ================ */}
        <hr className="my-5" />
        <h3>Related Items</h3>
        <RelatedItems catDataLoading={catDataLoading} catProducts={catProducts} handleAddToCart={addToCart} handleWishlist={handleWishlist}/>
      </Container> : <div className="text-center p-5"><Spinner animation="grow" variant="info" /><h5>Loading...</h5></div>}
    </>
  );
}
