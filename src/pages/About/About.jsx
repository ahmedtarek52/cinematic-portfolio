import React from 'react';
import { Award, Film, Briefcase, Play } from 'lucide-react';
import GridMotion from '../../components/ui/GridMotion/GridMotion';

// Mock data - Replace with your actual data source
const aboutData = {
  hero: {
    title: "Crafting Stories Through Color & Edit",
    description: "I'm a cinematic colorist and editor shaping emotion through light, hue, and narrative—delivering bold brand films.",
    backgroundImage: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/e4f82e123053265.60e65a86ead4f.jpg"
  },
  profile: {
    image: "/images/mahmoud.png",
    name: "Mahmoud Abo hessein",
    title: "About Me",
    bio: "I'm Mahmoud Abo-hessein, a post-production artist focused on color grading and editorial. My work blends precise craft with cinematic sensibility—balancing mood, pace, and clarity around the story.",
    description: "Specialized in tonal shaping, montage, and look development across narrative, commercial, and music formats.",
    experience: "8+ years crafting color and edits for screen.",
    projects: "Projects: commercials, music videos, features, trailers.",
    tools: "Tools: DaVinci Resolve, Premiere Pro, After Effects.",
    highlights: "Highlights: festival selections, national brand spots, MV premieres."
  },
  sections: [
    {
      title: "Where Color Meets Emotion",
      description: "I build cohesive looks that guide the audience—shaping contrast, palette, and texture for theatrical and streaming masters while preserving skin tone integrity.",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop",
      cta: "View My Work",
      imagePosition: "left"
    },
    {
      title: "Storytelling Through Editing",
      description: "Rhythm, timing, and restraint drive my editorial approach—crafting momentum for trailers and clarity for long-form narratives with narrative-first pacing.",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=600&fit=crop",
      cta: "See Selected Projects",
      imagePosition: "right"
    }
  ],
  skills: [
    {
      category: "Color Grading",
      items: "HDR, ACES, Dolby Vision, show LUTs, look dev"
    },
    {
      category: "Editorial",
      items: "Narrative, Commercial, Music, trailers"
    },
    {
      category: "Software",
      items: "Resolve, Premiere Pro, After Effects"
    },
    {
      category: "Finishing",
      items: "Shot matching, conforms, online, delivery"
    },
    {
      category: "Look Development",
      items: "Film emulation, grain, texture, halation"
    },
    {
      category: "Standards",
      items: "Rec. 709, P3, HDR10, Dolby Vision"
    }
  ],
  workflow: [
    {
      title: "Initial Vision",
      description: "Kickoff, references, intent, deliverables, schedules.",
      step: "01"
    },
    {
      title: "Color Exploration",
      description: "Look dev, test shots, palette and contrast direction.",
      step: "02"
    },
    {
      title: "Editing Pass",
      description: "Assembly to fine cut with story-driven pacing.",
      step: "03"
    },
    {
      title: "Finishing",
      description: "Conforms, shot matching, cleanup, titles, sound polish.",
      step: "04"
    },
    {
      title: "Delivery",
      description: "Masters in required specs: sRGB/P3, broadcast, web, QC.",
      step: "05"
    }
  ],
  highlights: [
    {
      category: "Festivals",
      title: "Sundance, TIFF, SXSW",
      description: "Projects screened and distributed."
    },
    {
      category: "Awards",
      title: "Clio & Webby Nods",
      description: "Recognized for visual craft and storytelling."
    },
    {
      category: "Collaborations",
      title: "Directors & Studios",
      description: "Close work with indie and brand teams."
    },
    {
      category: "Brands",
      title: "Global Campaigns",
      description: "Trusted by Nike, BMW, Adobe, and music labels."
    }
  ]
};

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section */}
      <section className="relative h-[400px] mb-12 overflow-hidden" aria-label="Hero banner">
        <div className="absolute inset-0">
          <img 
            src={aboutData.hero.backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-60"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
        <div className="relative px-4 md:px-6 h-full flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">
            {aboutData.hero.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {aboutData.hero.description}
          </p>
        </div>
      </section>

      <div className="px-4 md:px-6 space-y-16 pb-16">
        
        {/* About Me Section */}
        <section className="grid md:grid-cols-4 gap-8" aria-labelledby="about-title">
          {/* Profile Image */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl top-8">
              <img 
                src={aboutData.profile.image}
                alt={aboutData.profile.name}
                className="w-full h-[350px] md:h-[550px] lg:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Profile Content */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div>
              <h2 id="about-title" className="text-3xl font-bold mb-4">
                {aboutData.profile.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                {aboutData.profile.bio}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {aboutData.profile.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl p-4 border border-gray-800" style={{ backgroundColor: '#111' }}>
                <div className="flex items-start gap-3">
                  <Award className="text-blue-500 flex-shrink-0 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      {aboutData.profile.experience}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4 border border-gray-800" style={{ backgroundColor: '#111' }}>
                <div className="flex items-start gap-3">
                  <Film className="text-blue-500 flex-shrink-0 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      {aboutData.profile.projects}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4 border border-gray-800 sm:col-span-2" style={{ backgroundColor: '#111' }}>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">Tools:</span> {aboutData.profile.tools.replace('Tools: ', '')}
                </p>
              </div>

              <div className="rounded-xl p-4 border border-gray-800 sm:col-span-2" style={{ backgroundColor: '#111' }}>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">Highlights:</span> {aboutData.profile.highlights.replace('Highlights: ', '')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Where Color Meets Emotion */}
        {/* <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={aboutData.sections[0].image}
              alt="Color grading workspace"
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              {aboutData.sections[0].title}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {aboutData.sections[0].description}
            </p>
            <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-br from-[#1488CC] to-[#2B32B2] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/50">
              {aboutData.sections[0].cta}
            </button>
          </div>
        </section> */}

        {/* Storytelling Through Editing */}
        {/* <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 lg:order-1">
            <h2 className="text-3xl font-bold">
              {aboutData.sections[1].title}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {aboutData.sections[1].description}
            </p>
            <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-br from-[#1488CC] to-[#2B32B2] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/50">
              {aboutData.sections[1].cta}
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl lg:order-2">
            <img 
              src={aboutData.sections[1].image}
              alt="Film editing timeline"
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </section> */}

        {/* Grid Motion Showcase */}
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8" aria-label="Visual grid showcase">
          <div className="h-[600px] lg:h-[700px]">
            <GridMotion
              items={[
                'Color Grading',
                <div key="gm-1" className="text-sm font-semibold text-blue-400">DaVinci Resolve</div>,
                '/images/hero_01.webp',
                'Film Editing',
                <div key="gm-2" className="text-sm font-semibold text-purple-400">Premiere Pro</div>,
                '/images/art_01.png',
                'HDR Mastering',
                <div key="gm-3" className="text-sm font-semibold text-amber-400">After Effects</div>,
                '/images/hero_02.webp',
                'Look Development',
                <div key="gm-4" className="text-sm font-semibold text-emerald-400">ACES Pipeline</div>,
                '/images/art_02.png',
                'Dolby Vision',
                <div key="gm-5" className="text-sm font-semibold text-rose-400">Film Emulation</div>,
                '/images/hero_03.webp',
                'Narrative Pacing',
                <div key="gm-6" className="text-sm font-semibold text-cyan-400">Conforms</div>,
                '/images/art_03.png',
                'Shot Matching',
                <div key="gm-7" className="text-sm font-semibold text-orange-400">Online Finishing</div>,
                '/images/after_edit.webp',
                'Rec. 709',
                <div key="gm-8" className="text-sm font-semibold text-violet-400">Show LUTs</div>,
                '/images/art_04.png',
                'Grain & Texture',
                <div key="gm-9" className="text-sm font-semibold text-teal-400">Halation</div>,
                '/images/before_edit.webp',
                'Sound Polish',
                <div key="gm-10" className="text-sm font-semibold text-pink-400">Delivery QC</div>,
                '/images/art_05.png',
                'P3 Color Space',
                <div key="gm-11" className="text-sm font-semibold text-lime-400">HDR10</div>,
                '/images/art_06.png',
              ]}
              gradientColor="#0a0a0a"
            />
          </div>
        </section>

        {/* Skills & Tools */}
        <section aria-labelledby="skills-title">
          <h2 id="skills-title" className="text-3xl font-bold mb-8">
            Skills & Tools
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutData.skills.map((skill, index) => (
              <div 
                key={index}
                className="rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                style={{ backgroundColor: '#111' }}
              >
                <h3 className="text-white font-semibold mb-2">
                  {skill.category}
                </h3>
                <p className="text-gray-400 text-sm">
                  {skill.items}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        {/* <section aria-labelledby="workflow-title">
          <h2 id="workflow-title" className="text-3xl font-bold mb-8">
            Workflow
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {aboutData.workflow.map((step, index) => (
              <div 
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="text-4xl font-bold text-gray-800 mb-3 group-hover:text-blue-500 transition-colors">
                  {step.step}
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Highlights */}
        {/* <section aria-labelledby="highlights-title">
          <h2 id="highlights-title" className="text-3xl font-bold mb-8">
            Highlights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.highlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                  {highlight.category}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {highlight.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </section> */}

      </div>
    </div>
  );
};

export default About;