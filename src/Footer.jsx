import React from "react";
import { Link } from "react-router";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Use the new X logo as required

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Define quick navigation links
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Join as Employee", path: "/join-employee" },
    { name: "Join as HR Manager", path: "/join-hr" },
    { name: "Packages", path: "/#packages" },
    { name: "Features", path: "/#features" },
  ];

  // Define contact details (placeholders)
  const contactDetails = {
    email: "info@assetverse.com",
    phone: "+880-1234567890",
  };

  // Define social media links and icons
  const socialLinks = [
    { icon: <FaXTwitter className="h-5 w-5 fill-current" />, url: "#" },
    { icon: <FaFacebookF className="h-5 w-5 fill-current" />, url: "#" },
    { icon: <FaInstagram className="h-5 w-5 fill-current" />, url: "#" },
    { icon: <FaLinkedinIn className="h-5 w-5 fill-current" />, url: "#" },
  ];

  return (
    // Use bg-base-300 for a slightly darker, professional contrast
    <footer className="footer p-10 bg-base-300 text-base-content border-t border-primary/20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 1. Logo & Copyright Section */}
        <aside className="md:col-span-1">
          {/* Logo with consistent professional styling */}
          <Link to="/" className="text-2xl font-bold text-primary">
            AssetVerse
          </Link>
          <p className="mt-4 text-sm max-w-[250px]">
            The comprehensive digital platform for efficient corporate asset
            management.
          </p>
          <p className="mt-8 text-xs">
            Copyright © {currentYear} - All rights reserved by{" "}
            <span className="font-semibold text-primary">AssetVerse</span>.
          </p>
        </aside>

        {/* 2. Quick Navigation Links */}
        <nav className="md:col-span-1">
          <h6 className="footer-title text-lg text-secondary">Quick Links</h6>
          <div className="flex flex-col space-y-2 mt-2">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="link link-hover text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* 3. Contact Details */}
        <nav className="md:col-span-1">
          <h6 className="footer-title text-lg text-secondary">Contact Us</h6>
          <div className="flex flex-col space-y-2 mt-2">
            <a
              href={`mailto:${contactDetails.email}`}
              className="link link-hover text-sm flex items-center gap-2"
            >
              <FaEnvelope className="text-primary" />
              {contactDetails.email}
            </a>
            <a
              href={`tel:${contactDetails.phone}`}
              className="link link-hover text-sm flex items-center gap-2"
            >
              <FaPhoneAlt className="text-primary" />
              {contactDetails.phone}
            </a>
            <p className="text-xs mt-4 pt-2 border-t border-base-content/10">
              Dhaka, Bangladesh
            </p>
          </div>
        </nav>

        {/* 4. Social Media Links */}
        <nav className="md:col-span-1">
          <h6 className="footer-title text-lg text-secondary">Connect</h6>
          <div className="grid grid-flow-col gap-4 mt-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle text-lg hover:text-primary transition-colors duration-200"
                aria-label="Social Link"
              >
                {social.icon}
              </a>
            ))}
          </div>
          {/* Newsletter/CTA placeholder for future enhancement */}
          <h6 className="footer-title text-lg text-secondary mt-8">
            Stay Updated
          </h6>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-sm">Your Email</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="email@example.com"
                className="input input-bordered w-full pr-16 input-sm"
              />
              <button className="btn btn-primary btn-sm absolute top-0 right-0 rounded-l-none">
                Subscribe
              </button>
            </div>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
