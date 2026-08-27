import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Quote, 
  Sliders, 
  Film, 
  Layers, 
  CheckCircle2, 
  MonitorPlay 
} from 'lucide-react';
import GridMotion from '../../components/ui/GridMotion/GridMotion';

export const aboutData = {
  hero: {
    badge: "ABOUT",
    title: "Color is storytelling.",
    description:
      "I’m a professional colorist specializing in cinematic color grading for commercials, films, television, and visual storytelling.",
    backgroundImage: "/images/hero_01.webp"
  },
  profile: {
    image: "/images/mahmoud.webp",
    name: "Mahmoud Abo hessein",
    title: "About Me",
    role: "Cinematic Colorist & Visual Storyteller",
    quote: "I believe the best grades are often the ones you don’t notice immediately — they simply make the image feel right.",
    paragraphs: [
      "For me, color grading is more than balancing exposure or creating beautiful images. It’s about understanding the story behind every frame and using color, contrast, light, and texture to shape how an audience feels.",
      "I work closely with directors, cinematographers, agencies, and production teams to develop a visual language that feels intentional, distinctive, and true to the project. Whether the goal is natural and timeless, bold and stylized, or dark and atmospheric, my approach is always built around the image and the story.",
      "Over the years, I’ve worked across a wide range of projects and visual styles, developing a workflow that combines technical precision with creative instinct. From camera-original footage and color management to the final look, I care about every stage of the process."
    ],
    stats: [
      { label: "Specialization", value: "Color Grading & Finishing" },
      { label: "Primary Suite", value: "DaVinci Resolve Studio" },
      { label: "Color Science", value: "ACES & Custom Show LUTs" },
      { label: "Delivery Standards", value: "Rec. 709, DCI-P3, HDR10 & Dolby Vision" }
    ]
  },
  pillars: [
    {
      id: "approach",
      title: "My Approach",
      subtitle: "Emotional Direction & Intent",
      description:
        "Every project starts with understanding the intention behind the image. I look at the cinematography, lighting, production design, skin tones, environment, camera characteristics, and most importantly, the emotional direction of the story. From there, I build a color language that supports the work rather than overpowering it.",
      motto: "My goal is simple: Make the image feel something.",
      highlights: [
        "Cinematography & Lighting Integration",
        "Preserving Natural Skin Tone Integrity",
        "Contextual Look Development",
        "Story-First Visual Language"
      ],
      icon: Palette
    },
    {
      id: "collaboration",
      title: "Collaboration",
      subtitle: "Creative Partnership in the Suite",
      description:
        "Great color is rarely created in isolation. I enjoy working directly with directors and cinematographers, discussing references, exploring ideas, and finding the visual balance that serves the project best. I see the grading suite as a creative space where technical knowledge and artistic decisions come together. Whether it’s a single commercial, a complete campaign, or a long-form production, I approach every project with the same attention to detail.",
      motto: "A creative space where technical precision meets artistic decisions.",
      highlights: [
        "Direct Dialogue with Directors & DPs",
        "Reference Moodboards & Look Exploration",
        "Consistent Visual Balance Across Scenes",
        "Dedicated Attention for Commercials & Long-form"
      ],
      icon: Users
    },
    {
      id: "craft",
      title: "Craft & Technology",
      subtitle: "Modern Digital Cinema Pipeline",
      description:
        "My workflow is built around professional color management and modern digital cinema workflows, with a strong focus on maintaining image integrity from camera acquisition through final delivery. I work extensively with DaVinci Resolve and high-end digital cinema formats, combining precise color management with creative tools to achieve consistent, refined results across different cameras, formats, and delivery environments.",
      motto: "Maintaining image integrity from camera sensor to the final master.",
      highlights: [
        "DaVinci Resolve Studio Color Management",
        "ARRI RAW, RED, Sony S-Log, BMD RAW & Canon RAW",
        "Rec.709, DCI-P3, HDR10 & Dolby Vision Standards",
        "Film Emulation, Halation, Grain & Texture Mastery"
      ],
      icon: Sliders
    }
  ],
  cta: {
    title: "Let’s Create Something",
    description:
      "If you’re a director, cinematographer, agency, production company, or filmmaker looking for a colorist to help define the visual identity of your project, I’d love to hear from you.",
    punchline: "Let’s make the image feel right.",
    primaryAction: { label: "Get In Touch", href: "/contact" },
    secondaryAction: { label: "View Selected Work", href: "/projects" }
  }
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-700 selection:text-white">
      {/* Background ambient lighting glow */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-zinc-700/10 blur-[180px] pointer-events-none rounded-full z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden border-b border-border/40" aria-label="Hero banner">
        <div className="absolute inset-0">
          <img 
            src={aboutData.hero.backgroundImage}
            alt="Cinematic Color Grading Background"
            className="w-full h-full object-cover opacity-60"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10  px-4 md:px-6 py-16 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-4"
          >

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Color is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
                storytelling.
              </span>
            </h1>

            <p className="text-zinc-300 text-lg sm:text-xl md:text-2xl font-normal leading-relaxed pt-2">
              {aboutData.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-4 md:px-6 space-y-24 pb-24 relative z-10">
        
        {/* Profile & Narrative Bio Section */}
        <section className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 items-start" aria-labelledby="about-bio-title">
          {/* Profile Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-zinc-700/40 via-zinc-500/20 to-zinc-900/40 rounded-3xl blur-md group-hover:blur-lg transition duration-500 opacity-70" />
              <div className="relative rounded-2xl overflow-hidden border border-border bg-space-900 shadow-2xl">
                <img 
                  src={aboutData.profile.image}
                  alt={aboutData.profile.name}
                  className="w-full h-[420px] sm:h-[500px] lg:h-[540px] object-cover object-top transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-1">
                  <p className="text-xl font-bold text-white tracking-wide">
                    {aboutData.profile.name}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    {aboutData.profile.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Specs / Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {aboutData.profile.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-space-800/80 border border-border/80 backdrop-blur-sm"
                >
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm font-medium text-zinc-200">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profile Narrative Bio */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Philosophy & Vision
              </p>
              <h2 id="about-bio-title" className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Shaping Emotion Through Light & Texture
              </h2>
            </div>

            <div className="space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
              {aboutData.profile.paragraphs.map((p, idx) => (
                <p key={idx} className="text-zinc-300/90 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Key Philosophy Quote Highlight Card */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-space-800/90 via-space-850/80 to-space-900/90 border border-border shadow-xl backdrop-blur-md overflow-hidden">
              <Quote className="absolute top-4 right-4 w-16 h-16 text-zinc-700/20 pointer-events-none" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-medium text-white italic leading-relaxed">
                    “{aboutData.profile.quote}”
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Core Pillars: My Approach, Collaboration, Craft & Technology */}
        <section aria-labelledby="pillars-title" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              The Grading Process
            </p>
            <h2 id="pillars-title" className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              A Disciplined Creative Workflow
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Combining technical rigor with artistic intuition to elevate every production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {aboutData.pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex flex-col justify-between p-7 rounded-2xl bg-space-800/90 border border-border hover:border-zinc-500/80 transition-all duration-300 group shadow-lg hover:shadow-2xl"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-border flex items-center justify-center text-white group-hover:border-zinc-400 group-hover:scale-105 transition-all">
                        <Icon className="w-6 h-6 text-zinc-200" />
                      </div>
                      <span className="text-xs font-mono text-zinc-500">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold text-white group-hover:text-zinc-100 transition">
                        {pillar.title}
                      </h3>
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <p className="text-zinc-300/90 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/60 space-y-4">
                    {pillar.motto && (
                      <p className="text-xs font-semibold text-zinc-200 italic">
                        {pillar.motto}
                      </p>
                    )}

                    <div className="space-y-2">
                      {pillar.highlights.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Grid Motion Showcase */}
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 my-16" aria-label="Visual grid showcase">
          <div className="h-[480px] sm:h-[550px] lg:h-[650px] bg-space-950">
            <GridMotion
              items={[
                'Color Grading',
                <div key="gm-1" className="text-sm font-semibold text-zinc-200">DaVinci Resolve Studio</div>,
                '/images/hero_01.webp',
                'Visual Storytelling',
                <div key="gm-2" className="text-sm font-semibold text-zinc-300">ACES Pipeline</div>,
                '/images/art_01.webp',
                'HDR Mastering',
                <div key="gm-3" className="text-sm font-semibold text-zinc-200">ARRI & RED RAW</div>,
                '/images/hero_02.webp',
                'Look Development',
                <div key="gm-4" className="text-sm font-semibold text-zinc-400">Skin Tone Integrity</div>,
                '/images/art_02.webp',
                'Dolby Vision',
                <div key="gm-5" className="text-sm font-semibold text-zinc-300">Film Print Emulation</div>,
                '/images/hero_03.webp',
                'Commercial Finishing',
                <div key="gm-6" className="text-sm font-semibold text-zinc-200">Conforms & QC</div>,
                '/images/art_03.webp',
                'Shot Matching',
                <div key="gm-7" className="text-sm font-semibold text-zinc-400">Custom Show LUTs</div>,
                '/images/after_edit.webp',
                'Rec. 709 & P3',
                <div key="gm-8" className="text-sm font-semibold text-zinc-300">Broadcast Delivery</div>,
                '/images/art_04.webp',
                'Grain & Texture',
                <div key="gm-9" className="text-sm font-semibold text-zinc-200">Halation & Tone</div>,
                '/images/before_edit.webp',
                'Feature Narrative',
                <div key="gm-10" className="text-sm font-semibold text-zinc-400">Master Grading</div>,
                '/images/art_05.webp',
                'DCI-P3 Color Space',
                <div key="gm-11" className="text-sm font-semibold text-zinc-300">HDR10 Grade</div>,
                '/images/art_06.webp',
              ]}
              gradientColor="#08080a"
            />
          </div>
        </section>

        {/* Let's Create Something (CTA Section) */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-zinc-700/80 bg-gradient-to-b from-space-800 via-space-900 to-black p-8 sm:p-12 lg:p-16 text-center shadow-2xl"
          aria-labelledby="cta-title"
        >
          {/* Ambient inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-zinc-600/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">

            <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {aboutData.cta.title}
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              {aboutData.cta.description}
            </p>

            <p className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 italic">
              “{aboutData.cta.punchline}”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to={aboutData.cta.primaryAction.href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-100 text-zinc-950 font-bold text-sm hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                <span>{aboutData.cta.primaryAction.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to={aboutData.cta.secondaryAction.href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-space-800/90 text-zinc-200 hover:text-white border border-border hover:border-zinc-400 font-semibold text-sm transition-all duration-300"
              >
                <Film className="w-4 h-4" />
                <span>{aboutData.cta.secondaryAction.label}</span>
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default About;