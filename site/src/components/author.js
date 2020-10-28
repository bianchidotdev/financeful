import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import GatsbyImage from 'gatsby-image'
import { Card, Text, majorScale } from 'evergreen-ui'

function Author() {
  const data = useStaticQuery(query)
  const { fullName, fullBio, profilePicture } = data.mdx.frontmatter.author

  return (
    <Card
      background="tealTint"
      padding={majorScale(1)}
      marginY={majorScale(1)}
      border="default"
    >
      <GatsbyImage
        fixed={profilePicture.childImageSharp.fixed}
        alt={fullName}
        imgStyle={{
          borderRadius: '50%'
        }}
      />
      <Text>{fullName}</Text>
      <Text display="block">{fullBio}</Text>
    </Card>
  )
}

Author.propTypes = {
  data: PropTypes.object
}

export default Author

const query = graphql`
  query {
    mdx {
      frontmatter {
        author {
          fullName
          fullBio
          profilePicture {
            childImageSharp {
              fixed(width: 50, height: 50) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`
