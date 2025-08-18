import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Free Your Mind",
  tagline: "tagline",
  favicon: "img/chick-favicon.svg",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://blog.yufelicis.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "WenYHsieh", // Usually your GitHub org/user name.
  projectName: "wenyhsieh.github.io", // Usually your repo name.
  trailingSlash: false,
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  // i18n: {
  //   defaultLocale: "zh-TW",
  //   locales: ["zh-TW", "en"],
  //   localeConfigs: {
  //     "zh-TW": {
  //       label: "中文",
  //     },
  //     en: {
  //       label: "English",
  //     },
  //   },
  // },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "ignore",
          routeBasePath: "/", // Make blog the index page
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "projects",
        path: "projects",
        routeBasePath: "projects",
        showReadingTime: true,
        feedOptions: {
          type: ["rss", "atom"],
          xslt: true,
        },
      },
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Free Your Mind",
      logo: {
        alt: "Free Your Mind Logo",
        src: "img/chick-favicon.svg",
      },
      items: [
        { to: "/", label: "Blog", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "notesSidebar",
          position: "left",
          label: "Notes",
        },
        {
          to: "/projects",
          label: "Projects",
          position: "left",
        },
        {
          href: "https://github.com/WenYHsieh",
          label: "GitHub",
          position: "right",
        },
        // {
        //   type: "localeDropdown",
        //   position: "right",
        // },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    footer: {
      style: "light",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Free Your Mind.`,
    },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
