import React, { useState } from 'react';
import '../styles/Auth.scss';

function Auth() {
  const [isActive, setIsActive] = useState(false);

  const toggleForm = () => {
    setIsActive(!isActive);
  };

  return (
    <div className='auth-container'>
      <section className={`wrapper ${isActive ? 'active' : ''}`}>
        <div className="form signup">
          <header onClick={toggleForm}>Signup</header>
          <form action="#">
            <input type="text" placeholder="User name" required />
            <input type="text" placeholder="Email or Phone or UserId" required />
            <input type="password" placeholder="Password" required />
            <div className="checkbox">
              <input type="checkbox" id="signupCheck" />
              <label htmlFor="signupCheck">I accept all terms & conditions</label>
            </div>
            <input type="submit" value="Signup" />
          </form>
        </div>
        <div className="form login">
          <header onClick={toggleForm}>Login</header>
          <form action="#">
            <input type="text" placeholder="Email or Phone or UserId" required />
            <input type="password" placeholder="Password" required />
            <a href="#">Forgot password?</a>
            <input type="submit" value="Login" />
          </form>
        </div>
      </section>
    </div>
  );
}

export default Auth;