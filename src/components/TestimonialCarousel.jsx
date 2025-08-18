import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  { text: "This service is amazing!", author: "Jane" },
  { text: "Highly recommended.", author: "John" },
  { text: "I love the experience!", author: "Alice" },
];

export default function TestimonialCarousel() {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation // adds arrows
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      spaceBetween={50}
      slidesPerView={1}
    >
      {testimonials.map((t, index) => (
        <SwiperSlide key={index}>
          <div className="">
            <div className="text-center border">
              <p>"{t.text}"</p>
              <p>- {t.author}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
