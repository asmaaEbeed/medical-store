import { createContext, useState, useEffect } from "react";
import { productsAPI, categoriesAPI } from "../services/api/index";

const ProductsContext = createContext();

export const ProductProvider = (props) => {
  const [productsList, setProductsList] = useState([]);
  const [catProducts, setCatProducts] = useState([]);
  const [catData, setCatData] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellersProducts, setBestSellersProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [catDataLoading, setCatDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsAPI.getAllProducts();
        setProductsList(response.data.products);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle category filtering
 /* const handleProductsCatList = (cat) => {
    if (productsList.length) {
      const data = productsList.filter(
        (product) => product.mainCategory === cat
      );
      setCatProducts(data);
    }
  };*/
  const handleProductsCatList = async (id) => {
    setCatDataLoading(true);
    const response = await categoriesAPI.getCategoryProductsById(id);
    setCatProducts(response.data.category.products);
    setCatData(response.data.category);
    setCatDataLoading(false);
  }

  // Handle featured and best sellers filtering
  useEffect(() => {
    if (productsList.length) {
      // Must change product.featured to true, Now its false cause no retrieve from API with true value
      const featuredData = productsList.filter((product) => product.featured === true);
      setFeaturedProducts(featuredData);

      const bestSellerData = productsList.filter(
        (product) => product.bestSeller === true
      );
      setBestSellersProducts(bestSellerData);
    }
  }, [productsList]);

  return (
    <ProductsContext.Provider
      value={{ 
        productsList, 
        handleProductsCatList, 
        catProducts, 
        featuredProducts, 
        bestSellersProducts,
        isLoading,
        error,
        catData,
        catDataLoading
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
