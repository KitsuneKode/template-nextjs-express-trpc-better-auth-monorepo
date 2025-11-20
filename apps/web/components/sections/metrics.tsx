"use client";

import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "motion/react";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const metrics = [
  { label: "First Byte", value: "0ms", color: "var(--solar-orange)" },
  { label: "Lighthouse Score", value: "100", color: "var(--solar-green)" },
  { label: "Initial Bundle", value: "< 50kb", color: "var(--solar-teal)" },
  { label: "Type Safety", value: "100%", color: "var(--solar-blue)" },
];

export const Metrics = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <SectionWrapper id="metrics" className="bg-neutral-950/50">
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ color: metric.color, textShadow: `0 0 20px ${metric.color}40` }}
            >
              {metric.value}
            </motion.div>
            <div className="text-neutral-400 font-medium uppercase tracking-wider text-sm">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
