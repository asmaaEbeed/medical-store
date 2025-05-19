import { useEffect } from 'react';
// import jwt_decode from 'jwt-decode';
import {  useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';


import axios from 'axios';

const GoogleLoginButton = () => {
      const navigate = useNavigate();
    
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: '666027340866-2iol5b22vihir8ns46peuufjkssfufmc.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById('googleLoginDiv'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log(response);
    const { credential } = response;
    // const decoded = jwt_decode(credential);

    try {
      const res = await axios.post('https://care-pharmacy.vercel.app/auth/loginWithGmail', {
        idToken: credential,
      });

      console.log(res.data);
      localStorage.setItem('userToken', res.data.token);
      navigate('/');
      toast.success('Login successful!');
      // Navigate to home page or show success
    } catch (err) {
        toast.error('Login failed');
      console.error('Login failed', err);
    }
  };

  return <div id="googleLoginDiv"></div>;
};

export default GoogleLoginButton;