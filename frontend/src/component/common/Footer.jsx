import "./footer.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>The Han</h2>
          <p>Hotels & Resorts</p>
        </div>
        <div className="footer-links">
          <div>
            <p>
              The Han Cologne{" "}
              <span className="phone-number">+49-221-1234567</span>
            </p>
            <p>
              The Han Berlin{" "}
              <span className="phone-number">+49-30-1234567</span>
            </p>
          </div>
          <div className="footer-menu">
            <a href="/about">About The Han</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
        <div className="footer-sns">
          <span>SNS</span>
          <div className="sns-icons">
            <a
              href="https://www.linkedin.com/in/yoomi-isabel-kim-4855572b7/"
              className="sns-icon"
            >
              <LinkedInIcon />
            </a>
            <a href="https://github.com/YisabelK" className="sns-icon">
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copyright">
          The Han | All Right Reserved &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default FooterComponent;
