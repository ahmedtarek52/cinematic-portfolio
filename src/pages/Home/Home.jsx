import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Film, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import ArtCollection from '../../components/home/ArtCollection';
import ProjectCard from '../Projects/ProjectCard';
import Hero from '../../components/home/Hero';
import { OurProcess } from '../../components/home/OurProcess';

const Home = () => {
  const [isVisible, setIsVisible] = useState({});

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Create refs for each section to track when they come into view
  const featuredWorksRef = React.useRef(null);
  const artCollectionRef = React.useRef(null);
  const ourProcessRef = React.useRef(null);

  // Use useInView hook to detect when sections are in view
  const isFeaturedWorksInView = useInView(featuredWorksRef, { once: true, margin: "-100px" });
  const isArtCollectionInView = useInView(artCollectionRef, { once: true, margin: "-100px" });
  const isOurProcessInView = useInView(ourProcessRef, { once: true, margin: "-100px" });

  return (
    <>
      <Hero />
      
      {/* Featured Works */}
      <motion.section
        ref={featuredWorksRef}
        aria-labelledby="featured-works"
        className="py-10 max-w-7xl mx-auto px-4 md:px-0"
        id="featured-works"
        initial="hidden"
        animate={isFeaturedWorksInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        {/* Title */}
        <motion.h1
          className="w-full text-center font-extrabold leading-none  
                 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 
                 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={isFeaturedWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          Voyager
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-300 text-lg md:text-xl leading-relaxed 
               max-w-[60ch] text-center mx-auto mb-16 mt-6 px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isFeaturedWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Voyager Press is a modern travel and lifestyle newsroom that showcases
          inspiring stories, destination features, and travel industry updates.
        </motion.p>

        {/* Grid with Individual Card Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-10">
          {projects.slice(0, 4).map((project, index) => {
            // Create a ref for each project card
            const cardRef = React.useRef(null);
            // Check if this specific card is in view
            const isCardInView = useInView(cardRef, { once: true, margin: "-50px" });
            
            return (
              <motion.div
                key={project.id}
                ref={cardRef}
                id={`project-${project.id}`}
                className="project-card-animate"
                initial={{ opacity: 0, y: 30 }}
                animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            );
          })}
        </div>
      </motion.section>
      
      <motion.section 
        ref={artCollectionRef}
        className="py-10 px-4 md:px-0"
        initial="hidden"
        animate={isArtCollectionInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        <ArtCollection />
      </motion.section>
      
      <motion.section 
        ref={ourProcessRef}
        className="py-10"
        initial="hidden"
        animate={isOurProcessInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        <OurProcess />
      </motion.section>
    </>
  );
};

export default Home; 