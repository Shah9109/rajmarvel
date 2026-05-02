import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Raj Marvel Exterior Designs</h1>
          <p className="text-lg text-gray-600">
            With years of experience in exterior marble designing, we have built a reputation for delivering royal haveli-style elevations and modern luxury finishes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-center">
            <img
              src="/assets/ChatGPT Image May 1, 2026, 03_24_34 PM.png"
              alt="Raj Patel"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
            <h3 className="mt-6 text-2xl font-bold text-gray-900">Raj Patel</h3>
            <p className="text-primary font-medium">Founder & Lead Designer</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Raj Marvel Exterior Designs, our mission is to deliver high-quality exterior marble work that transforms ordinary houses into majestic royal villas. Aapko Sirf Design Select Karna Hai, Baaki Kaam Hum Karenge.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our vision is to be the leading marble design firm in the region, known for our traditional haveli styles, innovative approach, and premium finish.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
                <p className="text-gray-600 font-medium">Projects Completed</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
                <p className="text-gray-600 font-medium">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
