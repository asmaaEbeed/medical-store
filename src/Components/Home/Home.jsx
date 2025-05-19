import style from "./Home.module.css";
import Slider from "./Slider";
import ProductsSlider from "../ProductsSlider/ProductsSlider";
import Brands from "../Brands/Brands";
import BestOffers from "../BestOffers/BestOffers";
import ProductsContext from "../../shop/ProductsContext";
import { useContext } from "react";
import GetCoupoun from "./GetCoupon";
import { useTranslation } from 'react-i18next';



export default function Home() {
  const { featuredProducts: products } = useContext(ProductsContext);
    const { t } = useTranslation();
  
  return (
    <>
      <Slider />
      <ProductsSlider products={products} title={t('home.featuredProducts')} />
      <GetCoupoun />
      <Brands/>
      <BestOffers/>
    </>
  );
}
