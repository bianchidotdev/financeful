const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  const result = await graphql(`
    {
      allMdx(
        filter: { fields: { sourceInstanceName: { eq: "blog" } } }
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            categoryLinked {
              name
            }
            title
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.allMdx.nodes
  posts.forEach((post, index) => {
    const postPrev = index === posts.length - 1 ? null : posts[index + 1]
    const postNext = index === 0 ? null : posts[index - 1]

    if (post.frontmatter.categoryLinked === null) {
      console.error(
        `Frontmatter category for post titled "${post.frontmatter.title}" is not included as a name in [blog-categories.yaml].`
      )
    }

    createPage({
      path: post.fields.slug,
      component: blogPost,
      context: {
        slug: post.fields.slug,
        postPrev,
        postNext
      }
    })
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      category: String
      categoryLinked: BlogCategoriesYaml @link(by: "name", from: "category")
      author: AuthorsYaml @link(by: "id")
    }
    `
      // type AuthorsYaml implements Node {
      //   profile_picture: ImageSharp
      // }
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  const name = 'blog'
  if (
    node.internal.type === 'Mdx' &&
    node.parent !== null &&
    getNode(node.parent).sourceInstanceName === name
  ) {
    const relativePath = createFilePath({
      node,
      getNode,
      trailingSlash: false
    })
    createNodeField({
      node,
      name: 'slug',
      value: `/${name}${relativePath}`
    })
    createNodeField({
      node,
      name: 'sourceInstanceName',
      value: name
    })
  }
}
