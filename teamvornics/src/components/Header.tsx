import React from 'react';
import { navigationItems } from '../data/navigation';

export function Header() {
  return (
    <header className="fixed backdrop-blur-sm bg-gray-900/100 box-border z-50 border-gray-800 border-b border-solid top-0 inset-x-0">
      <div className="box-border max-w-screen-xl mx-auto px-6 py-4">
        <div className="items-center box-border flex justify-between">
          <div className="items-center box-border gap-x-2 flex gap-y-2">
            <div className="items-center bg-blue-500 box-border flex h-8 justify-center w-8 rounded-lg">
              <span className="text-sm font-bold box-border block leading-5">S</span>
            </div>
            <span className="text-blue-400 text-xl font-bold box-border block leading-7">SoF</span>
          </div>
          <nav className="items-center box-border gap-x-8 hidden min-h-0 min-w-0 gap-y-8 md:flex md:min-h-[auto] md:min-w-[auto]">
            {navigationItems.map((item) => (
              <a key={item.id} href={item.href} className="text-gray-300 box-border inline min-h-0 min-w-0 md:block md:min-h-[auto] md:min-w-[auto]">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
