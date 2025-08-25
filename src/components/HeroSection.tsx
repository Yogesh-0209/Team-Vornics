import React from 'react';

export function HeroSection() {
  return (
    <section className="relative items-center bg-[linear-gradient(to_right_bottom,rgb(17,24,39),rgba(30,58,138,0.2),rgb(17,24,39))] box-border flex justify-center min-h-[1000px] overflow-hidden">
      <div className="absolute box-border h-96 opacity-30 translate-y-[-50.0%] w-96 right-0 top-2/4">
        <div className="relative bg-[linear-gradient(to_right_bottom,rgba(59,130,246,0.3),rgba(20,184,166,0.3))] box-border h-full w-full rounded-full">
          <div className="absolute box-border border border-blue-400/30 rounded-full border-solid inset-4"></div>
          <div className="absolute box-border border border-blue-400/20 rounded-full border-solid inset-8"></div>
          <div className="absolute box-border border border-blue-400/10 rounded-full border-solid inset-12"></div>
        </div>
      </div>
      <div className="relative box-border max-w-screen-xl z-10 mx-auto px-6 py-20">
        <div className="box-border max-w-2xl">
          <h1 className="text-6xl font-bold box-border leading-[75px] mb-6">
            <span className="text-blue-400 box-border">Extract</span>
            <br className="box-border" />
            <span className="text-blue-400 box-border">Laytime</span>
            <br className="box-border" />
            <span className="box-border">Events from</span>
            <br className="box-border" />
            <span className="text-blue-400 box-border">Any SoF</span>
            <br className="box-border" />
            <span className="box-border">Document</span>
            <br className="box-border" />
            <span className="text-blue-400 box-border">Instantly</span>
          </h1>
          <p className="text-gray-300 text-xl box-border leading-7 max-w-lg mb-8">
            AI-powered tool for real-time port operations tracking and reporting.
          </p>
          <div className="box-border gap-x-4 flex gap-y-4">
            <a href="/signup" className="font-semibold bg-blue-600 box-border block px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </a>
            <a href="/login" className="text-gray-300 font-semibold bg-transparent block text-center border border-gray-600 px-8 py-3 rounded-lg border-solid hover:bg-gray-800 transition-colors">Try Demo Login</a>
          </div>
        </div>
      </div>
      <div className="absolute box-border translate-x-[-50.0%] left-2/4 bottom-8">
        <div className="box-border flex h-10 justify-center w-6 border-gray-600 rounded-full border-2 border-solid">
          <div className="bg-gray-600 box-border h-3 translate-y-[-25.0%] w-1 mt-2 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
