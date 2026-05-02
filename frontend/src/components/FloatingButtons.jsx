import { Phone, MessageCircle } from 'lucide-react';

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 flex flex-col gap-4 z-40">
      <a
        href="tel:+918700595896"
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors hover:scale-110 duration-200"
        aria-label="Call us"
      >
        <Phone size={24} />
      </a>
      <a
        href="https://wa.me/918700595896"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors hover:scale-110 duration-200"
        aria-label="WhatsApp us"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
};

export default FloatingButtons;
