import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-16 md:pb-0">
        {/* Added padding-top for fixed navs, and padding-bottom for fixed mobile nav */}
        <Outlet />
      </main>
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default Layout;
