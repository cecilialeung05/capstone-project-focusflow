import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
