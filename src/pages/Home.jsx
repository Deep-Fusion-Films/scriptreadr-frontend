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
          className="text-xl lg:text-2xl"
        >
          <h1 className="lg:px-50 px-5">
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
            <button className="bg-[#2E3A87] mt-8 text-white px-6 py-2 rounded hover:cursor-pointer">
              Get Started
            </button>
          </Link>

          {/* <button className="text-white border border-[#2E3A87] hover:cursor-pointer text-[#2E3A87] px-6 py-2 rounded">
            Watch Demo
          </button> */}
        </motion.div>
      </section>

      {/* everything you need */}
      <section className="py-12 px-6">
        <h1 className="text-white text-center text-xl lg:text-2xl mb-8">
          Everything you need in one place.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:px-30">
          <div className="border-t-3 border-l-3  text-white shadow-2xl p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">
              Upload any Script Style.
            </h2>
            <p className="text-sm text-white">
              No need to adjust your script to any script style, just upload and
              our AI formatter does the rest.
            </p>
          </div>

          <div className="border-r-3 border-l-3 text-white shadow-2xl p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Assign Voices</h2>
            <p className="text-sm text-white">
              Assign voice to all characters in your script
            </p>
          </div>
          <div className="border-t-3 border-r-3 text-white  shadow-2xl p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Generate Audio</h2>
            <p className="text-sm text-white">
              Generate audio with assigned voices, sit back and listen as your
              script comes to life.
            </p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-12 px-6 mb-20">
        <div>
          <h1 className="text-white text-center text-xl lg:text-2xl mb-8">
            Easy to Use
          </h1>

          <div className="text-center text-white ">
            <p className="lg:px-100">
              <i>
                "ScriptReadr is designed to be easy to use, in just three steps:
                Upload, select voice or click generate audio to use the default
                voices, and generate audio"
              </i>
            </p>
          </div>
        </div>

        {/* Video Ad */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div
            className="relative"
            style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              src="https://www.youtube.com/embed/V"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="py-12">
          <h1 className="text-white text-center text-xl lg:text-2xl mb-8">
            How you can use Script Readr
          </h1>

          <div className="text-center text-white ">
            <p className="lg:px-100">
              <i>
               Whether you're prepping for an audition, creating a voice-over-reel,
               animation your screenplay, or just want to hear your words out loud,
               Script Readr gives your script a voice. Upload your script, assign voices,
               and let the characters come alive.
              </i>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
