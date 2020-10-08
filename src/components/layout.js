import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery, Link as GatsbyLink } from 'gatsby'
import GatsbyImage from 'gatsby-image'
import SEO from '../components/seo'
import { Link } from 'evergreen-ui'

function Layout({ pageSEO = {}, children }) {
  const data = useStaticQuery(query)
  const { author, social, navLinks } = data.site.siteMetadata

  return (
    <React.Fragment>
      <SEO {...pageSEO} />
      <header>
        <nav>
          {navLinks.map(({ name, path }) => (
            <GatsbyLink key={name} to={path} partiallyActive={path !== '/'}>
              {name}
            </GatsbyLink>
          ))}
        </nav>
        <GatsbyImage
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
          imgStyle={{
            borderRadius: `50%`,
            minWidth: '50px'
          }}
        />
      </header>
      <main>{children}</main>
      <footer>
        {`© ${new Date().getFullYear()} ${author}`}
        {` `}
        <Link href={social.github}>Github</Link>
      </footer>
    </React.Fragment>
  )
}

Layout.propTypes = {
  pageSEO: PropTypes.object,
  children: PropTypes.node
}

export default Layout

const query = graphql`
  query {
    avatar: file(relativePath: { eq: "profile-pic.jpg" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        navLinks {
          name
          path
        }
        social {
          github
        }
      }
    }
  }
`
