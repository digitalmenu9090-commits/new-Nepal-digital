import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { STATS } from '../data/portfolioData';

interface CounterProps {
  end: number;
  duration?: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({ end, duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const current = Math.floor(progress === 1 ? end : end * (1 - Math.pow(2, -10 * progress)));
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export const StatsSection: React.FC = () => {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 bg-[#050814]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative p-5 rounded-2xl glass-panel-hover glass-panel border border-cyan-500/15 group"
            >
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                  <AnimatedCounter end={stat.value} />
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-bold text-cyan-400">
                  {stat.suffix}
                </span>
              </div>
              <h4 className="font-heading font-semibold text-sm sm:text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {stat.label}
              </h4>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
