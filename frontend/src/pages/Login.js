import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email' className='form-label'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='form-input'
              placeholder='Enter your email'
            />
            {errors.email && <div className='form-error'>{errors.email}</div>}
          </div>

          <div className='form-group'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='form-input'
              placeholder='Enter your password'
            />
            {errors.password && (
              <div className='form-error'>{errors.password}</div>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary btn-lg'
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className='auth-link'>
          Don't have an account? <Link to='/register'>Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
