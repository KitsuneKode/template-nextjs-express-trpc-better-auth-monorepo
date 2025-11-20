"use client";

import React from "react";
import { SectionWrapper } from "../ui/section-wrapper";
import { FeatureCard } from "../ui/feature-card";
import { features } from "../../lib/demo-data";

export const Features = () => {
  return (
    <SectionWrapper id="features" className="bg-neutral-950/50">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Everything You Need to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--solar-teal)] to-[var(--solar-blue)]">
            Build Modern Apps
          </span>
        </h2>
        <p className="text-lg text-neutral-400">
          A complete toolkit designed for developer experience and performance.
          Fully typed, fully integrated, fully production-ready.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={<feature.icon className="w-6 h-6" style={{ color: feature.color }} />}
            delay={index * 0.1}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};
