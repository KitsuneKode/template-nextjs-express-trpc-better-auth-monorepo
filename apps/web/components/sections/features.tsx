'use client'

import React from 'react'
import { features } from '../../lib/demo-data'
import { FeatureCard } from '../ui/feature-card'
import { SectionWrapper } from '../ui/section-wrapper'

export const Features = () => {
  return (
    <SectionWrapper id="features" className="bg-neutral-950/50">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
          Everything You Need to <br />
          <span className="bg-gradient-to-r from-[var(--solar-teal)] to-[var(--solar-blue)] bg-clip-text text-transparent">
            Build Modern Apps
          </span>
        </h2>
        <p className="text-lg text-neutral-400">
          A complete toolkit designed for developer experience and performance.
          Fully typed, fully integrated, fully production-ready.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={
              <feature.icon
                className="h-6 w-6"
                style={{ color: feature.color }}
              />
            }
            delay={index * 0.1}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
