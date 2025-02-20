"use client"

import React from "react"
import { MdShoppingCart } from "react-icons/md"
import { useState } from "react"
import { Menubar } from "./Menubar"
import { RxHamburgerMenu } from "react-icons/rx"
import SideMenu from "./SideMenu/SideMenu"
import { fonts } from "@/components/ui/font"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IoChevronDown } from "react-icons/io5"
import Link from "next/link"
import SearchBar from "./Search"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const [isMenuOpen, setisMenuOpen] = useState(false)

  const handleToggle = () => {
    setisMenuOpen(!isMenuOpen)
  }

  const pathname = usePathname();

  return (
    <header className="bg-[#37bfb1] sticky top-0 z-50">
      <div className="flex flex-row py-3 px-8 items-center justify-between">
        {/* Logo */}
        <div className="flex gap-3 items-center">
          <RxHamburgerMenu size={25} className="lg:hidden block text-white" onClick={handleToggle} />
          {isMenuOpen &&         <SideMenu onclose={() => setisMenuOpen(false)} />}

          <Link href={"/"}>
            <h1 className="text-white text-[18px] lg:text-xl font-bold">TT</h1>
          </Link>
        </div>
        {/* Search bar */}
        <div className="lg:block hidden w-[65%] lg:w-[70%]">
          <SearchBar />
        </div>

{/* Auth buttons + Cart */}
        <div className="flex items-center gap-0 md:gap-2">
          {/* <button className="text-white sm:block transition hidden hover:scale-110">
            <MdShoppingCart size={25} />
          </button> */}

          <div className="flex gap-1">
      <Link href="/signin">
        <button
          className={`
            text-sm px-5 text-white ${fonts.montserrat} py-2 rounded-md transition-all
            ${pathname === '/signin' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-transparent hover:bg-[#081023CC]'
            } 
            hover:scale-105
          `}
        >
          Sign in
        </button>
      </Link>
      <Link href="/signup">
        <button
          className={`
            text-sm text-white ${fonts.montserrat} px-5 py-2 rounded-md transition-all
            ${pathname === '/signup'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-transparent hover:bg-[#081023CC]'
            }
            hover:scale-105
          `}
        >
          Sign up
        </button>
      </Link>
    </div>
        </div>
      </div>
      {/* Menu bar */}
      <Menubar />

      {/* Mobile */}
      <div className="lg:hidden flex px-2">
        <div className=" w-full mx-2 my-2">
          <SearchBar />
        </div>
        {/* suppliers content */}
        <div className="md:block hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex ${fonts.montserrat} items-center gap-1 text-white px-3 py-2 focus:outline-none text-sm`}
              >
                Knowde for Suppliers
                <IoChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1B2637] border-gray-700">
              <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
                Supplier Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar

