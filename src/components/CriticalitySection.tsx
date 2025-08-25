import React from 'react';

export function CriticalitySection() {
  return (
    <section className="bg-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image/Visual Section */}
          <div className="flex-1">
            <div className="backdrop-blur-sm bg-[linear-gradient(to_right_bottom,rgba(34,197,94,0.2),rgba(59,130,246,0.2))] border border-gray-700 p-8 rounded-2xl">
              <div className="bg-[linear-gradient(to_right_bottom,rgba(74,222,128,0.3),rgba(147,197,253,0.3))] flex h-64 justify-center items-center w-full rounded-lg">
                <div className="text-center">
                  <div className="bg-green-500 flex h-16 w-16 justify-center items-center mb-4 mx-auto rounded-lg">
                    <img
                      src="/assets/light-sensor-icon.svg"
                      alt="LDR Sensor Icon"
                      className="h-8 w-8"
                    />
                  </div>
                  <p className="text-gray-300">LDR-Based Light Control</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white mb-6">
              Why Automated Lighting is Critical
            </h2>
            <div className="text-gray-300 text-lg space-y-4">
              <p>
                Traditional street lighting systems often rely on manual switching or fixed timers,
                leading to unnecessary energy usage during daylight or poorly lit conditions at night.
              </p>
              <p>
                AutoLight solves this with smart LDR-based control, which dynamically adjusts lighting
                in real-time based on natural light conditions — ensuring streets are illuminated only
                when needed.
              </p>
              <p>
                This automation not only improves safety but also contributes significantly to
                energy conservation and cost reduction in urban infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
