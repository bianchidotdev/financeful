import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink, graphql } from 'gatsby'
import Layout from '../components/layout'
import { Card, Heading, Pane, Text, majorScale } from 'evergreen-ui'

function HomePage({ data }) {
  const posts = data.allMdx.nodes

  return (
    <Layout pageSEO={{ title: 'Home' }}>
      {posts.map(post => (
        <Pane
          is={GatsbyLink}
          key={post.id}
          to={post.fields.slug}
          textDecoration="none"
        >
          <Card
            background="tealTint"
            elevation={2}
            hoverElevation={3}
            padding={majorScale(2)}
          >
            <Heading is="h1">
              {post.frontmatter.title || post.fields.slug}
            </Heading>
            <Text display="block">{post.frontmatter.date}</Text>
            <Text display="block">
              {post.frontmatter.description || post.excerpt}
            </Text>
          </Card>
        </Pane>
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
