import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  CardBody,
  CardHeader,
  Spinner,
} from "react-bootstrap";
import CartTotal from "../Cart/cartComponents/CartTotal";
import { useContext, useEffect, useState } from "react";
import AddressModal from "./checkOutComponents/AddressModal";
import CheckoutPayment from "./CheckoutPayment";
import BuyConfirmationModal from "./checkOutComponents/BuyConfirmationModal";
// Context Import
import CartContext from "../../shop/CartContext";
import UserContext from "../../shop/UserContext";
import { toast } from "react-toastify";
export default function CheckOut() {
  const [modal, setModal] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cash-on-delivery");
  const [visaData, setVisaData] = useState({});
  const [allBuyingData, setAllBuyingData] = useState({
    address: "",
    payment: "",
    visaData: "",
  });
  const [buyConfirmationModal, setBuyConfirmationModal] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const { cartSubTotal, emptyCart, discount } = useContext(CartContext);
  const { userProfile, updateProfile, fetchProfile } = useContext(UserContext);

  const toggle = () => {
    setModal(!modal);
  };

  // Fetch user Data to get address
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserDataLoading(true);
        await fetchProfile();
        setUserDataLoading(false);
      } catch (error) {
        console.log(error);
        setUserDataLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userProfile) {
      if(userProfile.address === null || userProfile.address === undefined || !userProfile.address) return;

      let addressFetchedData = userProfile.address;
      addressFetchedData.id = addressList.length;   // setId to address to able check it
      addressFetchedData.mobile = userProfile.phone;
      addressFetchedData.fullName =
        userProfile.userName.firstName + " " + userProfile.userName.lastName;
      setAddressList([userProfile.address]);
      // To auto select new address
      setAddNew(true);
      setSelectedAddress(addressFetchedData.id);
    }
  }, [userProfile]);

  // const address = {
  //   fullName: "asmaa ebeed",
  //   country: "Egypt",
  //   mobile: "11111111111",
  //   city: "Port Said",
  //   street: "portfouad",
  //   building: "portfouad",
  // };
  const handleAddress = async (address) => {
    address.id = addressList.length;
    setAddressList([...addressList, address]);
    // set add new state to true to enable auto select to new add
    setAddNew(true);
    setSelectedAddress(address.id);
    setErrorAlert(false);

    // Create form data to update address user data
    const updatedFormData = new FormData();
    // Append address fields with correct dot notation
    updatedFormData.append("phone", address.mobile);
    updatedFormData.append("street", address.street);
    updatedFormData.append("city", address.city);
    // updatedFormData.append('zipCode', address.zipCode);
    updatedFormData.append("country", address.country);
    try {
      const res = await updateProfile(updatedFormData, userProfile._id);
      toast.success(res.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleSelectedPayment = (data) => {
    setSelectedPayment(data);
  };

  const handleAddressChange = (address) => {
    setAddNew(false);
    setSelectedAddress(address.id);
    setErrorAlert(false);
  };
  const handleVisaData = (data) => {
    setErrorAlert(false);
    setVisaData(data);
  };
  const proceedBuy = () => {
    console.log({
      address: addressList.find((address) => address.id === selectedAddress),
      payment: selectedPayment,
      visaData: selectedPayment === "visa" ? visaData : null,
    });
    if (selectedAddress === "") {
      setErrorAlert(true);
      return;
    }
    // if (selectedPayment === "visa") {
    //   if (
    //     visaData.cvvData === "" ||
    //     visaData.visaNumber === "" ||
    //     Object.keys(visaData).length === 0
    //   ) {
    //     setErrorAlert(true);
    //     return;
    //   }
    // }
    setAllBuyingData({
      address: addressList.find((address) => address.id === selectedAddress),
      payment: selectedPayment,
      visaData: selectedPayment === "visa" ? visaData : null,
    });

    setBuyConfirmationModal(true);
  };

  const handleBuyConfirmModal = () => {
    setBuyConfirmationModal(!buyConfirmationModal);
  };
  const resetData = () => {
    setAddressList([]);
    setSelectedAddress("");
    setAddNew(false);
    setErrorAlert(false);
    setSelectedPayment("cash-on-delivery");
    setVisaData({});
    setAllBuyingData({
      address: "",
      payment: "",
      visaData: "",
    });
    emptyCart();
  };
  return (
    <Container>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <CardHeader>
              <div className="fw-bold mx-2">Your Address:</div>
            </CardHeader>
            {!userDataLoading ? (
              <CardBody>
                <div>
                  {addressList.length
                    ? addressList.map((address, index) => {
                        return (
                          <Form.Check
                            key={index}
                            label={`${address.fullName}, ${address.street}, ${address.building !== undefined && address.building}, ${address.city}, ${address.country}, ${address.mobile}`}
                            name="address"
                            type={"radio"}
                            id={`inline-radio-${index}`}
                            checked={
                              addNew
                                ? index === addressList.length - 1
                                  ? true
                                  : false
                                : index === selectedAddress
                                  ? true
                                  : false
                            }
                            // defaultChecked={(index === (addressList.length - 1)) ? true : false}
                            value={selectedAddress}
                            onChange={() => {
                              handleAddressChange(address);
                            }}
                          />
                        );
                      })
                    : null}
                </div>
                <Button
                  type="button"
                  className="text-primary-1000 bg-transparent border-0 text-primary-1000 text-decoration-underline pt-4"
                  onClick={toggle}
                >
                  <i className="bx bx-plus"></i>
                  <span>Add New Address</span>
                </Button>
              </CardBody>
            ) : (
              <CardBody className="text-center">
                <Spinner animation="grow" variant="warning" />{" "}
                <h5 className={`text-warning`}>Loading...</h5>
              </CardBody>
            )}
          </Card>

          <CheckoutPayment
            selectedPayment={selectedPayment}
            handleSelectedPayment={handleSelectedPayment}
            handleVisaData={handleVisaData}
            errorAlert={errorAlert}
          />
        </Col>
        <Col md={4}>
          <section className="border rounded-3 p-4 bg-light">
            <CartTotal
              cartSubTotal={cartSubTotal}
              checkoutBtnNonVisible={true}
              bgcolor="bg-primary-50"
              proceedBuy={proceedBuy}
              errorAlert={errorAlert}
              discount={discount}
            />
          </section>
        </Col>
      </Row>
      <AddressModal
        modal={modal}
        toggle={toggle}
        handleAddress={handleAddress}
      />
      <BuyConfirmationModal
        modal={buyConfirmationModal}
        toggle={handleBuyConfirmModal}
        buyingData={allBuyingData}
        resetData={resetData}
        selectedAddress={selectedAddress}
        selectedPayment={selectedPayment}
        addressList={addressList}
      />
    </Container>
  );
}