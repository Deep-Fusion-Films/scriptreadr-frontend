import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function TestimonialCarousel() {
  const listItems = [
    { name: "John Doe", comments: "This is a very good scriptreading tool" },
    { name: "Sarah Doe ", comments: "It's amazing, and it's better than most" },
    { name: "Charles Doe", comments: "It's very easy to use and work with" },
    { name: "Moses Doe", comments: "It's my go to scriptreading software" },
  ];

  const [currentIndex, setcurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");

  function handlePreviousSlide() {
    setDirection("left");
    setcurrentIndex((prev) => {
      return prev === 0 ? listItems.length - 1 : prev - 1;
    });
  }

  function handleNextSlide() {
    setDirection("right");
    setcurrentIndex((next) => {
      return next === listItems.length - 1 ? 0 : next + 1;
    });
  }

  //variants for motion
  const variants = {
    enter: (dir) => ({
      x: dir === "right" ? 100 : -100, // 👈 slide in from right or left
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir === "right" ? -100 : 100, // 👈 exit opposite direction
      opacity: 0,
    }),
  };

  return (
    <>
      <section className="px-6 py-12">
        <h1 className="text-white text-center text-xl lg:text-2xl mb-8">
          Testimonials
        </h1>
        <div className="flex items-center justify-center">
          <div className="flex gap-[50px] lg:gap-[250px]">
            <div className="flex items-center">
              <IoIosArrowBack
                className="text-4xl text-white hover:cursor-pointer"
                onClick={handlePreviousSlide}
              />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex} // 👈 ensures animation triggers when index changes
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <div className="border-x-3 rounded-4xl border-white p-1 lg:p-6 lg:p-15">
                  <p className="text-white mb-4">
                    <i>{listItems[currentIndex].name}</i>
                  </p>
                  <p className="text-white ml-4">
                    {listItems[currentIndex].comments}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-end items-center">
              <IoIosArrowForward
                className="text-4xl text-white hover:cursor-pointer"
                onClick={handleNextSlide}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {listItems.map((_, index) => {
            return (
              <button
                key={index}
                onClick={() => setcurrentIndex(index)}
                className={`h-3 w-3 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-gray-500"
                }`}
              ></button>
            );
          })}
        </div>
      </section>
    </>
  );
}
