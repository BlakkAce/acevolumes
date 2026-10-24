// The founder page's single source of truth. Swap these and everything
// (page, footer link, structured data, schema.org founder) follows.
export const FOUNDER = {
  name: "David Olawuni",
  role: "Founder, AceVolumes",
  photo: "/img/founder.jpg",
  photoAlt: "Portrait of David Olawuni, founder of AceVolumes",
  location: "Lagos, Nigeria",
  links: [
    { label: "LinkedIn", href: "https://ng.linkedin.com/in/david-olawuni" },
    { label: "Instagram · @acevolumes", href: "https://www.instagram.com/acevolumes/" },
    { label: "Facebook", href: "https://web.facebook.com/acevolumesceo" },
    { label: "AceVolumes on LinkedIn", href: "https://www.linkedin.com/company/acevolumes" },
  ] as { label: string; href: string }[],
};
