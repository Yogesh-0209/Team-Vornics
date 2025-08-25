import React from 'react';
import { supportedLanguages, processSteps } from '../data/aiFeatures';

export function AISection() {
  return (
    <section className="bg-gray-900 box-border py-20">
      <div className="box-border max-w-6xl text-center mx-auto px-6">
        <h2 className="text-4xl font-bold box-border leading-10 mb-8">Powered by Advanced AI & NLP</h2>
        <p className="text-gray-300 text-xl box-border leading-7 max-w-4xl mb-12 mx-auto">
          Our platform harnesses cutting-edge Artificial Intelligence, Machine Learning, and Natural Language Processing algorithms to accurately interpret and extract data from diverse Statement of Facts documents. This robust technology enables us to process unstructured text into structured, actionable insights.
        </p>
        <div className="box-border mb-12">
          <h3 className="text-2xl font-semibold box-border leading-8 mb-6">Supported Languages</h3>
          <div className="box-border gap-x-8 flex justify-center gap-y-8">
            {supportedLanguages.map((language) => (
              <span key={language.code} className="text-blue-400 font-semibold box-border block">
                {language.name}
              </span>
            ))}
          </div>
        </div>
        <div className="items-center box-border gap-x-8 flex justify-center max-w-4xl gap-y-8 mx-auto">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="box-border basis-[0%] grow">
                <div className="items-center bg-blue-600 box-border flex h-16 justify-center w-16 mb-4 mx-auto rounded-lg">
                  <img src={step.icon} alt="Icon" className="box-border h-8 w-8" />
                </div>
                <h4 className="font-semibold box-border mb-2">{step.title}</h4>
              </div>
              {index < processSteps.length - 1 && (
                <div className="text-blue-400 box-border">
                  <img src="https://c.animaapp.com/me1o4g4zYBg550/assets/icon-3.svg" alt="Icon" className="box-border h-6 w-6" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
