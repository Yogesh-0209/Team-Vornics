import React from 'react';
import { footerSections, socialLinks } from '../data/footer';

export function Footer() {
  return (
    <footer className="bg-gray-900 box-border border-gray-800 py-12 border-t border-solid">
      <div className="box-border max-w-6xl mx-auto px-6">
        <div className="items-center box-border flex justify-between mb-8">
          <div className="box-border gap-x-12 flex gap-y-12">
            {footerSections.map((section) => (
              <div key={section.id} className="box-border">
                <h4 className="font-semibold box-border mb-4">{section.title}</h4>
                <ul className="text-gray-400 box-border list-none pl-0">
                  {section.links.map((link, index) => (
                    <li key={link.id} className={index === 0 ? "box-border text-left" : "box-border text-left mt-2"}>
                      <a href={link.href} className="box-border">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="box-border gap-x-4 flex gap-y-4">
            {socialLinks.map((social) => (
              <a key={social.id} href={social.href} className="text-gray-400 box-border block">
                <img src={social.icon} alt="Icon" className="box-border h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
        <div className="items-center box-border flex justify-between border-gray-800 pt-8 border-t border-solid">
          <div className="items-center box-border gap-x-2 flex gap-y-2">
            <span className="text-gray-400 box-border block">Made with</span>
            <div className="items-center box-border gap-x-1 flex gap-y-1">
              <div className="items-center bg-blue-500 box-border flex h-6 justify-center w-6 rounded-bl rounded-br rounded-tl rounded-tr">
                <span className="text-xs font-bold box-border block leading-4">V</span>
              </div>
              <span className="text-blue-400 font-semibold box-border block">python</span>
            </div>
          </div>
          <div className="text-gray-400 text-sm box-border leading-5">© 2024 SoF Event Extractor. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
