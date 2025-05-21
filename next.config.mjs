import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,

  // redirects: async () => {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/jp/setting',
  //       permanent: true,
  //       locale: false
  //     },
  //     {
  //       source: '/:lang(en|jp)',
  //       destination: '/:lang/setting',
  //       permanent: true,
  //       locale: false
  //     }
  //   ]
  // },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  }
}

export default withNextIntl(nextConfig)
