import React, { useEffect } from 'react';
import Hero from '../../components/home/Hero';
import FeaturedWorks from '../../components/home/FeaturedWorks';
import CinematicTrailers from '../../components/home/CinematicTrailers';
import ImageRevealSlider from '../../components/home/ImageRevealSlider';
import ArtCollection from '../../components/home/ArtCollection';
import LazySection from '../../components/ui/LazySection';

const Home = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <LazySection height="600px">
        <FeaturedWorks />
      </LazySection>
      <LazySection height="700px">
        <CinematicTrailers />
      </LazySection>
      <LazySection height="500px">
        <ImageRevealSlider />
      </LazySection>
      <LazySection height="500px">
        <ArtCollection />
      </LazySection>

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
 