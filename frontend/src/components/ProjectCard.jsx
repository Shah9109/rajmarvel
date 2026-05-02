import { motion } from 'framer-motion';

const ProjectCard = ({ title, category, imageUrl, large }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden shadow-lg bg-secondary cursor-pointer border border-gray-800"
    >
      {/* Aspect ratio container */}
      <div className={`relative w-full overflow-hidden ${large ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent
                        opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content pinned to bottom with nice hover animation */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="w-8 h-[2px] bg-primary mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
          <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-widest block mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {category}
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
