import React from 'react';
import { timelineEvents } from '../data/timeline';

export function TimelineSection() {
  return (
    <section className="bg-gray-900 box-border py-20">
      <div className="box-border max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold box-border leading-10 text-center mb-16">Typical Port Event Timeline</h2>
        <div className="relative items-center box-border flex justify-between">
          <div className="absolute bg-blue-500 box-border h-0.5 translate-y-[-50.0%] top-2/4 inset-x-0"></div>
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative items-center box-border flex flex-col z-10">
              <div className="text-2xl items-center bg-blue-600 box-border flex h-16 justify-center leading-8 w-16 border-gray-900 mb-4 rounded-full border-4 border-solid">{event.icon}</div>
              <h3 className="text-xl font-semibold box-border leading-7 mb-2">{event.title}</h3>
              <p className="text-gray-400 box-border max-w-32 text-center">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
