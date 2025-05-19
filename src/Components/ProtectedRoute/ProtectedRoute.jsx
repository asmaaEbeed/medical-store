import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../shop/UserContext';
import { Spinner } from 'react-bootstrap';

export function ProtectedRoute({ children }) {
  const { userToken, refreshUserData, fetchProfile } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Show the global loader for at least 2 seconds


    const verifyAuthentication = async () => {
      try {
        // First check if we already have a userToken in context
        if (userToken) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check for token in localStorage
        const storedToken = localStorage.getItem('userToken');

        if (storedToken) {
          // Try to validate the token with the server
          const isValid = await refreshUserData();
          setIsAuthenticated(isValid);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        // Hide the loader when authentication check is complete
      }
    };

    verifyAuthentication();
  }, [userToken, refreshUserData]);

  if (isLoading) {
    // return (
    //   <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    //     <Spinner animation="border" role="status">
    //       <span className="visually-hidden">Loading...</span>
    //     </Spinner>
    //   </div>
    // );
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
