import React from 'react';
import { supportedInputs } from '../data/inputs';

export function InputsSection() {
  return (
    <section className="bg-gray-900 box-border py-20">
      <div className="box-border max-w-4xl text-center mx-auto px-6">
        <h2 className="text-4xl font-bold box-border leading-10 mb-16">Supported Inputs</h2>
        <div className="box-border gap-x-12 flex justify-center gap-y-12 mb-16">
          {supportedInputs.map((input) => (
            <div key={input.id} className="box-border">
              <div className="items-center bg-blue-600 box-border flex h-20 justify-center w-20 mb-4 mx-auto rounded-lg">
                <img src={input.icon} alt="Icon" className="box-border h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold box-border leading-7">{input.name}</h3>
            </div>
          ))}
        </div>
        <div className="box-border border-gray-600 p-12 rounded-2xl border-2 border-dashed">
          <div className="box-border">
            <img src="https://c.animaapp.com/me1o4g4zYBg550/assets/icon-11.svg" alt="Icon" className="text-blue-400 box-border h-16 w-16 mb-4 mx-auto" />
            <p className="text-gray-300 text-xl box-border leading-7 mb-4">Drag & drop your SoF documents here</p>
            <button className="text-blue-400 bg-transparent underline p-0">or click to browse</button>
          </div>
        </div>
      </div>
    </section>
  );
}
