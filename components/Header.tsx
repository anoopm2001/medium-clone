import Link from 'next/link';
import React from 'react';

function Header() {
    return <header className="flex items-center justify-between p-5 max-w-7xl mx-auto whitespace-nowrap ">
        
        <div className="flex items-center space-x-7">
            <div>
            <Link href="/">
           <img className="object-contain w-44 cursor-pointer" src="http://links.papareact.com/yvf"/>
            </Link>  
        </div>
        
        <div className="hidden md:inline-flex md:space-x-5 items-center">
            <h3 className="cursor-pointer">About</h3>
            <h3 className="cursor-pointer">Contact</h3>
            <h3 className="text-white bg-green-600 px-4 py-1 rounded-full cursor-pointer">Follow</h3>
        </div>
        </div>
        
        <div className="flex space-x-5 text-xs md:text-base">
            <h3 className="text-green-600 px-4 py-1 cursor-pointer">Sign In</h3>
            <h3 className="text-green-600 rounded-full border px-4 py-1 cursor-pointer border-green-600 ">Get Started</h3>
        </div>
  </header>;
}

export default Header;
