const remoteHost = process.env.REMOTE_HOST;

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${remoteHost}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${remoteHost}/uploads/:path*`,
      },
    ]
  },
}
