import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

function SEO({ description, lang, meta, title }) {
  const siteTitle = 'Niños en casa';
  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${siteTitle}`}
      meta={[
        {
          name: `description`,
          content: description
        },
        {
          name: `keywords`,
          content:
            'niños, niños en casa, ideas, actividades, actividades con niños, actividades con niños en casa, ideas con niños, juegos, encierro'
        },
        {
          property: `og:title`,
          content: 'Niños en casa - ' + title
        },
        {
          property: `og:description`,
          content: 'Niños en casa - ' + description
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          property: `og:url`,
          content: `https://www.niñosencasa.com`
        },
        {
          property: `og:image`,
          content: `https://www.niñosencasa.com/shareimage.png`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          property: `twitter:description`,
          content: 'Niños en casa - ' + description
        },
        {
          name: `twitter:url`,
          content: `https://www.niñosencasa.com`
        },
        {
          name: `twitter:creator`,
          content: 'Alvaro Leal'
        },
        {
          name: `twitter:title`,
          content: 'Niños en casa - ' + title
        },
        {
          property: `twitter:image`,
          content: `http://www.niñosencasa.com/shareimage.png`
        },
        {
          name: `twitter:description`,
          content: description
        },
        {
          name: `google-site-verification`,
          content: 'IYR0XNr4mod5nSqGRjhZSxJziT5j6z1mWKBzswi_lqE'
        }
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `es`,
  meta: [],
  description: ``
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired
};

export default SEO;
