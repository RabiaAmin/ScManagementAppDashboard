import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center min-h-[150px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
  </div>
);

export default Loader;