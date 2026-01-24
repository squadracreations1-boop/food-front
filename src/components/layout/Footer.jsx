import { Link } from 'react-router-dom'
import { routes } from '../../routes/routeConfig'
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "../../assets/Logo Png.png";

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-emerald-900 text-white pb-24 md:pb-0">
      <div className="container">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-emerald-900 rounded-lg flex items-center justify-center">
                <img src={Logo} alt="Maitreyi Foods" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Maitreyi Foods</h2>
                <p className="text-emerald-200 text-sm">Fresh & Natural</p>
              </div>
            </div>
            <p className="text-emerald-200">
              “Farm-grown organic spices, traditionally crafted
              for pure taste and everyday wellness.”
            </p>
          </div>

          {/* Our Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Location</h3>
            <div className="w-full h-40 rounded-lg overflow-hidden border border-gold/30 shadow-lg">
              <iframe
                title="Company Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15683.80498758971!2d77.004759!3d10.6608923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba839d117dea505%3A0xb3fd96d9c8642659!2sPollachi%2C%20Tamil%20Nadu%20642001!5e0!3m2!1sen!2sin!4v1768802347295!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to={`${routes.products}?category=Fruits & Vegetables`} className="text-emerald-200 hover:text-white transition-colors">
                  Veg Masala
                </Link>
              </li>
              <li>
                <Link to={`${routes.products}?category=Dairy & Eggs`} className="text-emerald-200 hover:text-white transition-colors">
                  Non-Veg Masala
                </Link>
              </li>
              <li>
                <Link to={`${routes.products}?category=Organic Staples`} className="text-emerald-200 hover:text-white transition-colors">
                  Food Incredients
                </Link>
              </li>
              <li>
                <Link to={`${routes.products}?category=Personal Care`} className="text-emerald-200 hover:text-white transition-colors">
                  Nutritions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>

            <ul className="space-y-4 text-emerald-200">
              {/* Address */}
              <li className="flex items-start space-x-3">
                <span className="text-xl mt-1"> <MapPin className="w-5 h-5 text-white-900 mt-1" /></span>
                <div className="leading-relaxed">
                  <p>39/B2, Makkinampatti Road</p>
                  <p>Near KPS Garden, Suleeswaranpatti (PO)</p>
                  <p>Pollachi (TK), Coimbatore</p>
                  <p>Tamil Nadu – 642006</p>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-center space-x-3">
                <span className="text-xl"> <Phone className="w-5 h-5 text-sky-400 mt-1" /></span>
                <span>+91 97502 52635</span>
              </li>

              {/* Email */}
              <li className="flex items-center space-x-3">
                <span className="text-xl"> <Mail className="w-5 h-5 text-red-500 mt-1" /></span>
                <span>maitreyifoods@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-emerald-200">
              © {currentYear} MaitreyiFoods. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to={routes.privacyPolicy} className="text-emerald-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to={routes.termsAndConditions} className="text-emerald-200 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to={routes.returnPolicy} className="text-emerald-200 hover:text-white transition-colors">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer