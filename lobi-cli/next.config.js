/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    ...nextConfig,
    env: {
        API_ENDPOINT: "https://lobi-server.capybara.wldspace.com",
    },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             // destination: 'https://lobi-server.capybara.wldspace.com/api/:path*'
    //             destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/:path*`
    //         }
    //     ]
    // }
}
