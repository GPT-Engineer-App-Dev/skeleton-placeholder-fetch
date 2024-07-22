import React from 'react';
import { Package2, Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center mb-4 md:mb-0">
            <Package2 className="h-8 w-8 mr-2" />
            <div>
              <h2 className="text-lg font-semibold">Acme Inc</h2>
              <p className="text-sm text-muted-foreground">Your trusted news source</p>
            </div>
          </div>

          {/* Center Section */}
          <nav className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            <NavLink to="/" className="hover:underline">Home</NavLink>
            <NavLink to="/about" className="hover:underline">About</NavLink>
            <NavLink to="/contact" className="hover:underline">Contact</NavLink>
            <NavLink to="/privacy" className="hover:underline">Privacy Policy</NavLink>
          </nav>

          {/* Right Section */}
          <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <Button variant="outline" size="sm" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4 mr-2" /> Back to top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;