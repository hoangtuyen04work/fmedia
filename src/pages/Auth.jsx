import React, { useState } from 'react';
import '../styles/Auth.scss';
import { login, signup } from '../services/authService';

function Auth() {
  const [isActive, setIsActive] = useState(false);
  
  // State lưu giá trị input
  const [signupData, setSignupData] = useState({
    userName: '',
    phone: '',
    email: '',
    customId: '',
    password: '',
    acceptTerms: false,
  });

  const [loginData, setLoginData] = useState({
    phone: '',
    email: '',
    customId: '',
    password: ''
  });

  const toggleForm = () => {
    setIsActive(!isActive);
  };
  
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("dada", loginData)
    const data = await login(loginData)

    console.log('Login Data:', data);
  };

  const handleSignup = async (event) => {
    // console.log("dada", signupData)
    // const data = await signup(signupData)
    event.preventDefault();
    try {
      const response = await signup(signupData);
      console.log("Signup Response:", response); // Kiểm tra phản hồi từ server
  } catch (error) {
      console.error("Signup Error:", error.response ? error.response.data : error.message);
  }
    // console.log('Login Data:', data);
  };

  return (
    <div className='auth-container'>
      <section className={`wrapper ${isActive ? 'active' : ''}`}>
        <div className="form signup">
          <header onClick={toggleForm}>Signup</header>
          <form onSubmit={handleSignup}>
            <input 
              type="text" 
              placeholder="User name" 
              required 
              value={signupData.userName}
              onChange={(e) => setSignupData({ ...signupData, userName: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="Email or Phone or UserId" 
              required 
              value={signupData.customId}
              onChange={(e) => setSignupData({ ...signupData, customId: e.target.value })}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            <div className="checkbox">
              <input 
                type="checkbox" 
                id="signupCheck" 
                checked={signupData.acceptTerms}
                onChange={(e) => setSignupData({ ...signupData, acceptTerms: e.target.checked })}
              />
              <label htmlFor="signupCheck">I accept all terms & conditions</label>
            </div>
            <input type="submit" value="Signup" />
          </form>
        </div>
        <div className="form login">
          <header onClick={toggleForm}>Login</header>
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Email or Phone or UserId" 
              required 
              value={loginData.customId}
              onChange={(e) => setLoginData({ ...loginData, customId: e.target.value })}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <a href="#">Forgot password?</a>
            <input type="submit" value="Login" />
          </form>
        </div>
      </section>
    </div>
  );
}

export default Auth;
