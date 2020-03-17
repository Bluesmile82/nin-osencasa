module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Niños en casa`,
        short_name: `Niños en casa`,
        start_url: `/ideas`,
        display: `standalone`,
        icon: `src/images/icon.png`
      }
    },
    `gatsby-plugin-offline`
  ]
};