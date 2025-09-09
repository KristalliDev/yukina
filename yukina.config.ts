import I18nKeys from "./src/locales/keys";
import type { Configuration } from "./src/types/config";

const YukinaConfig: Configuration = {
  title: "Hello",
  subTitle: "I am Bibhuti",
  brandTitle: "Home",

  description: "Test",

  site: "https://bibhutiupadhyay.vercel.app",

  locale: "en", // set for website language and date format

  navigators: [
    {
      nameKey: I18nKeys.nav_bar_archive,
      href: "/archive",
    },
    {
      nameKey: I18nKeys.nav_bar_about,
      href: "/about",
    },
  ],

  username: "Bibhuti Upadhyay",
  sign: "<3",
  avatarUrl: "https://i.imgur.com/lRzMHXI.gif",
  socialLinks: [
    {
      icon: "mingcute:instagram-line",
      link: "https:/rickroll.com",
    },
  ],
  maxSidebarCategoryChip: 6, // It is recommended to set it to a common multiple of 2 and 3
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  slugMode: "HASH", // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  banners: [
    "https://i.imgur.com/lRzMHXI.gif"
  ],
  bannerStyle: "LOOP"
};

export default YukinaConfig;
