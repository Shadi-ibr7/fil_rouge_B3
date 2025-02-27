import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoIosClose } from "react-icons/io";


function Footer() {
 
  return (
    <footer className="w-full mx-auto bg-black py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-playfair font-light italic mb-4 text-white">Event Ease</h3>
          <p className="text-gray-400">Ease of being together</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <div className="text-center md:text-left mb-3 md:mb-0">
          Copyright © 2024 Event Ease.
        </div>
        <div className="flex flex-col md:flex-row justify-center md:justify-start items-center space-y-2 md:space-y-0 md:space-x-8">
          <Link to="/MentionLegal" className="hover:underline">Mention Légale</Link>
          <Link to="/PolitiqueConfi" className="hover:underline">Politique de confidentialité</Link>
          <Link to="/GestionCookies" className="hover:underline">Gestion des cookies</Link>
        </div>
      </div>
    </footer>

  

    
  );
}

export default Footer;