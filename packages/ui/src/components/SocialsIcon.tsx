import { Instagram, Send, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const SocialsIcon = () => {
  return (
    <ul className="flex gap-3 items-center text-gray-400">
      {socials.map((social) => (
        <li key={social.href}>
          <Link href={social.href}>{social.icon}</Link>
        </li>
      ))}
    </ul>
  );
};

const socials = [
  {
    href: "https://instagram.com/igraphical.ir",
    icon: <Instagram size={20} />,
  },
  { href: "https://youtube.com/c/@igraphical", icon: <Youtube size={23} /> },
  { href: "https://t.me/igraphical", icon: <Send size={20} /> },
];

export default SocialsIcon;
