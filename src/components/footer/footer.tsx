import FooterBottom from "./footer-bottom"
import FooterLinks from "./footer-links"
import FooterLogo from "./footer-logo"

export default function Footer() {
  const customerServiceLinks = [
    { label: "Câu hỏi thường gặp", href: "#" },
    { label: "Hướng dẫn đặt hàng", href: "#" },
    { label: "Phương thức vận chuyển", href: "#" },
    { label: "Chính sách đổi trả", href: "#" },
    { label: "Chính sách thanh toán", href: "#" },
    { label: "Giải quyết khiếu nại", href: "#" },
    { label: "Chính sách bảo mật", href: "#" },
  ]

  const introduceLinks = [
    { label: "Về Công ty", href: "#" },
    { label: "Tuyển dụng", href: "#" },
    { label: "Hợp tác", href: "#" },
    { label: "Liên hệ mua hàng", href: "#" },
  ]
  return (
    <footer
      className="w-full border-t
      bg-background/90 
      backdrop-blur mb-2 px-4 
      md:px-8 lg:px-12 
      dark:bg-black dark:text-white"
    >
      <div className="container py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <FooterLogo />

        {/* Center Section */}
        <FooterLinks title="Hỗ trợ khách hàng" links={customerServiceLinks} />

        {/* Right Section */}
        <FooterLinks title="Giới thiệu" links={introduceLinks} />
      </div>

      {/* Bottom Line */}
      <FooterBottom />
    </footer>
  )
}
