// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes: prismThemes} = require("prism-react-renderer");
const palettes = require("./src/theme/palettes.json");
const paletteSettings = require("./src/theme/palette-settings.json");

/** @type {() => Promise<import('@docusaurus/types').Config>} */
module.exports = async function () {
    const remarkD2 = (await import("remark-d2")).default;

    return {
        title: "Works in Prod",
        tagline: "Building software that survives production.",
        url: "https://works-in-prod.github.io",
        baseUrl: "/",
        headTags: [
            {
                tagName: "script",
                attributes: {},
                innerHTML: `(() => {
                    const palettes = ${JSON.stringify(palettes)};
                    const settings = ${JSON.stringify(paletteSettings)};
                    let selected = settings.defaultPalette;
                    try {
                        const saved = localStorage.getItem(settings.storageKey);
                        if (Object.hasOwn(palettes, saved)) selected = saved;
                    } catch {}
                    document.documentElement.dataset.palette = selected;
                    document.documentElement.dataset.theme = palettes[selected].scheme;
                })();`,
            },
        ],
        onBrokenLinks: "throw",
        markdown: {
            hooks: {
                onBrokenMarkdownLinks: "warn",
            },
        },
        favicon: "img/favicon.svg",

        organizationName: "works-in-prod",
        projectName: "works-in-prod.github.io",
        trailingSlash: true,
        i18n: {
            defaultLocale: "en",
            locales: ["en"],
        },
        plugins: [
            [
                "@docusaurus/plugin-content-pages",
                {
                    path: "src/pages",
                    routeBasePath: "/",
                },
            ],
            [
                "@docusaurus/plugin-content-blog",
                ({
                    showReadingTime: true,
                    routeBasePath: "/",
                    postsPerPage: 10,
                    blogSidebarCount: 0,
                    remarkPlugins: [remarkD2],
                }),
            ],
        ],
        themes: [
            [
                "@docusaurus/theme-classic",
                {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            ],
        ],

        themeConfig:
            /** @type {import('@docusaurus/types').ThemeConfig} */
            ({
                metadata: [
                    {
                        name: "keywords",
                        content:
                            "AI engineering, architecture, testing, observability, developer experience, software engineering, production lessons, technical leadership",
                    },
                    {
                        name: "title",
                        content: "Works in Prod",
                    },
                    {
                        name: "description",
                        content:
                            "Production lessons on AI engineering, architecture, testing, observability, developer experience, and technical leadership.",
                    },
                    {
                        property: "og:title",
                        content: "Works in Prod",
                    },
                    {
                        property: "og:description",
                        content:
                            "Production lessons on AI engineering, architecture, testing, observability, developer experience, and technical leadership.",
                    },
                    {
                        property: "og:type",
                        content: "website",
                    },
                    {
                        name: "twitter:card",
                        content: "summary",
                    },
                    {
                        name: "twitter:title",
                        content: "Works in Prod",
                    },
                    {
                        name: "twitter:description",
                        content:
                            "Production lessons on AI engineering, architecture, testing, observability, developer experience, and technical leadership.",
                    },
                    {
                        name: "google-site-verification",
                        content: "4wtMRQYF-x9ALzRmResSAiLkmCMznEP-QzhS4rjsewQ",
                    },
                ],
                colorMode: {
                    defaultMode: "light",
                    disableSwitch: false,
                    respectPrefersColorScheme: false,
                },
                navbar: {
                    title: "Works in Prod",
                    items: [],
                },
                footer: {
                    copyright: `© ${new Date().getFullYear()} Danish Javed`,
                },
                prism: {
                    theme: prismThemes.github,
                    darkTheme: prismThemes.dracula,
                },
            }),
    };
};
