import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <section className=" text-white h-[60vh] flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeIn" }}
          className="text-2xl font-bold mb-4"
        >
          <h1>
            Bring your scripts to life with Deep Fusion Films' ScriptReadr, an
            AI powered script reading
          </h1>
          <p>
            tool that brings voice and character to your scripts, formats and
            polish your scripts like a pro
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeIn" }}
          className="flex gap-4"
        >
          <Link to="/signin">
            <button className="bg-[#2E3A87] text-white px-6 py-2 rounded hover:cursor-pointer">
              Get Started
            </button>
          </Link>

          <button className="text-white border border-[#2E3A87] hover:cursor-pointer text-[#2E3A87] px-6 py-2 rounded">
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* everything you need */}
      <section className="py-12 px-6">
        <h1 className="text-white text-center text-2xl font-bold mb-8">
          Everything you need in one place.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:px-30">
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">
              Upload any Script Style.
            </h2>
            <p className="text-sm text-gray-600">
              No need to adjust your script to any script style, just upload and
              our AI formatter does the rest.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Assign Voices</h2>
            <p className="text-sm text-gray-600">
              Assign voice to all characters in your script
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Generate Audio</h2>
            <p className="text-sm text-gray-600">
              Generate audio with assigned voices, sit back and listen as you
              script comes to life.
            </p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-12 px-6 mb-20">
        <h1 className="text-white text-center text-2xl font-bold mb-8">
          Easy to Use
        </h1>

        <div className="text-center text-white ">
          <p className="lg:px-130">
            <i>
              "ScriptReadr is designed to be easy to use, in just three steps:
              Upload, select voice or click generate audio to use the default
              voices, and generate audio"
            </i>
          </p>
        </div>

        {/* Video Ad */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div
            className="relative"
            style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              src="https://www.youtube.com/embed/PjJofEuSA78?si=YuUuh5bK-cD0oz6I" 
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
