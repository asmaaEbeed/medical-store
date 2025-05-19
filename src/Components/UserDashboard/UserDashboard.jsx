import style from './UserDashboard.module.css'
import { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar';
// import AddressCard from './components/AddressCard';
import Wishlist from './components/Wishlist';
import ProfileEdit from './components/ProfileEdit';
import ChangePassword from './components/ChangePassword';
import { UserContext } from '../../shop/UserContext';
import { Container } from 'react-bootstrap';
import Orders from './components/Orders';


export default function UserDashboard() {
    const { fetchProfile, userProfile, setUserProfile } = useContext(UserContext);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        await fetchProfile();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        // Add a small delay to ensure smooth transition
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    loadUserData();
  }, []);

  useEffect(() => {
    setUserData(userProfile);
  }, [userProfile]);


    // Show loading screen while data is being fetched
    if (loading) {
      return (
        <Container className={style.loadingScreen}>
          <div className={style.loadingContent}>
            <div className={style.loadingSpinner}>
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h3 className={style.loadingTitle}>Loading your dashboard</h3>
            <p className={style.loadingText}>Please wait while we get your information...</p>
          </div>
        </Container>
      );
    }

  return (
    <div className={style.dashboardContainer}>
      <Sidebar 
        userData={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className={`${style.content} px-md-3 px-1`}>
        <h2 className={style.contentTitle}>Let's check your today</h2>
        
        {activeTab === 'profile' && (
          <ProfileEdit userData={userData} />
        )}

        {/* {activeTab === 'address' && (
          <div className={style.addressContainer}>
            <AddressCard 
              title="Billing Address #1"
              address={userData?.address}
            />
            <AddressCard 
              title="Shipping Address #2"
              address={userData.shippingAddress}
            />
          </div>
        )} */}

        {activeTab === 'Wishlist' && (
            <Wishlist userData={userData} /> 
        )}

        {activeTab === 'ChangePassword' && (
          <ChangePassword userData={userData} />
        )}
        {activeTab === 'orders' && (
          <Orders userData={userData} />
        )}
      </div>
    </div>
  );
}