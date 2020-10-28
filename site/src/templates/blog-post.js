import PropTypes from 'prop-types'
import { Link as GatsbyLink, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/layout'
import Author from '../components/author'
// import { ArrowLeft, ArrowRight } from 'react-feather'
// import { Box, Container, Divider, Flex, Heading, Text } from 'theme-ui'

function BlogPostTemplate({ data, pageContext }) {
  const post = data.mdx
  const { postPrev, postNext } = pageContext

  return (
    <Layout
      pageSEO={{
        title: post.frontmatter.title,
        description: post.frontmatter.description || post.excerpt
      }}
    >
      {/* <Container
        variant="article"
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      > */}
      <Author />
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <MDXRenderer frontmatter={post.frontmatter}>{post.body}</MDXRenderer>
      </article>
      <nav>
        {postPrev && (
          <GatsbyLink
            to={postPrev.fields.slug}
            // variant="outline"
            // icon={ArrowLeft}
          >
            {postPrev.frontmatter.title}
          </GatsbyLink>
        )}
        {postNext && (
          <GatsbyLink
            to={postNext.fields.slug}
            // icon={ArrowRight}
            // iconPosition="right"
            // sx={{ ...(!postPrev && { ml: 'auto' }) }}
          >
            {postNext.frontmatter.title}
          </GatsbyLink>
        )}
      </nav>
      {/* </Container> */}
    </Layout>
  )
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        description
        title
      }
    }
  }
`
