import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PkgForge',
  description: 'Portable Linux Packages & Static Binaries',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]
  ],

  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'AnyLinux AppImages', link: '/formats/appimage#anylinux-appimages' },
      {
        text: 'Guide',
        items: [
          { text: 'SBUILD', link: '/sbuild/' },
          { text: 'Package Formats', link: '/formats/' },
          { text: 'Creating Packages', link: '/contributing/creating-packages' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'SBUILD Specification', link: '/sbuild/specification' },
          { text: 'SBUILD Instructions', link: '/sbuild/instructions' },
          { text: 'Examples', link: '/sbuild/examples' },
          { text: 'Metadata', link: '/repositories/metadata' },
        ]
      },
      { text: 'Repositories', link: '/repositories/' },
      { text: 'Soar', link: 'https://soar.qaidvoid.dev' },
    ],

    sidebar: {
      '/sbuild/': [
        {
          text: 'SBUILD',
          items: [
            { text: 'Overview', link: '/sbuild/' },
            { text: 'Specification', link: '/sbuild/specification' },
            { text: 'Instructions', link: '/sbuild/instructions' },
            { text: 'Examples', link: '/sbuild/examples' },
            { text: 'Linting', link: '/sbuild/linting' },
          ]
        }
      ],
      '/formats/': [
        {
          text: 'Package Formats',
          items: [
            { text: 'Overview', link: '/formats/' },
            { text: 'AppImage', link: '/formats/appimage' },
            { text: 'AppBundle', link: '/formats/appbundle' },
            { text: 'FlatImage', link: '/formats/flatimage' },
            { text: 'RunImage', link: '/formats/runimage' },
            { text: 'NixAppImage', link: '/formats/nixappimage' },
            { text: 'Archive', link: '/formats/archive' },
            { text: 'Static', link: '/formats/static' },
            { text: 'Dynamic', link: '/formats/dynamic' },
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: 'Troubleshooting',
          items: [
            { text: 'Overview', link: '/troubleshooting/' },
            { text: 'FUSE', link: '/troubleshooting/fuse' },
            { text: 'Fonts', link: '/troubleshooting/fonts' },
            { text: 'Namespaces', link: '/troubleshooting/namespaces' },
          ]
        }
      ],
      '/repositories/': [
        {
          text: 'Repositories',
          items: [
            { text: 'Overview', link: '/repositories/' },
            { text: 'soarpkgs', link: '/repositories/soarpkgs' },
            { text: 'Metadata', link: '/repositories/metadata' },
            { text: 'Custom Repositories', link: '/repositories/custom-repos' },
          ]
        }
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'Overview', link: '/contributing/' },
            { text: 'Creating Packages', link: '/contributing/creating-packages' },
            { text: 'Package Request', link: '/contributing/package-request' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pkgforge' },
      { icon: 'discord', link: 'https://discord.gg/djJUs48Zbu' },
    ],

    editLink: {
      pattern: 'https://github.com/pkgforge/pkgforge-docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright &copy; PkgForge'
    }
  }
})
