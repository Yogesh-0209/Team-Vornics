import React from 'react';

export function AboutSection() {
  return (
    <section className="bg-gray-800 box-border py-20">
      <div className="box-border max-w-4xl text-center mx-auto px-6">
        <h2 className="text-4xl font-bold box-border leading-10 mb-8">About SoF Event Extractor</h2>
        <p className="text-gray-300 text-xl box-border leading-[32.5px]">
          In the dynamic world of maritime logistics, Statement of Facts (SoF) documents are critical. However, manual extraction of laytime events is prone to errors, delays, and significant financial repercussions. SoF Event Extractor is an AI-powered solution designed to revolutionize this process, ensuring accuracy and efficiency.
        </p>
      </div>
    </section>
  );
}
