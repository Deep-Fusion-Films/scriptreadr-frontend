import { Link } from "react-router-dom";

import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white px-6 py-12 ">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        {/* Navigation Links */}
        <ul className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 text-sm">
          <li><Link to="/termsofuse">Terms of Use</Link></li>
          <li><Link to="/privacypolicies">Privacy Policies</Link></li>
          <li><Link to="/disclaimer">Disclaimer</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>

        {/* Social Media Icons */}
        <div className="flex gap-4 text-xl">
          <a href="#" aria-label="Facebook" className="hover:text-blue-400"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-300"><FaTwitter /></a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-400"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}
