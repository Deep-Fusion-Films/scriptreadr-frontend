import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { VscSettings } from "react-icons/vsc";
import { MdOutlineCloudUpload } from "react-icons/md";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { RiSpeakLine } from "react-icons/ri";




//components
import TestimonialCarousel from "../components/TestimonialCarousel";
import About from "./About";
import Pricing from "./Pricing";

export default function Home() {
  return (
    <>
      <main>
        <section className="lg:px-40 text-white px-5 h-[70vh] flex flex-col justify-center items-center text-center bg-[#0F172A]">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeIn" }}
            className="text-xl lg:text-2xl"
          >
            <h1 className="">
              Bring your scripts to life with Deep Fusion Films' ScriptReadr, an
              AI powered script reading tool that brings voice and character to
              your scripts.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeIn" }}
          >
            <Link to="/signin">
              <button className="bg-[#2E3A87] mt-8 text-[#F59E0B] px-6 py-2 rounded hover:cursor-pointer">
                Get Started
              </button>
            </Link>

            {/* <button className="text-white border border-[#2E3A87] hover:cursor-pointer text-[#2E3A87] px-6 py-2 rounded">
            Watch Demo
          </button> */}
          </motion.div>
        </section>

        {/* Aboout Section */}
        <About />

        {/* everything you need */}
        <section className="py-13 lg:py-20 lg:px-40 px-5 ">
          <div className="border bg-[#1E293B] px-5 lg:px-20 pb-16 rounded-2xl">

        
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-50 py-1 px-3 gap-2">
             <VscSettings  className="text-2xl text-[#F59E0B]" />
              <p className="text-2xl font-bold text-white">Features</p>
            </div>
          </div>
          <h1 className=" text-center font-bold text-xl text-white pt-8 lg:text-2xl">
            Everything you need in one place.
          </h1>

          <div className="grid grid-cols-1 pt-8 lg:grid-cols-3 gap-6">
            <div className="border bg-white shadow-lg p-6 rounded-2xl lg:p-10">
              <MdOutlineCloudUpload className="text-4xl text-[#F59E0B]"/>

              <h2 className="text-lg font-semibold mb-2">
                Upload any Script Style.
              </h2>
              <p className="text-sm">
                No need to adjust your script to any script style, just upload
                and our AI formatter does the rest.
              </p>
            </div>

            <div className="border bg-white shadow-lg p-6 rounded-2xl lg:p-10">
              <RiSpeakLine className="text-4xl text-[#F59E0B]" />

              <h2 className="text-lg font-semibold mb-2">Assign Voices</h2>
              <p className="text-sm">
                Assign voices to all characters in your script. Gender-based voice assigment auto assigns voices to your script characters based on their description.
              </p>
            </div>
            <div className="border bg-white shadow-lg p-6 rounded-2xl lg:p-10">
              <HiOutlineSpeakerWave className="text-4xl text-[#F59E0B]" />
              <h2 className="text-lg font-semibold mb-2">Generate Audio</h2>
              <p className="text-sm">
                Generate audio with assigned voices, sit back and listen as your
                script come to life.
              </p>
            </div>
          </div>
          </div>
        </section>

        {/* pricing section */}
        <Pricing />
      </main>
    </>
  );
}
