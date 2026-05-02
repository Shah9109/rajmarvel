const Pricing = () => {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Transparent Pricing</h1>
          <p className="text-lg text-gray-600">
            Choose a plan that fits your project needs. We ensure high-quality delivery at competitive rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Plan</h3>
            <div className="text-4xl font-extrabold text-primary mb-6">$50 <span className="text-lg font-medium text-gray-500">/ sq.ft</span></div>
            <ul className="space-y-4 mb-8 text-gray-600">
              <li className="flex items-center gap-3">✓ Standard Material Quality</li>
              <li className="flex items-center gap-3">✓ Basic Architectural Design</li>
              <li className="flex items-center gap-3">✓ 6 Months Maintenance</li>
              <li className="flex items-center gap-3 text-gray-400">✗ Premium Fittings</li>
              <li className="flex items-center gap-3 text-gray-400">✗ Custom Interiors</li>
            </ul>
            <button className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 rounded-lg transition-colors">
              Get Started
            </button>
          </div>

          {/* Standard Plan */}
          <div className="bg-secondary rounded-2xl p-8 border border-secondary shadow-xl transform md:-translate-y-4 relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Standard Plan</h3>
            <div className="text-4xl font-extrabold text-white mb-6">$80 <span className="text-lg font-medium text-gray-400">/ sq.ft</span></div>
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-center gap-3">✓ Premium Material Quality</li>
              <li className="flex items-center gap-3">✓ Custom Architectural Design</li>
              <li className="flex items-center gap-3">✓ 1 Year Maintenance</li>
              <li className="flex items-center gap-3">✓ Standard Fittings</li>
              <li className="flex items-center gap-3 text-gray-500">✗ Luxury Interiors</li>
            </ul>
            <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Plan</h3>
            <div className="text-4xl font-extrabold text-primary mb-6">$120 <span className="text-lg font-medium text-gray-500">/ sq.ft</span></div>
            <ul className="space-y-4 mb-8 text-gray-600">
              <li className="flex items-center gap-3">✓ Luxury Material Quality</li>
              <li className="flex items-center gap-3">✓ 3D & Custom Architectural Design</li>
              <li className="flex items-center gap-3">✓ 5 Years Maintenance</li>
              <li className="flex items-center gap-3">✓ Luxury Fittings & Imports</li>
              <li className="flex items-center gap-3">✓ Fully Custom Interiors</li>
            </ul>
            <button className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
