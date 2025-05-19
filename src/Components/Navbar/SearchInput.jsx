import React, { useEffect, useState } from "react";
import style from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "./useDebounce";
import { productsAPI } from "../../services/api";
import { Spinner } from "react-bootstrap";
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noProducts, setNoproducts] = useState(false);
  const navigate = useNavigate();

  // useDebounce is hook for hit the api after  1 seconds to prevent flickering
  const debouncedSearchTerm = useDebounce(query, 1000);
  const handleInputChange = (event) => {
    setSearchResults([]);
    setQuery(event.target.value.replace(/\s+/g, " ").trim());
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    setNoproducts(false);
    if (query) {
      setIsSearching(true);
      setShowResults(true);
    } else {
      setIsSearching(false);
      setShowResults(false);
      setSearchResults([]);
    }
  }, [query]);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        handleSearch();
      } else {
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call handleSearch function if debounced search term changes to hit api after 1 seconds
  );

  // hit api by click search button or onchange input
  const handleSearch = async () => {
    setNoproducts(false);
    await productsAPI
      .searchProducts(query)
      .then((response) => {
        setIsSearching(false);
        setSearchResults(response.data.products);
        response.data.products.length < 1 && setNoproducts(true);
      })
      .catch((error) => {
        setIsSearching(false);
        console.error(error);
      });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 500);
   // setShowResults(false);
  };

  return (
    <div className="w-100 mx-auto">
      <div className="input-group mb-3 position-relative">
        <input
          type="search"
          className="form-control rounded-5 pl-5"
          style={{ paddingLeft: "40px" }}
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <div
          className={`input-group-append position-absolute ${style.searchIcon}`}
          style={{ zIndex: "8" }}
        >
          <button className="btn btn-outline-none" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        {showResults && (
          <ul
            className={`dropdown-menu w-100 dropdown-menu-right ${showResults && "d-block"} ${style.dropMenu}`}
          >
            {isSearching && (
              <li>
                <div className="text-center">
                  <Spinner animation="border" variant="secondary" />{" "}
                  <h6 className={`${style.loadingTitle} text-secondary`}>
                    Loading...
                  </h6>
                </div>
              </li>
            )}
            {noProducts && (
              <li>
                <div className="text-center text-muted fst-italic p-3">
                  No Products Found
                </div>
              </li>
            )}
            {searchResults.map((result, index) => (
              <li
                key={index}
                className={`${style.searchResult} px-2 py-1 ${searchResults.length - 1 !== index && "border-bottom"}`}
                onClick={(e) => { e.stopPropagation(); console.log(result); navigate(`/products/${result._id}`) }}
              >
                <Link
                  to={`/products/${result._id}`}
                  className={`d-flex  align-items-center  text-decoration-none text-black `}
                >
                  <img
                    src={result.mainImage.path}
                    className={`${style.searchResultImage}`}
                  />
                  <div>
                    <h5>{result.name}</h5>
                    <h6>
                      <span className=" text-muted fw-bold mb-0">
                        {result.priceAfterDiscount}$
                      </span>
                      <small className="text-secondary text-decoration-line-through ms-2">
                        {result.price}$
                      </small>
                    </h6>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
