const userNavLinks = [
  { active: false, link: '/me', label: 'ME', mobile: true, enabled: true },
  { active: false, link: '/upcoming-races', label: 'RACES', mobile: true, enabled: true },
  { active: false, link: '/recent-races', label: 'RESULTS', mobile: true, enabled: true },
  { active: false, link: '/news-feed', label: 'NEWS', mobile: true, enabled: true },
  { active: false, link: '/about-us', label: 'ABOUT US', mobile: false, enabled: true },
  { active: false, link: '/logout', label: 'LOGOUT', mobile: false, enabled: true },
  { active: false, link: '/careers', label: 'CAREERS', mobile: false, enabled: false }
];

const guestNavLinks = [
  { active: false, link: '/login', label: 'LOGIN', mobile: true, enabled: true },
  { active: false, link: '/upcoming-races', label: 'RACES', mobile: true, enabled: true },
  { active: false, link: '/recent-races', label: 'RESULTS', mobile: true, enabled: true },
  { active: false, link: '/news-feed', label: 'NEWS', mobile: true, enabled: true },
  { active: false, link: '/about-us', label: 'ABOUT US', mobile: false, enabled: true },
  { active: false, link: '/careers', label: 'CAREERS', mobile: false, enabled: false }
];

export const UserNavLinks = userNavLinks;
export const GuestNavLinks = guestNavLinks;