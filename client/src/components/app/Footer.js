import React from 'react';
import './footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { useLocation } from 'react-router-dom';

function Footer() {
	
  const location = useLocation();
  
  	if(location.pathname.startsWith ("/admin")){
	 return null;
	};
  
  return (
    <div className="footer-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <h6 className="text-center" style={{ fontSize: '20px', margin: '0' }}><strong>CHEE-US</strong></h6>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center footer-text">
              <div className="footer-icons">
                <InstagramIcon />
                <FacebookIcon />
                <XIcon />
              </div>
              <p className="footer-mail">Mail : 29dongsung@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;