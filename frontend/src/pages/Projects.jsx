import ProjectCard from '../components/ProjectCard';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const assetFiles = [
    "10d45750-4130-42a6-b2fa-91825b8a23eb.JPG",
    "1727a55f-08e6-4028-be57-df069628da30.JPG",
    "18a945b9-363d-4fce-8a95-7283973b36c3.JPG",
    "196895e3-2e8d-4d76-9c1a-8f650a1f8296.JPG",
    "2c51ffcf-f9ee-4b1c-9655-a964d1307029.JPG",
    "30cc4124-827e-42a9-81b6-89d8e1178105.JPG",
    "34d4ce7d-58ca-4106-8502-0d9445f0ddf1.JPG",
    "34e42b10-5843-4bd6-9a11-2940df2c680c.JPG",
    "35a13823-406e-4c9c-a571-3fd8a54bb333.JPG",
    "40ff8d10-3e65-47d6-aae4-f80a7b2c03be 2.JPG",
    "40ff8d10-3e65-47d6-aae4-f80a7b2c03be.JPG",
    "42a2e690-e00f-4bb1-bfef-8f8847e4d908 2.JPG",
    "42a2e690-e00f-4bb1-bfef-8f8847e4d908.JPG",
    "56a6ff33-8285-4a28-9e43-cec62674ea60.JPG",
    "5730fa78-1fcb-49e7-958b-3ad9ec57b4ca.JPG",
    "65f6402f-7c00-4eb4-94e4-8c3f29610b93.JPG",
    "67bd546f-bbd8-4425-a239-bc30f348f55a.JPG",
    "6adf6336-b0cb-4f08-aec0-309f1784c1d4.JPG",
    "6e46e504-b2d6-4fa7-b571-19c9577cd8fa.JPG",
    "705b8c64-4b35-470e-b80c-0a67f2b29bed.JPG",
    "74c18109-6557-4501-bd17-5936e1ffc278.JPG",
    "7d2cf537-11ad-47c7-85fc-10694a7b03d4 2.JPG",
    "7d2cf537-11ad-47c7-85fc-10694a7b03d4.JPG",
    "96bffc98-5c4f-481d-a8f8-1889bffac487.JPG",
    "97e33caa-51d5-49c7-b5fe-c99178b105f4.JPG",
    "99e720c9-c119-49af-a44a-6ea2743d80fa.JPG",
    "ChatGPT Image May 1, 2026, 03_24_34 PM.png",
    "IMG_1011.JPG",
    "IMG_1012.JPG",
    "IMG_1013.JPG",
    "IMG_1014.JPG",
    "a08d1c67-e9fc-479b-b0f4-29ee8e3b0052.JPG",
    "a7e50231-eec9-4a41-bd29-3554751781c3.JPG",
    "bc24b656-d15c-4e66-ba42-7ece812088f5.JPG",
    "ce2307d9-5ba1-4785-b8cd-39a9b3696b9a.JPG",
    "d64da483-57ea-4b6c-8356-69383f8cf388.JPG",
    "d776b980-3a52-48cd-9cc9-69ffe092f0e3.JPG",
    "e932d5b7-f524-456f-889e-39c179ec1d8d 2.JPG",
    "e932d5b7-f524-456f-889e-39c179ec1d8d.JPG",
    "ebc7f502-f958-4ac4-b899-dd5222cdd873.JPG",
    "ee30eac0-e7d1-44d5-82b9-73f421d13f44.JPG",
    "f3a296ff-74cc-4201-85a4-c6b9ec852c2f.JPG",
    "f3c49328-6d64-479b-b06a-cee08f669eb6.JPG",
    "fbea0f31-c1a4-4fc1-ac5f-feadca914817.JPG"
  ];

  const attractiveNames = [
    "Royal Haveli Elevation", "Premium Marble Façade", "Classic Villa Exterior",
    "Modern Stone Cladding", "Heritage Front Design", "Majestic Compound Wall",
    "Luxury Garden Fountain", "Traditional Rajasthani Arch", "Grand Entrance Marble",
    "Elegant Palace Elevation", "Signature Stone Carving", "Bespoke Exterior Finish",
    "Timeless Haveli Architecture", "Imperial Marble Front", "Contemporary Villa Design",
    "Artisan Stone Pathway", "Regal Exterior Cladding", "Custom Marble Pillars",
    "Elite Front Elevation", "Majestic Home Exterior", "Classic Sandstone Finish",
    "Premium Jharokha Design", "Luxury Villa Entrance", "Royal Heritage Façade",
    "Exquisite Marble Craft", "Grand Haveli Archway", "Supreme Exterior Styling",
    "Elegant Stone Fencing", "Modern Royal Elevation", "Heritage Style Pillars",
    "Opulent Marble Balcony", "Classic Rajasthani Front", "Majestic Villa Cladding",
    "Premium Heritage Design", "Royal Entrance Gate", "Luxury Stone Exterior",
    "Custom Haveli Facade", "Grand Marble Fountain", "Elegant Home Front",
    "Timeless Stone Art", "Majestic Rajasthani Design", "Elite Marble Walkway",
    "Classic Palace Elevation", "Royal Exterior Masterpiece"
  ];

  const dummyProjects = assetFiles.map((file, index) => ({
    id: index + 1,
    title: attractiveNames[index] || `Premium Design ${index + 1}`,
    category: 'Exterior Design',
    imageUrl: `/assets/${file}`
  }));

  useEffect(() => {
    setProjects(dummyProjects);
    setLoading(false);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 bg-transparent min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-4">Our Work</h1>
          <p className="text-lg text-gray-600">
            A showcase of our finest exterior marble designs across residential and commercial projects.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 text-xl font-medium">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                category={project.category}
                imageUrl={project.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
