import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Thumbnail1 from "../../assets/thumbnail1.png";
import Thumbnail4 from "../../assets/thumbnail4.png";
import Thumbnail3 from "../../assets/Thumbnail3.png";

// Customer images
import Customer1 from "../../assets/afkit-img1.jpg";
import Customer2 from "../../assets/afkit-img2.jpg";
import Customer3 from "../../assets/afkit-img3.jpg";
import Customer4 from "../../assets/afkit-img4.jpg";
import Customer5 from "../../assets/afkit-img5.jpg";

// Cloudinary video URLs with optimizations
const CLOUDINARY_VIDEOS = {
  unboxing: "https://res.cloudinary.com/dc0odjwhj/video/upload/f_auto,q_auto,w_800/v1750042574/Afkit_unbox_vid_1_z79bpi.mp4",
  review: "https://res.cloudinary.com/dc0odjwhj/video/upload/f_auto,q_auto,w_800/v1750042717/afkit_unbox_vid_4_utyovq.mp4",
  delivery: "https://res.cloudinary.com/dc0odjwhj/video/upload/f_auto,q_auto,w_1200/v1750042878/afkit_space1_alpaxg.mp4"
};

const HappyCustomersSection = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentPoster, setCurrentPoster] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const modalVideoRef = useRef(null);
  const carouselRef = useRef(null);
  const deliveryVideoRef = useRef(null);

  const videos = [
    {
      poster: Thumbnail1,
      src: CLOUDINARY_VIDEOS.unboxing,
      title: "Unboxing Experience",
      description: "See our premium packaging and first impressions",
      isPortrait: true
    },
    {
      poster: Thumbnail4,
      src: CLOUDINARY_VIDEOS.review,
      title: "Customer Review",
      description: "Hear what our returning customer have to say",
      isPortrait: true
    },
  ];

  const customerImages = [
    { src: Customer1, alt: "Happy customer with product" },
    { src: Customer2, alt: "Customer unboxing experience" },
    { src: Customer3, alt: "Satisfied customer review" },
    { src: Customer4, alt: "Customer showing product" },
    { src: Customer5, alt: "Customer happy with product" },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % customerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [customerImages.length]);

  const openVideo = (videoSrc, posterSrc) => {
    setCurrentVideo(videoSrc);
    setCurrentPoster(posterSrc);
  };

  const closeVideo = () => {
    setCurrentVideo(null);
    setCurrentPoster(null);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="container mx-auto px-6 md:px-12 lg:px-20 py-16"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-12">
        Our Happy Customers: Unboxing & Testimonials
      </h2>

      {/* Video Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer rounded-xl overflow-hidden shadow-lg bg-gray-50"
          >
            <div className="relative">
              <div className={`relative ${video.isPortrait ? 'aspect-[9/16] md:aspect-[9/16]' : 'aspect-video'}`}>
                <video
                  ref={el => videoRefs.current[index] = el}
                  className="w-full h-full object-cover md:object-contain"
                  poster={video.poster}
                  onClick={(e) => {
                    e.preventDefault();
                    openVideo(video.src, video.poster);
                  }}
                  playsInline
                >
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    openVideo(video.src, video.poster);
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-primary ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
              <p className="text-gray-600 text-sm">{video.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Customer Images Carousel */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Our Happy Customers</h3>
        <div className="relative max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg bg-gray-100">
          <div 
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              width: `${customerImages.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / customerImages.length)}%)` 
            }}
          >
            {customerImages.map((image, index) => (
              <div 
                key={index} 
                className="w-full"
                style={{ flex: `0 0 ${100 / customerImages.length}%` }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  style={{ height: "500px" }}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {customerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-primary w-6' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + customerImages.length) % customerImages.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % customerImages.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Where We Deliver Happiness Section */}
      <div className="mt-20 text-center">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Where We Deliver Happiness
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg max-w-3xl mx-auto mb-8"
        >
          Across Nigeria, we bring our premium products and exceptional service to your doorstep. 
          Watch how we make technology accessible nationwide.
        </motion.p>
        
        {/* Delivery Coverage Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl"
        >
          <div className="relative aspect-video">
            <video
              ref={deliveryVideoRef}
              className="w-full h-full object-cover"
              poster={Thumbnail3}
              controls
            >
              <source src={CLOUDINARY_VIDEOS.delivery} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {currentVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition"
            aria-label="Close video"
          >
            &times;
          </button>

          <div className="relative w-full max-w-4xl">
            <div className={`relative ${currentVideo === CLOUDINARY_VIDEOS.unboxing || currentVideo === CLOUDINARY_VIDEOS.review ? 'aspect-[9/16] md:aspect-[9/16]' : 'aspect-video'}`}>
              <img
                src={currentPoster}
                alt="Video poster"
                className={`absolute inset-0 w-full h-full object-contain ${modalVideoRef.current?.paused ? 'block' : 'hidden'}`}
              />
              
              <video
                ref={modalVideoRef}
                controls
                autoPlay
                className="w-full h-full"
                poster={currentPoster}
              >
                <source src={currentVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {modalVideoRef.current?.paused && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => modalVideoRef.current?.play()}
                >
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-12 h-12 text-white ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default HappyCustomersSection;