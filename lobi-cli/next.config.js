/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    ...nextConfig,
    env: {
        API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT
    },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'http://localhost:8080/api/:path*'
    //             // destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/:path*`
    //         }
    //     ]
    // }
}
