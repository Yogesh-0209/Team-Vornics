import React from 'react';

export function FileUploadWidget() {
  return (
    <div className="box-border text-center mt-10">
      <input type="file" className="items-baseline bg-transparent box-border hidden text-start text-ellipsis text-nowrap p-0" />
      <button className="bg-blue-500 px-4 py-2 rounded-bl rounded-br rounded-tl rounded-tr">Click to Browse</button>
    </div>
  );
}
