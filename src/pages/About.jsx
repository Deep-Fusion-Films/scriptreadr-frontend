import { BsInfoCircle } from "react-icons/bs";

export default function About() {
  return (
    <main id="about">
      <section className="py-13 lg:py-20 lg:px-40 px-5 bg-white ">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-50 py-1 px-3 gap-2">
            <BsInfoCircle className="text-2xl text-[#F59E0B]" />
            <p className="text-2xl font-bold text-[#2E3A87]">About</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* col 1 */}
          <div className="flex items-center justify-center">
            <div>
              <img src="/laptop.png"  alt="" className="w-[400px]" />
            </div>
          </div>

          {/* col 2 */}
           <div>
            <div>
          <p className="text-lg pt-8  leading-relaxed text-justify">
            <span className="font-semibold">ScriptReadr</span> is a modern tool
            designed for scriptwriters, producers, and content creators who want
            their scripts read out loud with clarity and character. Whether
            you’re developing a screenplay, a podcast, or a narrative for film
            or TV, ScriptReadr helps you hear your work come to life before
            production even begins.
          </p>

          <p className="text-lg leading-relaxed text-justify">
            With powerful voice integration and a seamless user experience,
            users can upload or generate scripts and instantly have them read
            aloud through natural-sounding speech. It’s built to boost your
            creative process, sharpen your dialogue, and make editing faster and
            more engaging.
          </p>

          <p className="text-lg leading-relaxed text-justify">
            ScriptReadr is trusted by teams and solo creators alike who value
            efficiency, accessibility, and a touch of fun in their workflow.
            Whether you’re on the free plan or going Pro, the focus remains the
            same: helping your script sound as brilliant as it reads.
          </p>
          </div>
        </div>
        </div>

       
      </section>
    </main>
  );
}
