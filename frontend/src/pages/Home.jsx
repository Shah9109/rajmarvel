import HeroSection from '../components/HeroSection';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import { Palette, Layers, Trees, ShieldCheck, PaintBucket, Columns, Star, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const services = [
    {
      title: 'Exterior Marble Services',
      description: 'Transform the face of your home with our premium front elevation designs, combining structural durability with a majestic royal look tailored to your vision.',
      icon: Palette,
    },
    {
      title: 'Premium Exterior Designs',
      description: 'Experience the grandeur of traditional Indian architecture with intricate Rajasthani carvings, jharokhas, and custom Haveli-style stonework.',
      icon: Layers,
    },
    {
      title: 'Outdoor & Landscape Work',
      description: 'Elevate your outdoor spaces with custom marble fountains, elegant pathways, and heavy-duty compound wall cladding for a premium finish.',
      icon: Trees,
    },
  ];

  const bottomIcons = [
    { label: 'Royal Marble Finishing', icon: PaintBucket },
    { label: 'Traditional Haveli Style', icon: Columns },
    { label: 'Modern Exterior Design', icon: Star },
    { label: 'Garden & Fountain Work', icon: Droplets },
    { label: 'Front Elevation Design', icon: ShieldCheck },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bg-white py-4 shadow-sm relative z-20">
        <h1 className="text-red-600 font-bold text-center text-3xl md:text-4xl uppercase tracking-wider flex items-center justify-center gap-4">
          <img src="/assets/299065a7dbca85c6a323f2df2020ea34.webp" alt="decoration left" className="h-[1.2em] w-auto inline-block" />
          जयगुरुदेव
          <img src="/assets/15718929-1622981834029-3597b5b4a0a9b%20copy.webp" alt="decoration right" className="h-[1.2em] w-auto inline-block" />
        </h1>
      </div>
      <HeroSection />

      {/* Services Overview */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Expertise</h2>
            <p className="text-gray-600 text-lg">
              "You just select the design, we will do the rest." Specializing in complete exterior marble transformations with flawless craftsmanship.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {services.map((s, i) => (
              <ServiceCard key={i} index={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Features/Icons Banner */}
      <section className="bg-secondary text-white py-16 border-y-4 border-primary">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {bottomIcons.map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/50">
                  <item.icon size={32} />
                </div>
                <span className="font-semibold text-sm md:text-base">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-3">Featured Work</h2>
              <p className="text-gray-600">Explore some of our most celebrated royal exterior marble designs.</p>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all font-medium text-sm">
              View All Projects →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            <ProjectCard large title="Royal Haveli Elevation" category="Traditional Design" imageUrl="/assets/10d45750-4130-42a6-b2fa-91825b8a23eb.JPG" />
            <ProjectCard large title="Modern Villa Marble" category="Modern Classic" imageUrl="/assets/1727a55f-08e6-4028-be57-df069628da30.JPG" />
            <ProjectCard large title="Royal Compound Wall" category="Outdoor Work" imageUrl="/assets/18a945b9-363d-4fce-8a95-7283973b36c3.JPG" />
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <div className="bg-secondary pb-8 text-center text-gray-400 pt-8">
        <p className="text-sm">
          Website is made by{' '}
          <a 
            href="https://catcatchcode.online" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#fbcfe8] hover:text-white transition-colors font-semibold underline"
          >
            Catcatchcode.online
          </a>
        </p>
      </div>

    </motion.div>
  );
};

export default Home;
