import React, { useEffect } from 'react';
import Hero from '../../components/home/Hero';
import FeaturedWorks from '../../components/home/FeaturedWorks';
import CinematicTrailers from '../../components/home/CinematicTrailers';
import ImageRevealSlider from '../../components/home/ImageRevealSlider';
import ArtCollection from '../../components/home/ArtCollection';

const Home = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <FeaturedWorks />
      <CinematicTrailers />
      <ImageRevealSlider />
      <ArtCollection />


      {/* <motion.section
        ref={ourProcessRef}
        className="py-10"
        initial="hidden"
        animate={isOurProcessInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        <OurProcess />
      </motion.section> */}
    </>
  );
};

export default Home;
 