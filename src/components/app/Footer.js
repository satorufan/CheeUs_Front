import React from 'react';
import './footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

function Footer() {
  return (
    <div className="footer-container" style={{ backgroundColor: 'white', color: 'black', padding: '20px 0', fontFamily:'GwangyangTouching'}}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <h6 className="text-center" style={{ fontSize: '20px' }}><strong>CHEE-US</strong ></h6>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
             <div className="text-center footer-text">
                <div>
                <InstagramIcon style={{ margin: '5px 10px' }} />
                <FacebookIcon style={{ margin: '5px 10px' }} />
                <XIcon style={{ margin: '5px 10px' }} />
                </div>
                <p>Mail : 29dongsung@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;