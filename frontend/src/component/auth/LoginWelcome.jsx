import "./auth.css";

const LoginWelcome = () => {
  return (
    <div className="login-welcome-container">
      <h1 className="login-welcome-title">Welcome to Han Hotels and Resorts</h1>
      <p className="login-welcome-subtitle">
        Please enter your Han account details to login
      </p>
      <p className="login-welcome-benefits">
        Once you become a member of Han Hotels and Resorts, you will receive
        various services and benefits that are only available to our members.
      </p>
    </div>
  );
};

export default LoginWelcome;
