import "./footer.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <a href="/">
          <h2>The Han</h2>
          <p>Hotels & Resorts</p>
        </a>
      </div>
      <ul className="footer-content">
        <li>
          <h2>Our Hotel</h2>
          <ul className="box">
            <li>The Han Cologne</li>
            <li>+49-221-1234567</li>
            <li>The Han Berlin</li>
            <li>+49-30-1234567</li>
          </ul>
        </li>
        <li>
          <h2>Our Company</h2>
          <ul className="box">
            <li>
              <a href="/about">About The Han</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </li>
        <li>
          <h2>SNS</h2>
          <ul className="box">
            <div className="sns-icons">
              <a href="https://www.linkedin.com/in/yoomi-isabel-kim-4855572b7/">
                <LinkedInIcon />
              </a>
              <a href="https://github.com/YisabelK">
                <GitHubIcon />
              </a>
            </div>
          </ul>
        </li>
      </ul>

      <div className="footer-bottom">
        <p>
          The Han Hotels & Resorts | Yoomi Kim | All Right Reserved &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;
