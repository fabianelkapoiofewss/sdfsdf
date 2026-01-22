import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./css/LoadingScreen.css";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 3000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        {/* Círculos decorativos */}
        <motion.div
          className="circle circle-top"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="circle circle-bottom"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Logo animado */}
        <motion.div
          className="logo-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="logo-outer">
            <motion.div
              className="logo-inner"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="logo-core"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Texto de carga */}
        <motion.div
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2>Cargando</h2>
          <p>{progress}%</p>
        </motion.div>

        {/* Barra de progreso */}
        <div className="progress-bar-background">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Puntos animados */}
        <div className="loading-dots">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="dot"
              animate={{
                y: ["0%", "-50%", "0%"],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}