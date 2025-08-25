import React from 'react';

export function CTASection() {
  return (
    <section className="bg-[linear-gradient(to_right_bottom,rgb(30,58,138),rgb(17,24,39))] box-border py-20">
      <div className="box-border max-w-4xl text-center mx-auto px-6">
        <h2 className="text-5xl font-bold box-border leading-[48px] mb-8">
          Try it Free. Start Extracting
          <br className="box-border" />
          Intelligence Today.
        </h2>
        <a href="/signup" className="text-lg font-semibold bg-blue-600 box-border inline-block leading-7 px-12 py-4 rounded-lg hover:bg-blue-700 transition-colors">
          Start Extracting Now
        </a>
      </div>
    </section>
  );
}
