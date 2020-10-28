import PropTypes from 'prop-types'
import { graphql, useStaticQuery, Link as GatsbyLink } from 'gatsby'
import SEO from '../components/seo'
import { Link } from 'evergreen-ui'

function Layout({ pageSEO = {}, children }) {
  const data = useStaticQuery(query)
  const { author, social, navLinks } = data.site.siteMetadata

  return (
    <>
      <SEO {...pageSEO} />
      <header>
        <nav>
          {navLinks.map(({ name, path }) => (
            <GatsbyLink key={name} to={path} partiallyActive={path !== '/'}>
              {name}
            </GatsbyLink>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        {`© ${new Date().getFullYear()} ${author}`}
        {` `}
        <Link href={social.github}>Github</Link>
      </footer>
    </>
  )
}

Layout.propTypes = {
  pageSEO: PropTypes.object,
  children: PropTypes.node
}

export default Layout

const query = graphql`
  query {
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
