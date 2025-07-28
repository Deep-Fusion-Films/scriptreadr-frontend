import { useState } from "react";
import { Link } from "react-router-dom";
import { useToken } from "../store/AuthContext";
import { SlMenu } from "react-icons/sl";
import LogOutButton from "./LogOutButton";

import { RiAccountCircleLine } from "react-icons/ri";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const { token } = useToken();

  const handleOpenMenu = () => {
    if (openProfile) {
      setOpenProfile(false);
    }
    setIsOpen(!isOpen);
  };

  const handleOpenProfile = () => {
    if (isOpen) {
      setIsOpen(false);
    }

    setOpenProfile(!openProfile);
  };

  return (
    <>
      <nav className="relative flex flex-row items-center py-4 bg-[#2E3A87]">
        {/* logo */}
        <div className="text-xl  text-white font-bold ml-auto mr-10 lg:ml-10">
          ScriptReadr
        </div>

        {/* profile icon, show only on small screen sizes and only if there is a token */}
        {token && (
          <div onClick={handleOpenProfile} className=" mr-10 lg:hidden hover:cursor-pointer">
            <RiAccountCircleLine className="text-white text-3xl" />
          </div>
        )}

        {/* hamburger menu button only show on sm-md screen sizes */}
        <button
          onClick={handleOpenMenu}
          className="lg:hidden text-white absolute mr-auto ml-10 hover:cursor-pointer"
        >
          <SlMenu className="text-2xl" />
        </button>

        {/* desktop nav items, hide on sm-md screen sizes */}
        <ul className="hidden lg:flex gap-10 absolute left-1/2 -translate-x-1/2  text-white">
          <li className="hover:underline decoration-2 decoration-offset-2">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:underline decoration-2 decoration-offset-2">
            <Link to="about">About</Link>
          </li>
          <li className="hover:underline decoration-2 decoration-offset-2">
            <Link to="pricing">Pricing</Link>
          </li>
          <li className="hover:underline decoration-2 decoration-offset-2">
            <Link to="contact">Contact us</Link>
          </li>
        </ul>

        {/* desktop nav buttons */}
        <div className="hidden lg:flex ml-auto ">
          {token && (
            <div className="mr-10 bg-[#5C6BC0] text-white border-[#5C6BC0] py-2 px-4 rounded hover:text-[#083B74]">
              <Link to="/dashboard">Dashboard</Link>
            </div>
          )}
          {token && (
            <div className="mr-10 bg-white py-2 px-4 rounded hover:text-[#083B74]">
              <LogOutButton />
            </div>
          )}
          {!token && (
            <div className="mr-10 bg-white py-2 px-4 rounded hover:text-[#083B74]">
              <Link to="/signin">Login</Link>
            </div>
          )}
          {!token && (
            <div className="mr-10 bg-[#5C6BC0] text-white border-[#5C6BC0] py-2 px-4 rounded hover:text-black">
              <Link to="/signup">SignUp</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className=" absolute text-white pl-10 border z-10 lg:hidden bg-[#2E3A87] border-[#2E3A87]">
          <ul>
            <li
              onClick={handleOpenMenu}
              className="hover:underline decoration-2 mb-3 decoration-offset-2"
            >
              <Link to="/">Home</Link>
            </li>
            <li
              onClick={handleOpenMenu}
              className="hover:underline decoration-2 mb-3 decoration-offset-2"
            >
              <Link to="about">About</Link>
            </li>
            <li
              onClick={handleOpenMenu}
              className="hover:underline decoration-2 mb-3 decoration-offset-2"
            >
              <Link to="pricing">Pricing</Link>
            </li>
            <li
              onClick={handleOpenMenu}
              className="hover:underline decoration-2 mb-3 decoration-offset-2"
            >
              <Link to="contact">Contact us</Link>
            </li>
          </ul>

          {/* mobile nav buttons */}
          <div>
            {token && (
              <div
                onClick={handleOpenMenu}
                className="mr-10 bg-[#5C6BC0] text-white border-[#5C6BC0] py-2 mb-2 px-4 rounded hover:text-[#083B74]"
              >
                <Link to="/dashboard">Dashboard</Link>
              </div>
            )}
            {token && (
              <div
                onClick={handleOpenMenu}
                className="mr-10 text-black bg-white py-2 px-4 rounded hover:text-[#083B74] mb-2"
              >
                <LogOutButton />
              </div>
            )}
            {!token && (
              <div
                onClick={handleOpenMenu}
                className="mr-10 bg-white text-black py-2 px-4 rounded hover:text-[#083B74] mb-2"
              >
                <Link to="/signin">Login</Link>
              </div>
            )}
            {!token && (
              <div
                onClick={handleOpenMenu}
                className="mr-10 bg-[#5C6BC0] text-white border-[#5C6BC0] py-2 mb-2 px-4 rounded hover:text-black"
              >
                <Link to="/signup">SignUp</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* user account profile view on small screens */}

      {openProfile && token && (
        <div className="bg-[#2E3A87] text-white fixed right-0 px-10">
          <Link to="/userprofile" className="block  mb-3">
            Account
          </Link>
          <Link className="block mb-3">Subscription</Link>
          <div className="mb-3">
            Free – <span className="font-semibold text-green-600">Current</span>
          </div>
          <Link to="/pricing" className="block mb-3">
            Get Premium
          </Link>
          <Link to="/pricing" className="block mb-3">
            Get Pro
          </Link>
            <hr className="border-gray-300" />
            <Link
              to="/contact"
              className="block  mb-3"
            >
              Support
            </Link>
            <div className="mb-3">
              <LogOutButton />
            </div>
            
        </div>
      )}
    </>
  );
}
