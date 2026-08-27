import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../services/projects";
import ProjectCard from "../../pages/Projects/ProjectCard";

const FeaturedProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      id={`project-${project.id}`}
      className="project-card-animate h-full"
      initial={{ opacity: 0, y: 35 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );
};

export const FeaturedWorks = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  return (
    <section
      ref={sectionRef}
      id="featured-works"
      aria-label="Featured Works"
      className="relative py-8 md:py-16 px-4 md:px-6"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-zinc-700/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="relative text-center mb-16 space-y-4">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          Featured Works
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          A curated selection of signature commercial, narrative, documentary,
          and music video productions crafted with precision color grading and
          dynamic storytelling.
        </motion.p>
      </div>

      {/* Grid with Individual Card Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
        {projects.slice(0, 4).map((project, index) => (
          <FeaturedProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedWorks;
