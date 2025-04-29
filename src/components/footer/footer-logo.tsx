import { Facebook, Headphones, Instagram, Music, Youtube } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function FooterLogo() {
  return (
    <div className="space-y-4">
      <Link href="/" className="text-2xl font-bold text-black">
        HuyNguyenRider<span className="text-primary">.</span>
      </Link>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Headphones className="w-6 h-6" />
        <div>
          <p className="font-semibold">Tổng đài hỗ trợ</p>
          <p>0335208171</p>
        </div>
      </div>
      <div className="text-sm">
        <p className="font-semibold">Địa chỉ liên hệ</p>
        <p>127/C16, Ni Sư Huỳnh Liên, phường 10, quận Tân Bình, TP.HCM</p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 border rounded-xl hover:bg-gray-300"
        >
          <Facebook className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 border rounded-xl hover:bg-gray-300"
        >
          <Youtube className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 border rounded-xl hover:bg-gray-300"
        >
          <Instagram className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 border rounded-xl hover:bg-gray-300"
        >
          <Music className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
