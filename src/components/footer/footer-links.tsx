import Link from "next/link"

interface FooterLinksProps {
  title: string
  links: { label: string; href: string }[]
}

export default function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <p className="font-semibold mb-2">{title}</p>
      <ul className="space-y-1 text-sm text-blue-600">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
