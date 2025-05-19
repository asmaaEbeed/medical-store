import React, { useContext } from 'react';
import UserContext from '../../../shop/UserContext';
import { Badge, Card, Accordion, Row, Col, Image, Spinner, Button } from 'react-bootstrap';
import truncateText from '../../../Components/Common/truncateText';
import './Orders.css';
import CancelOrderModal from './CancelOrderModal';
import { toast } from 'react-toastify';

const Orders = () => {
  const { userOrdersList, userOrderLoading } = useContext(UserContext);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  // Function to determine badge color based on order status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'deliverd':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

 
  if(userOrderLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="grow" role="status" variant="warning" />
        <h3>Loading...</h3>
        <p>Please wait while we load your orders.</p>
      </div>
    );
  }

  if (!userOrdersList || userOrdersList.length === 0) {
    return (
      <div className="text-center p-5">
        <h3>No orders found</h3>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }
  

  const tggleCancelModal = () => {
    setShowCancelModal(!showCancelModal);
  };

  return (
    <div className="orders-container">
      <h2 className="mb-4">My Orders</h2>
      
      <Accordion defaultActiveKey="0">
        {userOrdersList.map((order, index) => (
          <Accordion.Item eventKey={index.toString()} key={order._id} className="mb-3 bg-light">
            <Accordion.Header className='bg-warning-50'>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100 pe-3">
                <div>
                  <strong>Order #{order._id.substring(order._id.length - 6)}</strong>
                </div>
                <div className="d-flex align-items-center mt-2 mt-md-0">
                  <Badge bg={getStatusBadgeColor(order.orderStatus)} className="me-3">
                    {order.orderStatus}
                  </Badge>
                  <span className="fw-bold">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body >
              <Card className=" border">
                <Card.Body className='h-auto'>
                  <Row className="mb-4">
                    <Col xs={12} lg={6} className="mb-3 mb-md-0">
                      <h5 className="mb-3">Order Details</h5>
                      <div className="order-details">
                        <div className="detail-item d-flex mb-2">
                          <div className="detail-label text-muted me-2">Order ID:</div>
                          <div className="detail-value text-break">{truncateText(order._id, 20)}</div>
                        </div>
                        <div className="detail-item d-flex mb-2">
                          <div className="detail-label text-muted me-2">Date:</div>
                          <div className="detail-value">{new Date(order.createdAt).toISOString().slice(0, 10)}</div>
                        </div>
                        <div className="detail-item d-flex mb-2">
                          <div className="detail-label text-muted me-2">Status:</div>
                          <div className="detail-value">
                            <Badge bg={getStatusBadgeColor(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                          </div>
                        </div>
                        {order.reason && (
                          <div className="detail-item d-flex mb-2">
                            <div className="detail-label text-muted me-2">Reason:</div>
                            <div className="detail-value">{order.reason}</div>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} lg={6}>
                      <h5 className="mb-3">Shipping Information</h5>
                      <div className="shipping-info">
                        <div className="detail-item d-flex mb-2">
                          <div className="detail-label text-muted me-2">Address:</div>
                          <div className="detail-value">{order.address}</div>
                        </div>
                        <div className="detail-item d-flex mb-2">
                          <div className="detail-label text-muted me-2">Phone:</div>
                          <div className="detail-value">{order.phone}</div>
                        </div>
                        <div className="detail-item d-flex mb-2">
                          <div className="detail-label text-muted me-2">Payment Method:</div>
                          <div className="detail-value text-capitalize">{order.paymentMethod}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <h5 className="mb-3">Order Items</h5>
                  
                  {/* Header - Desktop */}
                  <div className="d-none d-md-flex order-item-header fw-bold mb-2">
                    <div className="col-2">Product</div>
                    <div className="col-4">Name</div>
                    <div className="col-2">Price</div>
                    <div className="col-1">Qty</div>
                    <div className="col-3 text-end">Total</div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="order-items mb-3">
                    {order.products.map((product) => (
                      <div key={product._id} className="order-item py-2 border-bottom">
                        <div className="d-flex align-items-center">
                          <div className="col-3 col-md-2">
                            {product.productId && product.productId.mainImage ? (
                              <Image 
                                src={product.productId.mainImage.path} 
                                alt={product.name} 
                                width={50} 
                                height={50} 
                                className="product-image"
                              />
                            ) : (
                              <div className="placeholder-image">No image</div>
                            )}
                          </div>
                          
                          <div className="col-9 col-md-10">
                            <div className="d-block d-md-flex">
                              <div className="col-md-4 mb-1 mb-md-0">
                                <div className="d-md-none fw-bold">Name:</div>
                                {truncateText(product.name, 20)}
                              </div>
                              <div className="col-md-2 mb-1 mb-md-0">
                                <div className="d-md-none fw-bold">Price:</div>
                                ${product.productPrice.toFixed(2)}
                              </div>
                              <div className="col-md-1 mb-1 mb-md-0">
                                <div className="d-md-none fw-bold">Qty:</div>
                                {product.quantity}
                              </div>
                              <div className="col-md-5 text-md-end">
                                <div className="d-md-none fw-bold">Total:</div>
                                ${product.finalPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="fw-bold">Subtotal:</div>
                      <div>${order.subTotal.toFixed(2)}</div>
                    </div>
                    
                    {order.couponId && (
                      <div className="d-flex justify-content-between mb-2">
                        <div className="fw-bold">Discount:</div>
                        <div className="text-success">-${(order.subTotal - order.totalPrice).toFixed(2)}</div>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between mb-2">
                      <div className="fw-bold">Total:</div>
                      <div className="fw-bold">${order.totalPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  {(order.orderStatus.toLowerCase() === 'pending' || order.orderStatus.toLowerCase() === 'placed' )&& (
                    <div className="d-grid d-md-flex justify-content-md-end mt-3">
                      <Button variant="danger" size="sm" onClick={() => {setSelectedOrder(order._id); tggleCancelModal()}}>
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
        <CancelOrderModal show={showCancelModal} toggle={tggleCancelModal} orderId={selectedOrder} />
    </div>
  );
};

export default Orders;
