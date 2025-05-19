import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css"; 


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className={`${styles.notFoundContainer} py-5 mt-5`}>
      <h1 className={`${styles.errorCode} py-2`}>404</h1>
      <h2 className={`${styles.errorMessage} py-2`}>Oops! Page Not Found</h2>
      <p className={`${styles.errorMessage} py-2`}>
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Button 
        className={`${styles.goHomeBtn} transition-btn transition-btn-orange-outline border-white rounded-3 border-1`} 
        onClick={() => navigate("/")}
      >
        <span>Go Home</span>
      </Button>
    </Container>
  );
};

export default NotFound;
