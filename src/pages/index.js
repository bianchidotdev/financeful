import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink, graphql } from 'gatsby'
import Layout from '../components/layout'

function HomePage({ data }) {
  const posts = data.allMdx.nodes

  return (
    <Layout pageSEO={{ title: 'Home' }}>
      {posts.map(post => (
        <GatsbyLink key={post.id} to={post.fields.slug}>
          <h1>{post.frontmatter.title || post.fields.slug}</h1>
          <p>{post.frontmatter.date}</p>
          <p>{post.frontmatter.description || post.excerpt}</p>
        </GatsbyLink>
      ))}
    </Layout>
  )
}

HomePage.propTypes = {
  data: PropTypes.object
}

export default HomePage

export const pageQuery = graphql`
  query {
    allMdx(
      filter: { fields: { sourceInstanceName: { eq: "blog" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          categoryLinked {
            icon
            color
          }
          date(formatString: "MMMM DD, YYYY")
          description
          title
        }
      }
    }
  }
`
