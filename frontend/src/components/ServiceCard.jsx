import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ServiceCard = ({ title, description, icon: Icon, index = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 border border-gray-100 group overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 transition-transform duration-700 group-hover:scale-150 group-hover:bg-primary/20"></div>
      
      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm border border-primary/10">
        <Icon size={32} className="group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">{description}</p>
      <Link to="/services" className="inline-flex items-center gap-2 text-primary font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all after:duration-300 pb-1">
        Explore Service <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
