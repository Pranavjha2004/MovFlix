import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for Hamburger Menu
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const NavBar = ({navText1,navText2,navText3,navText4}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white">
      <div className="flex items-center justify-between px-6 md:px-24 py-4">
        {/* Logo */}
        <Link to={"/"}><h1 className="logo text-2xl md:text-5xl font-bold cursor-pointer">
          MovFlix
        </h1></Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 text-lg cursor-pointer">
          <li className="hover:text-orange-400"><ScrollLink offset={-200} to="search" smooth={true} duration={500}>{navText2}</ScrollLink></li>
          <li className="hover:text-orange-400"><ScrollLink offset={0} to={navText1} smooth={true} duration={500}>{navText1}</ScrollLink></li>
          <li className="hover:text-orange-400"><ScrollLink offset={0} to="featured" smooth={true} duration={500}>{navText3}</ScrollLink></li>
          <Link to={"/"}><li className="hover:text-orange-400">{navText4}</li></Link>
        </ul>

        {/* Hamburger Menu (for Mobile) */}
        <button
          className="md:hidden text-white focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div
        className={`md:hidden bg-gray-900 absolute top-16 left-0 w-full transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-[200%]"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-4">
        <li className="hover:text-orange-400"><ScrollLink offset={-200} to="search" smooth={true} duration={500}>{navText2}</ScrollLink></li>
          <li className="hover:text-orange-400"><ScrollLink offset={0} to={navText1} smooth={true} duration={500}>{navText1}</ScrollLink></li>
          <li className="hover:text-orange-400"><ScrollLink offset={0} to="featured" smooth={true} duration={500}>{navText3}</ScrollLink></li>
          <Link to={"/"}><li className="hover:text-orange-400">{navText4}</li></Link>
        </ul>
      </div>

      {/* Orange Bottom Line */}
      <div className="bg-orange-600 h-[0.15rem] mx-6 md:mx-24"></div>
    </nav>
  );
};

export default NavBar;
