/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://anahigobbi.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/admin/*",
    "/api/*",
    "/entrar",
    "/registro",
    "/recuperar-contrasena",
    "/carrito",
    "/mis-cursos",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
};
