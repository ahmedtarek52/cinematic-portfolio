import React from 'react';

const ExpandableImageGallery = ({ images = [] }) => {
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <img key={idx} src={img} alt="" className="rounded-xl object-cover w-full h-48" />
      ))}
    </div>
  );
};

export default ExpandableImageGallery;
