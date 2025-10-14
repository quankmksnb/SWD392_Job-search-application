"use client";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="">
      <nav className="border-b border-[#e5e5e5] flex justify-center px-[24px]">
        <div className="container flex justify-between items-center h-[32px] ">
          <ul className="flex gap-[8px]">
            <li className="nav-link">
              Hi (
              <Link href={"/login"} className="text-[#0968f6] font-medium underline">
                Sign-in
              </Link>
              )
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                Daily Deals
              </Link>
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                Brand Outlet
              </Link>
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                Gift Cards
              </Link>
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                Help & Contact
              </Link>{" "}
            </li>
          </ul>
          <ul className="flex items-center gap-[12px]">
            <li>
              <Link className="nav-link" href={"/"}>
                Ship to
              </Link>
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                Sell
              </Link>
            </li>
            <li>
              <Link className="nav-link flex items-center gap-[4px]" href={"/"}>
                Watchlist
                <Image
                  src={"/icons/chevron_down.svg"}
                  width={12}
                  height={12}
                  alt=""
                />
              </Link>
            </li>
            <li>
              <Link className="nav-link flex items-center gap-[4px]" href={"/"}>
                My eBay
                <Image
                  src={"/icons/chevron_down.svg"}
                  width={12}
                  height={12}
                  alt=""
                />
              </Link>
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                <Image src={"/icons/bell.svg"} width={20} height={20} alt="" />
              </Link>
            </li>
            <li>
              <Link className="nav-link" href={"/"}>
                <Image src={"/icons/cart.svg"} width={20} height={20} alt="" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="border-b border-[#e5e5e5] flex justify-center py-[20px] px-[24px]">
        <div className="container flex items-center gap-[20px]">
          <div className="flex items-center gap-[16px]">
            <Link href={"/"}>
              <Image
                src={"/images/EBay_logo.svg.png"}
                alt="Ebay logo"
                width={117}
                height={48}
              />
            </Link>
            <div className="flex">
              <span className="text-[#707070] text-[12px]/[14px] font-semibold line w-[70px]">
                Shop by category
              </span>
              <Image
                src={"/icons/chevron_down.svg"}
                width={12}
                height={12}
                alt=""
              />
            </div>
          </div>
          <form className="flex w-full items-center gap-[16px]">
            <div className="w-full flex items-center border-[2px] border-[#191919] rounded-full h-[44px] overflow-hidden">
              <div className="pl-4">
                <Image
                  src={"/icons/search.svg"}
                  width={16}
                  height={16}
                  alt=""
                />
              </div>

              <input
                type="text"
                placeholder="Search for anything"
                className="flex-1 px-3 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="form_btn flex items-center gap-[8px]">
              <Button>Search</Button>
              <Link
                href={"/"}
                className="text-[#707070] text-[11px] font-semibold"
              >
                Advanced
              </Link>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
