import ServiceCard from '../components/ServiceCard';
import { Palette, Layers, Trees, Hammer, PenTool, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    { 
      title: 'Front Elevation Marble Design', 
      description: 'We transform the exterior face of your home with premium, meticulously crafted marble designs. A well-designed front elevation not only provides a majestic royal look but also ensures structural durability and weather resistance for decades.', 
      icon: Palette 
    },
    { 
      title: 'Haveli Style Exterior Work', 
      description: 'Experience the grandeur of traditional Indian architecture with our Haveli style exterior work. We specialize in intricate Rajasthani carvings, jharokhas, and detailed stonework that gives any modern home the timeless elegance of an ancient palace.', 
      icon: Hammer 
    },
    { 
      title: 'Marble Pillars & Columns', 
      description: 'Enhance your property\'s grandeur with our custom-built marble pillars and columns. From simple cylindrical supports to heavily carved Roman and Corinthian style pillars, we provide flawless craftsmanship that adds structural strength and unmatched aesthetic appeal.', 
      icon: Ruler 
    },
    { 
      title: 'Balcony & Railing Design', 
      description: 'Upgrade your balconies and terraces with our secure, beautifully carved marble railings. We offer a wide variety of CNC-cut patterns, hand-carved jali (lattice) work, and classic baluster designs that seamlessly blend safety with luxury.', 
      icon: PenTool 
    },
    { 
      title: 'Garden & Fountain Work', 
      description: 'Elevate your outdoor landscaping with our exquisite marble garden features. We design and install custom water fountains, elegant seating benches, decorative planters, and durable stone pathways that turn your garden into a serene retreat.', 
      icon: Trees 
    },
    { 
      title: 'Compound Wall Cladding', 
      description: 'Protect and beautify your property boundaries with our heavy-duty marble wall cladding. Designed to withstand harsh weather conditions, our compound wall solutions provide a sophisticated, premium finish that makes a lasting first impression.', 
      icon: Layers 
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-12 mt-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Exterior Marble Services</h1>
          <p className="text-lg text-gray-600">
            "You just select the design, we will do the rest." We specialize in complete exterior marble transformations, delivering flawless craftsmanship from conceptual design to final installation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Services;
