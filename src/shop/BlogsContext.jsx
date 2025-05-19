import { createContext, useState, useEffect } from "react";
import { productsAPI, categoriesAPI } from "../services/api/index";
import { blogsAPI } from "../services/api/index";

const BlogsContext = createContext();

export const BlogsProvider = (props) => {
  const [blogsList, setBlogsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await blogsAPI.getAllBlogs();
        setBlogsList(response.data.blogs);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };


  return (
    <BlogsContext.Provider
      value={{ 
        blogsList,
        isLoading,
        fetchBlogs
      }}
    >
      {props.children}
    </BlogsContext.Provider>
  );
};

export default BlogsContext;
