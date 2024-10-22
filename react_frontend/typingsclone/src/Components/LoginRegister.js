import React, { useState, useRef } from 'react';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);

  const inputRefName = useRef(null);
  const inputRefPassword = useRef(null);
  const inputRefConfirm = useRef(null);



  const handleFocus = (ref) => {
    if (ref.current) { // Ensure the ref is not null before calling focus
      ref.current.focus();
    }
  };

  return (
	<section>
		<h2  class="login-register-header">{isLogin ? 'login' : 'register'}</h2>
		<div class="form-box">
			<div class="form-inside">
				<form action="" class="main-form">
					<div class="input-box">
						<p class="label" onClick={() => handleFocus(inputRefName)}>name:  </p>
						<input ref={inputRefName} type="email" class="email-box" required />
					</div>
					<div class="input-box">
						<p class="label" onClick={() => handleFocus(inputRefPassword)}>password: </p>
						<input ref={inputRefPassword} type="password" class="password-box" required/>
					</div>
					{!isLogin && (
						<div class="input-box">
							<p class="label" onClick={() => handleFocus(inputRefConfirm)}>confirm: </p>
							<input ref={inputRefConfirm} type="email" class="confirm-password-box" required/>
						</div>
					)}
					<button type="submit" class="login-register-button">{isLogin ? 'login' : 'register'}</button>
				</form>                
			</div>
		</div>
		<button class="login-register-switch" onClick={() => setIsLogin(!isLogin)}>
			{isLogin ? 'create an account' : 'already have an account?'}
		</button>    
	</section>
  );
}

export default LoginRegister;