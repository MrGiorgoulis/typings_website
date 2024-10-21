import React, { useState } from 'react';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-register">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        {!isLogin && (
          <div>
            <label>Confirm Password:</label>
            <input type="password" placeholder="Confirm your password" />
          </div>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account?'}
      </button>
    </div>
  );
}

export default LoginRegister;
