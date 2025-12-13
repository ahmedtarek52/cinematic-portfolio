import React, { useState } from 'react';

const ArtCollection = () => {
  const [activeImageId, setActiveImageId] = useState(2);

  const images = [
    {
      id: 1,
      url: 'https://tse1.mm.bing.net/th/id/OIP.ueciqJkbJUx-VlJzqWlXKQHaEJ?cb=ucfimg2&ucfimg=1&w=626&h=351&rs=1&pid=ImgDetMain&o=7&rm=3',
      alt: 'Abstract Art 1',
      title: 'Colorful Waves',
      description: 'Vibrant abstract composition with flowing lines'
    },
    {
      id: 2,
      url: 'https://tse2.mm.bing.net/th/id/OIP.kF4tZgoT866MUP89S2BnlQHaEK?cb=ucfimg2&ucfimg=1&w=2048&h=1152&rs=1&pid=ImgDetMain&o=7&rm=3',
      alt: 'Abstract Art 2',
      title: 'Geometric Harmony',
      description: 'Bold shapes and contrasting colors in perfect balance'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=600&q=80',
      alt: 'Abstract Art 3',
      title: 'Midnight Dreams',
      description: 'Deep blues and purples creating a dreamy atmosphere'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=600&q=80',
      alt: 'Abstract Art 4',
      title: 'Sunset Embrace',
      description: 'Warm oranges and reds blending into soft yellows'
    },
    {
      id: 5,
      url: 'https://th.bing.com/th/id/R.9fad5a039679f843b105c8e46a792872?rik=TNejmJFNTONkRA&pid=ImgRaw&r=0',
      alt: 'Abstract Art 5',
      title: 'Ocean Depths',
      description: 'Cool greens and blues evoking underwater tranquility'
    },
    {
      id: 6,
      url: 'https://tse2.mm.bing.net/th/id/OIP.h5SHb3csMTGnz_z3W2DI_QHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
      alt: 'Abstract Art 6',
      title: 'Desert Mirage',
      description: 'Earthy tones and textures inspired by desert landscapes'
    }
  ];

  return (

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" text-center">
          <h1 className="text-4xl md:text-5xl font-bold  mb-4">
            Our Art Collection
          </h1>
          <p className="text-lg text-gray-600">
            Click or hover over any image to expand - the selected image stays expanded
          </p>
        </div>

        {/* Gallery Container */}
        <div className="flex gap-5 h-96">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer relative"
              style={{
                width: activeImageId === image.id ? '416px' : '140px',
                transition: 'width 0.4s cubic-bezier(0.8, 0, 0.2, 1)'
              }}
              onClick={() => setActiveImageId(image.id)}
              onMouseEnter={() => setActiveImageId(image.id)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay for active image */}
              {activeImageId === image.id && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-xl">{image.title}</h3>
                  <p className="text-white/90 text-sm mt-1">{image.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  );
};

export default ArtCollection;