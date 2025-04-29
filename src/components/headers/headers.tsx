"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, User, Menu, X } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 
      w-full border-b 
      bg-background/90 
      backdrop-blur mb-4 px-4 
      md:px-8 lg:px-12 
      dark:bg-black dark:text-white"
    >
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-black dark:text-white"
        >
          electro<span className="text-primary">.</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8 max-w-xl">
          <Input
            type="text"
            placeholder="Bạn tìm gì..."
            className="bg-gray-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Menu Icon for Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      )}

      {/* Navigation for Desktop */}
      <div className="border-t hidden md:flex items-center">
        <div className="container flex items-center gap-6 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <span className="text-lg">☰</span> Danh mục sản phẩm
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700">
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary">📱</span>
                  <span>Điện thoại</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary">💻</span>
                  <span>Laptop</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1 border-t dark:border-gray-700" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary">🎧</span>
                  <span>Phụ kiện</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary">🖥️</span>
                  <span>Màn hình</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button variant="default" className="gap-2">
            <span className="text-lg">☰</span> Danh mục sản phẩm
          </Button> */}
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Sản phẩm mới
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Sản phẩm xu hướng
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Khuyến mại
            </Link>
            <span className="bg-pink-500 text-white text-xs font-bold rounded px-1">
              HOT
            </span>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Miễn phí giao hàng cho đơn hàng trên 1 triệu đồng
          </div>
        </div>
      </div>
    </header>
  )
}
