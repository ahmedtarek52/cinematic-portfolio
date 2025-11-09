export const projects = [
  {
    id: "nocturne",
    title: "Nocturne",
    category: "Narrative",
    year: "2025",
    type: "Commercial",
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    description: "A cinematic exploration of urban nightlife through the lens of color and mood.",
    services: ["Color", "HDR"],
    tags: ["ACES", "Dolby Vision", "HDR10", "Grain Management"],
    metadata: "2025 • Commercial • Color, HDR",
    overview: "Our team delivered a complete color pipeline for this atmospheric narrative piece, balancing the warm glow of sodium streetlight and neon reflections with natural skin tones. The final deliverable included a Dolby Vision pass for streaming platforms, maintaining consistency across all viewing environments.",
    approach: "We established a teal-amber palette to enhance the night-time atmosphere while preserving detail in deep blacks and controlled highlights. Shot-matched keys and tracked power windows allowed for precise control over specific elements. SDR trims were created for broadcast and social media distribution.",
    stills: [
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "A. Rivera" },
      { role: "DP", name: "L. Chen" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Editor", name: "K. Patel" },
      { role: "Producer", name: "J. Stone" }
    ],
    techSpecs: {
      master: "8K",
      colorSpace: "P3-D65",
      hdr: "Dolby V.",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "drift",
    title: "Drift",
    category: "Commercial",
    year: "2024",
    type: "Commercial",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "An epic journey through vast desert landscapes, showcasing the power of natural light and color.",
    services: ["Finish", "Dolby Vision"],
    tags: ["ACES", "Dolby Vision", "HDR10"],
    metadata: "2024 • Commercial • Finish, Dolby Vision",
    overview: "This commercial project required extensive color grading and finishing work to bring out the rich textures of the desert landscape. We worked closely with the director to achieve a cinematic look that emphasizes the natural beauty of the environment.",
    approach: "We utilized a warm, earth-toned palette to complement the desert setting. Advanced color grading techniques were applied to enhance the natural light variations throughout the day. The final deliverable included a Dolby Vision master for premium viewing experiences.",
    stills: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "S. Martinez" },
      { role: "DP", name: "R. Kim" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Editor", name: "T. Brown" },
      { role: "Producer", name: "L. Anderson" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 2020",
      hdr: "Dolby V.",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "pulse",
    title: "Pulse",
    category: "Music Video",
    year: "2024",
    type: "Music Video",
    heroImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop",
    description: "A vibrant music video featuring dynamic lighting and energetic visuals.",
    services: ["Edit", "VFX"],
    tags: ["VFX", "Color Grading", "Motion Graphics"],
    metadata: "2024 • Music Video • Edit, VFX",
    overview: "This high-energy music video combined editorial finesse with stunning visual effects. We created a seamless narrative that syncs perfectly with the music's rhythm and energy.",
    approach: "Our editorial team worked closely with the artist to craft a compelling visual story. VFX enhancements were integrated to amplify the performance scenes, creating an immersive viewing experience that captures the essence of live performance.",
    stills: [
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "K. Johnson" },
      { role: "DP", name: "M. White" },
      { role: "Editor", name: "K. Patel" },
      { role: "VFX Supervisor", name: "D. Lee" },
      { role: "Producer", name: "A. Taylor" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 709",
      hdr: "SDR",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "echoes",
    title: "Echoes",
    category: "Documentary",
    year: "2024",
    type: "Documentary",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "A thoughtful documentary exploring human connections and natural landscapes.",
    services: ["Color"],
    tags: ["Color Grading", "Documentary"],
    metadata: "2024 • Documentary • Color",
    overview: "This documentary required a sensitive approach to color grading, maintaining the authenticity of the footage while enhancing the emotional resonance of the narrative.",
    approach: "We applied a natural, restrained color palette that respects the documentary's authentic footage. Subtle enhancements were made to guide the viewer's attention and support the storytelling without overwhelming the content.",
    stills: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "P. Wilson" },
      { role: "DP", name: "N. Garcia" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Editor", name: "R. Thompson" },
      { role: "Producer", name: "C. Rodriguez" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 709",
      hdr: "SDR",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "satin",
    title: "Satin",
    category: "Commercial",
    year: "2024",
    type: "Commercial",
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    description: "A sleek commercial featuring sophisticated studio lighting and fashion photography.",
    services: ["Finish"],
    tags: ["Color Grading", "Finish"],
    metadata: "2024 • Commercial • Finish",
    overview: "This commercial project required precise color grading to achieve a luxurious, high-end look that complements the product's premium positioning.",
    approach: "We developed a refined color palette that emphasizes texture and detail. Careful attention was paid to skin tones and fabric textures, ensuring a polished final product that meets the highest broadcast standards.",
    stills: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "E. Clark" },
      { role: "DP", name: "J. Miller" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Editor", name: "S. Davis" },
      { role: "Producer", name: "F. Moore" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 709",
      hdr: "SDR",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "amber-rooms",
    title: "Amber Rooms",
    category: "Narrative",
    year: "2024",
    type: "Narrative",
    heroImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop",
    description: "A haunting narrative piece set in a mysterious forest environment.",
    services: ["Color", "Sound"],
    tags: ["Color Grading", "Sound Design"],
    metadata: "2024 • Narrative • Color, Sound",
    overview: "This narrative project required a collaborative approach between color grading and sound design to create an immersive, atmospheric experience.",
    approach: "We established a cool, desaturated palette with warm accents to enhance the mysterious forest setting. The color work was closely integrated with sound design to create a cohesive sensory experience.",
    stills: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "B. Jackson" },
      { role: "DP", name: "H. Wright" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Editor", name: "K. Patel" },
      { role: "Sound Designer", name: "J. Adams" },
      { role: "Producer", name: "G. Harris" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 709",
      hdr: "SDR",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "charge",
    title: "Charge",
    category: "Commercial",
    year: "2024",
    type: "Commercial",
    heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
    description: "A high-energy commercial featuring dynamic product photography and vibrant colors.",
    services: ["Edit"],
    tags: ["Editorial", "Color Grading"],
    metadata: "2024 • Commercial • Edit",
    overview: "This fast-paced commercial required tight editorial work to create a compelling narrative within a short timeframe.",
    approach: "Our editorial team crafted a rhythmically-driven cut that emphasizes the product's key features. Color grading was applied to enhance the vibrant, energetic feel of the piece.",
    stills: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "T. Robinson" },
      { role: "DP", name: "L. Martinez" },
      { role: "Editor", name: "K. Patel" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Producer", name: "M. Lewis" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 709",
      hdr: "SDR",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "livewire",
    title: "Livewire",
    category: "Music Video",
    year: "2024",
    type: "Music Video",
    heroImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    description: "An electrifying music video capturing the energy of live performance.",
    services: ["VFX"],
    tags: ["VFX", "Color Grading"],
    metadata: "2024 • Music Video • VFX",
    overview: "This music video combined live performance footage with sophisticated VFX work to create a visually stunning piece.",
    approach: "Our VFX team integrated seamless effects that enhance the performance without distracting from the artist. Color grading unified the various elements into a cohesive visual experience.",
    stills: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "A. Martinez" },
      { role: "DP", name: "R. Taylor" },
      { role: "VFX Supervisor", name: "D. Lee" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Producer", name: "K. White" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "Rec. 709",
      hdr: "SDR",
      pipeline: "ACES"
    },
    vimeo: null
  },
  {
    id: "apogee",
    title: "Apogee",
    category: "Documentary",
    year: "2024",
    type: "Documentary",
    heroImage: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop",
    description: "A contemplative documentary exploring urban landscapes and human stories.",
    services: ["Color", "HDR"],
    tags: ["Color Grading", "HDR", "Documentary"],
    metadata: "2024 • Documentary • Color, HDR",
    overview: "This documentary project required careful color grading to maintain authenticity while enhancing the visual storytelling. An HDR version was created for premium distribution.",
    approach: "We applied a natural, documentary-style color grade that respects the source material. The HDR pass was carefully crafted to provide additional depth and detail for viewers with compatible displays.",
    stills: [
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop"
    ],
    credits: [
      { role: "Director", name: "C. Brown" },
      { role: "DP", name: "A. Wilson" },
      { role: "Colorist", name: "M. Davies" },
      { role: "Editor", name: "R. Thompson" },
      { role: "Producer", name: "L. Garcia" }
    ],
    techSpecs: {
      master: "4K",
      colorSpace: "P3-D65",
      hdr: "HDR10",
      pipeline: "ACES"
    },
    vimeo: null
  }
];

// Helper function to get related projects
export const getRelatedProjects = (currentProjectId, limit = 2) => {
  const currentProject = projects.find(p => p.id === currentProjectId);
  if (!currentProject) return [];
  
  return projects
    .filter(p => p.id !== currentProjectId && (
      p.category === currentProject.category || 
      p.services.some(service => currentProject.services.includes(service))
    ))
    .slice(0, limit);
};

// Helper function to get all unique categories
export const getCategories = () => {
  const categories = new Set(projects.map(p => p.category));
  return Array.from(categories).sort();
};

// Helper function to get all unique services
export const getServices = () => {
  const services = new Set();
  projects.forEach(p => {
    p.services.forEach(s => services.add(s));
  });
  return Array.from(services).sort();
};

// Helper function to get all unique years
export const getYears = () => {
  const years = new Set(projects.map(p => p.year));
  return Array.from(years).sort().reverse();
};

