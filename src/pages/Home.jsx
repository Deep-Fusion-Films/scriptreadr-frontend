import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className=" text-white h-[60vh] flex flex-col justify-center items-center text-center">
        <div className="text-2xl font-bold mb-4">
          <h1>
            Bring your scripts to life with Deep Fusion Films' ScriptReadr, an
            AI powered script reading
          </h1>
          <p>
            tool that brings voice and character to your scripts, formats and
            polish your scripts like a pro
          </p>
        </div>

        <div className="flex gap-4">
          <Link to='/signin'>
            <button className="bg-[#2E3A87] text-white px-6 py-2 rounded hover:cursor-pointer">
              Get Started
            </button>
          </Link>

          <button className="text-white border border-[#2E3A87] hover:cursor-pointer text-[#2E3A87] px-6 py-2 rounded">
            Watch Demo
          </button>
        </div>
      </section>

      {/* everything you need */}
      <section className="py-12 px-6">
        <h1 className="text-white text-center text-2xl font-bold mb-8">
          Everything you need in one place
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">
              AI Script suggestions
            </h2>
            <p className="text-sm text-gray-600">
              Get real time ideas and fixes to your scripts
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">
              Listen to your scripts
            </h2>
            <p className="text-sm text-gray-600">
              No need to spend hours reading your scripts
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Export and share</h2>
            <p className="text-sm text-gray-600">
              PDF final draft or web links in seconds
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Collaborative Tools</h2>
            <p className="text-sm text-gray-600">
              Invite editors and co-writers easily
            </p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-12 px-6 mb-20">
        <h1 className="text-white text-center text-2xl font-bold mb-8">
          How it works
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Sign Up in seconds</h2>
            <p className="text-sm text-gray-600">
              In order to use this tool you need to be signed in
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">
              Upload your scripts or use a template
            </h2>
            <p className="text-sm text-gray-600">
              Import your already pre-written scripts or use one of the
              templates available to you.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Listen, Write, Edit</h2>
            <p className="text-sm text-gray-600">
              Listen to your script, adjust your script for your desired
              outcome.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded lg:p-15">
            <h2 className="text-lg font-semibold mb-2">Export and Pitch</h2>
            <p className="text-sm text-gray-600">
              Satisfied? export your script and pitch to your stake holders.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
