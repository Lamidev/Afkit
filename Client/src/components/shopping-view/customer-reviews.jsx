
import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Tasha Green',
      rating: 5,
      comment: 'Absolutely love my purchase! The quality exceeded my expectations and delivery was super fast. Will definitely shop here again!',
      date: 'March 15, 2024',
    },
    {
      id: 2,
      name: 'James Brown',
      rating: 4,
      comment: 'The product quality is outstanding and it arrived earlier than expected. Will order again.',
      date: 'April 10, 2024',
    },
    {
      id: 3,
      name: 'Angela Morris',
      rating: 5,
      comment: 'This is my second order and I’m just as impressed as the first time. Highly recommended!',
      date: 'March 28, 2024',
    },
    {
      id: 4,
      name: 'Dwayne Carter',
      rating: 5,
      comment: 'Solid customer service and top-notch items. I’ll definitely tell my friends about this store.',
      date: 'February 16, 2024',
    },
    {
      id: 5,
      name: 'Latoya Simmons',
      rating: 4,
      comment: 'Good value for money. Packaging was neat and arrived without any issues. Could improve shipping speed.',
      date: 'January 29, 2024',
    },
    {
      id: 6,
      name: 'Malik Johnson',
      rating: 5,
      comment: 'Excellent experience from start to finish. The product looks even better in person.',
      date: 'March 3, 2024',
    },
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
            autoplay={{ delay: 5000 }}
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
                  <div className="mb-4">
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
