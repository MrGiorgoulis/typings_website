import React, { useState } from 'react';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);

  return (
	<section>
		<h2  class="login-register-header">{isLogin ? 'login' : 'register'}</h2>
		<div class="form-box">
			<div class="form-inside">
				<form action="">
					<div class="input-box">
						<p class="label">email:  </p>
						<input type="email" class="email-box" required />
					</div>
					<div class="input-box">
						<p class="label">password: </p>
						<input type="password" class="password-box" required/>
					</div>
					{!isLogin && (
						<div class="input-box">
							<p class="label">confirm: </p>
							<input type="email" class="confirm-password-box" required/>
						</div>
					)}
					<button type="submit">{isLogin ? 'login' : 'register'}</button>
				</form>                
			</div>
		</div>
		<button onClick={() => setIsLogin(!isLogin)}>
			{isLogin ? 'create an account' : 'already have an account?'}
		</button>    
	</section>
  );
}

export default LoginRegister;


		// <section>
		// 	<div className="login-register">
		// 		<h2 class="header">{isLogin ? 'login' : 'register'}</h2>
		// 		<div class="form-inside">
		// 			<form class="form-box">
		// 				<div class="input-box">
		// 					<p class="label">email: </p>
		// 					<input type="email" class="email-box" required/>
		// 				</div>
		// 				<div class="input-box">
		// 					<p class="label">password: </p>
		// 					<input type="email" class="password-box" required/>
		// 				</div>
		// 					{!isLogin && (
		// 						<div class="input-box">
		// 							<p class="label">confirm password: </p>
		// 						<input type="email" class="password-box" required/>
		// 						</div>
		// 					)}
		// 					<button type="submit">{isLogin ? 'login' : 'register'}</button>
		// 					<button onClick={() => setIsLogin(!isLogin)}>
		// 					{isLogin ? 'create an account' : 'already have an account?'}
		// 				</button>
		// 				</form>
		// 			</div>
		// 	</div>
		// </section>