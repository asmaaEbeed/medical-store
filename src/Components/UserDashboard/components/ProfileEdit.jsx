import { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useContext } from 'react';
import UserContext from '../../../shop/UserContext';
import style from '../UserDashboard.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfileEdit({ userData }) {
  const { updateProfile } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.userName?.firstName || '',
    lastName: userData.userName?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    // Initialize address fields from nested structure
    street: userData?.address?.street || '',
    city: userData?.address?.city || '',
    state: userData?.address?.state || '',
    zipCode: userData?.address?.zipCode || '',
    country: userData?.address?.country || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // For FormData, we need to use dot notation for nested fields
    const updatedFormData = new FormData();
   
    // Append user info fields
    updatedFormData.append('firstName', formData.firstName);
    updatedFormData.append('lastName', formData.lastName);
    updatedFormData.append('email', formData.email);
    updatedFormData.append('phone', formData.phone);
   
    // Append address fields with correct dot notation
    updatedFormData.append('street', formData.street);
    updatedFormData.append('city', formData.city);
    updatedFormData.append('state', formData.state);
    updatedFormData.append('zipCode', formData.zipCode);
    updatedFormData.append('country', formData.country);

    try {
      await updateProfile(updatedFormData, userData._id);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={style.profileContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {!isEditing ? (
        <div className={style.profileInfo}>
          {/* Personal Information Section */}
          <div className={style.profileCard}>
            <div className={style.sectionHeader}>
              <div className={style.sectionIcon}>
                <FaUser />
              </div>
              <h3>Personal Information</h3>
            </div>
            
            <div className={style.profileRow}>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>First Name</span>
                <span className={style.fieldValue}>{userData.userName?.firstName || 'Not provided'}</span>
              </div>
              
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Last Name</span>
                <span className={style.fieldValue}>{userData.userName?.lastName || 'Not provided'}</span>
              </div>
            </div>
            
            <div className={style.profileRow}>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Email Address</span>
                <span className={style.fieldValue}>{userData.email || 'Not provided'}</span>
              </div>
              
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Phone Number</span>
                <span className={style.fieldValue}>{userData.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
         
          {/* Address Information Section */}
          <div className={style.profileCard}>
            <div className={style.sectionHeader}>
              <div className={style.sectionIcon}>
                <FaMapMarkerAlt />
              </div>
              <h3>Address Information</h3>
            </div>
            
            <div className={style.profileRow}>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Street Address</span>
                <span className={style.fieldValue}>{userData.address?.street || 'Not provided'}</span>
              </div>
            </div>
            
            <div className={style.profileRow}>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>City</span>
                <span className={style.fieldValue}>{userData.address?.city || 'Not provided'}</span>
              </div>
              
              <div className={style.profileField}>
                <span className={style.fieldLabel}>State/Province</span>
                <span className={style.fieldValue}>{userData.address?.state || 'Not provided'}</span>
              </div>
            </div>
            
            <div className={style.profileRow}>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Zip/Postal Code</span>
                <span className={style.fieldValue}>{userData.address?.zipCode || 'Not provided'}</span>
              </div>
              
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Country</span>
                <span className={style.fieldValue}>{userData.address?.country || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <button
            className={style.editButton}
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={style.profileForm}>
          {/* Personal Information Form Section */}
          <div className={style.profileCard}>
            <div className={style.sectionHeader}>
              <div className={style.sectionIcon}>
                <FaUser />
              </div>
              <h3>Personal Information</h3>
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className={style.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Address Information Form Section */}
          <div className={style.profileCard}>
            <div className={style.sectionHeader}>
              <div className={style.sectionIcon}>
                <FaMapMarkerAlt />
              </div>
              <h3>Address Information</h3>
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup} style={{flex: '1 1 100%'}}>
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                />
              </div>
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>
              
              <div className={style.formGroup}>
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state/province"
                />
              </div>
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label htmlFor="zipCode">Zip/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter your zip/postal code"
                />
              </div>
              
              <div className={style.formGroup}>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>
          
          <div className={style.formActions}>
            <button type="submit" className={style.saveButton}>
              <FaSave /> Save Changes
            </button>
            <button
              type="button"
              className={style.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
