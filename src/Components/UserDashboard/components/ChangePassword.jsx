import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import UserContext from '../../../shop/UserContext';
import style from '../UserDashboard.module.css';
import { toast, ToastContainer } from 'react-toastify';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout, changePassword, error} = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    // Validate confirm password
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      console.log("changed", res);
      
      toast.success('Password updated successfully');
      toast.success('please, login again with new password');

      logout();
      setTimeout(() => {
        navigate('/login');
      }, 4000);
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Failed to update password:', error);
        toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={style.changePasswordContainer}>
      <div className={style.sectionHeader}>
        <FaLock className={style.sectionIcon} />
        <h3>Change Password</h3>
      </div>
      
      <p className={style.sectionDescription}>
        Update your password to keep your account secure. Your new password must be at least 8 characters 
        and include uppercase letters, lowercase letters, and numbers.
      </p>
      
      <Form onSubmit={handleSubmit} className={style.passwordForm}>
        {/* Current Password Field */}
        <Form.Group className={style.formGroup}>
          <Form.Label>Current Password</Form.Label>
          <div className={style.passwordInputWrapper}>
            <Form.Control
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              isInvalid={!!errors.currentPassword}
              placeholder="Enter your current password"
            />
            <Button 
              variant="link" 
              className={style.passwordToggle}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              type="button"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          {errors.currentPassword && (
            <Form.Text className="text-danger">{errors.currentPassword}</Form.Text>
          )}
        </Form.Group>
        
        {/* New Password Field */}
        <Form.Group className={style.formGroup}>
          <Form.Label>New Password</Form.Label>
          <div className={style.passwordInputWrapper}>
            <Form.Control
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              isInvalid={!!errors.newPassword}
              placeholder="Enter your new password"
            />
            <Button 
              variant="link" 
              className={style.passwordToggle}
              onClick={() => setShowNewPassword(!showNewPassword)}
              type="button"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          {errors.newPassword && (
            <Form.Text className="text-danger">{errors.newPassword}</Form.Text>
          )}
          <Form.Text className="text-muted">
            Password must be at least 8 characters and include uppercase letters, lowercase letters, and numbers.
          </Form.Text>
        </Form.Group>
        
        {/* Confirm Password Field */}
        <Form.Group className={style.formGroup}>
          <Form.Label>Confirm New Password</Form.Label>
          <div className={style.passwordInputWrapper}>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
              placeholder="Confirm your new password"
            />
            <Button 
              variant="link" 
              className={style.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              type="button"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
          )}
        </Form.Group>
        
        <div className={style.formActions}>
          <Button 
            variant="warning" 
            type="submit" 
            className={style.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </div>
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
      </Form>
    </div>
  );
}
