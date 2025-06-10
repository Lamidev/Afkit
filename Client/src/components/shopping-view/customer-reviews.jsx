

import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CustomerReviews = () => {
  // Using the provided image URLs for avatars and Nigerian names
  const reviews = [
    {
      id: 1,
      name: 'Nonso Nkemdirim',
      rating: 5,
      comment: 'Absolutely love my purchase! The quality exceeded my expectations and delivery was super fast. Will definitely shop here again!',
      date: 'March 15, 2024',
      avatar: 'https://images.pexels.com/photos/18779012/pexels-photo-18779012.jpeg?cs=srgb&dl=pexels-johnson-ambisa-547930445-18779012.jpg&fm=jpg'
    },
    {
      id: 2,
      name: 'Tunde Olaleye',
      rating: 4,
      comment: 'The product quality is outstanding and it arrived earlier than expected. Will order again.',
      date: 'April 10, 2024',
      avatar: 'https://media.istockphoto.com/id/1671407049/photo/authentic-portrait-of-handsome-smiling-african-american-man-looking-at-camera.jpg?s=612x612&w=0&k=20&c=x_uWUbJGQb8bT8uKaU15va-Xk9xYYogyLVxyf6V_WLI='
    },
    {
      id: 3,
      name: 'Adanna Okafor',
      rating: 5,
      comment: 'This is my second order and I’m just as impressed as the first time. Highly recommended!',
      date: 'March 28, 2024',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQesas79ivum649KFBvwjFgSL_TNxQ0-QLF4Q&s'
    },
    {
      id: 4,
      name: 'Blessing Adekunle',
      rating: 5,
      comment: 'Solid customer service and top-notch items. I’ll definitely tell my friends about this store.',
      date: 'February 16, 2024',
      avatar: 'https://www.okayafrica.com/media-library/kolade-mayowa-bolade-and-ore-akinde-are-running-thriving-businesses-built-on-the-back-of-the-craft-they-love-crochet.png?id=53156379&width=1245&height=700&quality=80&coordinates=0%2C0%2C0%2C158'
    },
    {
      id: 5,
      name: 'Fatima Abdullahi',
      rating: 4,
      comment: 'Good value for money. Packaging was neat and arrived without any issues. Could improve shipping speed.',
      date: 'January 29, 2024',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVW80AM_12isldNgqWiU9W5Mhtd43bor_j4FFfQxW1IialehoXTXks54fkaXvYiwRrFp4&usqp=CAU'
    },
    {
      id: 6,
      name: 'Chidinma Eze',
      rating: 5,
      comment: 'Excellent experience from start to finish. The product looks even better in person.',
      date: 'March 3, 2024',
      avatar: 'https://the-ibg.com/wp-content/uploads/2015/12/12295766_10204490386653577_1691251345_o.jpg?w=760&h=946'
    },
    {
      id: 7,
      name: 'Chukwuemeka Okoro',
      rating: 5,
      comment: 'Truly impressed with the authenticity of the products. Highly recommend this store for quality gadgets!',
      date: 'May 1, 2024',
      avatar: 'https://www.bellanaija.com/wp-content/uploads/2020/02/John-Ogba-Ifeakanwa.jpg'
    },
    {
      id: 8,
      name: 'Saliu Mohammed',
      rating: 4,
      comment: 'The support team was very helpful and responsive. Happy with my purchase.',
      date: 'April 22, 2024',
      avatar: 'https://images.unsplash.com/photo-1723221890385-6949a72be9da?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmlnZXJpYW4lMjBtYW58ZW58MHx8MHx8fDA%3D'
    },
    // You can add more reviews here using the remaining images or other Nigerian names
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">What Our Customers Say</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Trusted by thousands of happy customers worldwide
        </p>

        <div className="relative">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                      // Optional: Add an onError fallback in case any of these external links break
                      onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loop
                        // Fallback to ui-avatars.com if the image fails to load
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random&color=fff&size=128`;
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.name}</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-6 flex-grow">
                    <FaQuoteLeft className="text-purple-100 text-4xl absolute -top-2 -left-2" />
                    <p className="text-gray-600 relative z-10 pl-8">{review.comment}</p>
                  </div>

                  <div className="text-sm text-gray-500 mt-auto">{review.date}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;