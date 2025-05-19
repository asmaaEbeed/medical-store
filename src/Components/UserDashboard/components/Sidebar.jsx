import { FaUser, FaHeart, FaShoppingCart, FaMapMarkerAlt, FaKey, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import style from '../UserDashboard.module.css';
import { useContext, useRef, useState } from 'react';
import UserContext from '../../../shop/UserContext'; 
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ userData, activeTab, setActiveTab }) {
  const { logout, updateProfile, getUserOrders } = useContext(UserContext); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const fullName = `${userData?.userName?.firstName} ${userData?.userName?.lastName}`.trim() || ''

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create FormData object
      const formData = new FormData();
      formData.append('profilePic', file);
      
      setIsUploading(true);
      try {
        // Call the updateProfile function from UserContext
        await updateProfile(formData, userData._id);
        // No need to manually update the UI if your context properly updates the state
      } catch (error) {
        console.error("Error updating profile picture:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={style.sidebar}>
      <div className={style.userProfile}>
        <div className={style.avatarWrapper}>
         <img 
    src={userData?.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
    alt="Profile" 
    className={style.avatar}
    onError={(e) => {
        e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    }}
    loading="lazy"
/>
          <button className={style.changeAvatarBtn} onClick={handleAvatarClick}>
            <FaEdit />
          </button>
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef}
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleFileChange}
          />
{isUploading && (
  <div className={style.uploadingIndicator}>
    <div className="spinner-border spinner-border-sm text-warning" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)}        </div>
        <h3>{fullName}</h3>
        {/* <p className={style.userId}>{userData.id}</p> */}
      </div>
      
      <div className={style.menuItems}>
        <button className={`${style.menuItem} ${activeTab === 'profile' ? style.active : ''}`}
          onClick={() => setActiveTab('profile')}>
          <FaUser /> Edit Profile
        </button>
        {/* <button className={`${style.menuItem} ${activeTab === 'address' ? style.active : ''}`}
          onClick={() => setActiveTab('address')}>
          <FaMapMarkerAlt /> Address
        </button> */}
        <button className={`${style.menuItem} ${activeTab === 'orders' ? style.active : ''}`}
          onClick={() => {setActiveTab('orders'); getUserOrders()}}>
          <FaShoppingCart /> Order & Reordering
        </button>
        <button className={`${style.menuItem} ${activeTab === 'Wishlist' ? style.active : ''}`}
          onClick={() => setActiveTab('Wishlist')}>
          <FaHeart /> Wishlist <span className={style.count}>{userData?.whishList?.length}</span>
        </button>
        <button className={`${style.menuItem} ${activeTab === 'ChangePassword' ? style.active : ''}`}
          onClick={() => setActiveTab('ChangePassword')}>
          <FaKey /> Change Password
        </button>
        <button className={`${style.menuItem} ${style.logout}`} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}