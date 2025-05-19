import { MDBFooter, MDBContainer, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Style from './Footer.module.css';
import LogoLight from '../../assets/images/Logo_light.png';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const myRoute = location.pathname;
  const routesWithoutNav = ["/login", "/forgetpassword", "/resetpassword", "/signup", "/success/", "/cancel/"];

  const paymentMethods = [
    {
      name: "Visa",
      url: "https://i.imgur.com/AHCoUZO.png"
    },
    {
      name: "Mastercard",
      url: "https://i.imgur.com/2ISgYja.png"
    },
    {
      name: "PayPal",
      url: "https://i.imgur.com/W5vSLzb.png"
    }
   
  ];

  return (
    <>
    {!routesWithoutNav.includes(myRoute) && (
    <MDBFooter className={`${Style['bg-color']}`}>
      <MDBContainer className={Style.mainContainer}>
        <MDBRow className='g-4'>
          {/* Logo Column */}
          <MDBCol lg="3" md="6" className={Style.brandColumn}>
            <img src={LogoLight} className={Style.logo} alt="Logo" />
            <p className={Style.slogan}>
              <q>Your health, our care – quality medicines you can trust.</q>
            </p>
            <div className={Style.paymentMethods}>
             
              <div className={Style.paymentIcons}>
                {paymentMethods.map((payment, index) => (
                  <img 
                    key={index}
                    src={payment.url} 
                    alt={payment.name}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </MDBCol>

          {/* Links Column 1 */}
          <MDBCol lg="3" md="6" className={Style.linksColumn}>
            <h5 className={Style['column-title']}>Information</h5>
            <ul className={Style.links}>
              <li><a href="#!">About Us</a></li>
              <li><a href="#!">Pricing Plans</a></li>
              <li><a href="#!">Blogs</a></li>
              <li><a href="#!">Our Categories</a></li>
            </ul>
          </MDBCol>

          {/* Links Column 2 */}
          <MDBCol lg="3" md="6" className={Style.linksColumn}>
            <h5 className={Style['column-title']}>Browse</h5>
            <ul className={Style.links}>
              <li><a href="#!">Apothecary</a></li>
              <li><a href="#!">Beauty</a></li>
              <li><a href="#!">Skincare</a></li>
              <li><a href="#!">Wellness</a></li>
            </ul>
          </MDBCol>

          {/* Contact Column */}
          <MDBCol lg="3" md="6" className={Style.contactColumn}>
            <div className={Style.workingHours}>
              <h5 className={Style['column-title']}>Working Hours</h5>
              <div className={Style.scheduleWrapper}>
                <p className={Style.paracolor}><span>Mon - Fri:</span> <span>09:00 - 22:00</span></p>
                <p className={Style.paracolor}><span>Sun:</span> <span>Closed</span></p>
              </div>
            </div>

            <div className={Style.socialSection}>
              <h5 className={Style['column-title']}>Follow Us</h5>
              <div className={Style['social-icons']}>
                <a href="#!" className={Style.icon}><i className="fa-brands fa-facebook"></i></a>
                <a href="#!" className={Style.icon}><i className="fa-brands fa-twitter"></i></a>
                <a href="#!" className={Style.icon}><i className="fa-brands fa-linkedin"></i></a>
                <a href="#!" className={Style.icon}><i className="fa-brands fa-instagram"></i></a>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <div className={`${Style.copyright} `}>
        <MDBContainer className={Style.copyrightContent}>
          &copy; {new Date().getFullYear()} Qode Interactive |{' '}
          <a href="mailto:careplus@example.com" className=' text-warning-400'>Careplus@example.com</a>
        </MDBContainer>
      </div>
    </MDBFooter>)}
    </>
  );
}
