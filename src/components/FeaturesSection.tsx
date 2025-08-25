import React from 'react';
import { keyFeatures } from '../data/features';

export function FeaturesSection() {
  return (
    <section className="bg-gray-800 box-border py-20">
      <div className="box-border max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold box-border leading-10 text-center mb-16">Key Features</h2>
        <div className="box-border gap-x-8 grid grid-cols-none gap-y-8 md:grid-cols-[repeat(3,minmax(0px,1fr))]">
          {keyFeatures.map((feature) => (
            <div key={feature.id} className="box-border text-center">
              <div className="text-blue-400 items-center bg-blue-600/20 box-border flex h-16 justify-center w-16 mb-6 mx-auto rounded-lg">
                <img src={feature.icon} alt="Icon" className="box-border h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold box-border leading-7 mb-4">{feature.title}</h3>
              <p className="text-gray-300 box-border">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
