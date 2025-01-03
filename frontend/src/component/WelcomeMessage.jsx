import "./welcomeMessage.css";

const WelcomeMessage = () => {
  return (
    <div className="welcome-message-container">
      <h1 className="welcome-message-title">
        Welcome to Han Hotels and Resorts
      </h1>
      <p className="welcome-message-subtitle">
        Please enter your Han account details to login
      </p>
      <p className="welcome-message-benefits">
        Once you become a member of Han Hotels and Resorts, you will receive
        various services and benefits that are only available to our members.
      </p>
    </div>
  );
};

export default WelcomeMessage;
