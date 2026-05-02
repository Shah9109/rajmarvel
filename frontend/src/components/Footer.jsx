import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <footer className={`bg-secondary text-gray-200 pt-12 pb-24 md:pb-8 border-t border-secondary ${isAboutPage ? 'block' : 'hidden md:block'}`}>
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">Raj Marvel Exterior Designs</h3>
          <p className="text-gray-300">
            Complete Exterior Marble Work – Design Se Installation Tak. Apne Ghar Ko De Royal Exterior Look.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="/services" className="hover:text-primary transition-colors">Services</a></li>
            <li><a href="/projects" className="hover:text-primary transition-colors">Projects</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/services" className="hover:text-primary transition-colors">Front Elevation Design</a></li>
            <li><a href="/services" className="hover:text-primary transition-colors">Haveli Style Exterior Work</a></li>
            <li><a href="/services" className="hover:text-primary transition-colors">Marble Pillars & Columns</a></li>
            <li><a href="/services" className="hover:text-primary transition-colors">Garden & Fountain Work</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
          <ul className="space-y-2 text-gray-300">
            <li>WhatsApp: 8700595896</li>
            <li>Phone: +91 8700595896</li>
            <li>Email: rjdelhi143@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Raj Marvel Exterior Designs. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
