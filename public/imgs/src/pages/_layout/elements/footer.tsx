import { isMobile } from "react-device-detect";

const Footer = () => {
  return (
    <div>
      <section
        className="footer d-flex "
        style={{
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "0px" : "7px 8px",
        }}
      >
        {isMobile ? (
          <>
            <div>
              <div className="footer-top" style={{ alignItems: "end" }}>
                <div className="footer-links">
                  <nav
                    className="navbar navbar-expand-sm"
                    style={{ padding: "0px" }}
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <a className="nav-link" href="/terms-conditions">
                          {" "}
                          Terms and Conditions{" "}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/responsible-gaming">
                          {" "}
                          Responsible Gaming{" "}
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="support-detail" style={{ marginRight: "0px" }}>
                  <h2>24X7 Support</h2>
                </div>
                <div
                  className="support-detail"
                  style={{ marginRight: "0px" }}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: "60%" }}>
              <div className="footer-top" style={{ alignItems: "end" }}>
                <div className="footer-links">
                  <nav
                    className="navbar navbar-expand-sm"
                    style={{ padding: "0px" }}
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="/terms-conditions"
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          Terms and Conditions{" "}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/responsible-gaming">
                          {" "}
                          Responsible Gaming{" "}
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="support-detail" style={{ marginRight: "0px" }}>
                  <h2>24X7 Support</h2>
                  <p></p>
                </div>
              </div>
            </div>
            {/* <div style={{width:'40%'}}>
   <ul className="navbar-nav" style={{padding:'0px 0px 0px',alignItems:'end'}}>
                <li className="nav-item">
                  <a className="nav-link" href="https://wa.me/1234567890"
                   target="_blank"
                    rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <img src="/whatsapp1.png" alt="" style={{width:'45px',height:'45px',background:'white',padding:'5px',borderRadius:'15px'}}/>
                  </a>
                </li>
              </ul>
  </div> */}
          </>
        )}
      </section>
      <div className="footer-bottom">
        <div className="secure-logo">
          <div>
            <img src="https://wver.sprintstaticdata.com/v3/static/front/img/ssl.png" />
          </div>
          <div className="">
            <b>100% SAFE</b>
            <div>Protected connection and encrypted data.</div>
          </div>
        </div>
        <div className="d-inline-block">
          <button className="btn p-0">
            <img src="/imgs/18plus.png" />
          </button>
          <a href="https://www.gamcare.org.uk/">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/gamecare.png" />
          </a>
          <a href="https://www.gamblingtherapy.org/">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/gt.png" />
          </a>
        </div>
      </div>
      <div className="footer-text">
        <p></p>
        <p className="text-center">
          © Copyright 2026. All Rights Reserved. Powered by JMDBOOK.
        </p>
      </div>
    </div>
  );
};
export default Footer;