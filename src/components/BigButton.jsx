import { motion } from 'framer-motion';

export default function BigButton({ children, onClick, color = 'blue', icon, disabled }) {
  const colors = {
    blue: 'bg-kids-blue hover:bg-blue-600',
    green: 'bg-kids-green hover:bg-green-600',
    purple: 'bg-kids-purple hover:bg-purple-600',
    orange: 'bg-kids-orange hover:bg-orange-600',
    pink: 'bg-kids-pink hover:bg-pink-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${colors[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        px-8 py-6 rounded-3xl font-extrabold text-white text-xl shadow-xl 
        flex items-center gap-3 transition-colors`}
    >
      {icon && <span className="text-3xl">{icon}</span>}
      {children}
    </motion.button>
  );
}
