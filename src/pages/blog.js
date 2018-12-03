import React from "react"
import styles from "./blog.module.scss"
import Helmet from 'react-helmet'
import config from '../utils/siteConfig'
import Layout from '../components/Layout'
import Container from '../components/Container'
import CardList from '../components/CardList'
import Card from '../components/Card'

export default ({data, pageContext}) => {
   const posts = data.allContentfulPost.edges 
   
   return (
      <Layout>
         <Helmet>
            <title>{`Blog - ${config.siteTitle}`}</title>
         </Helmet>
      <Container>
            <h1>This is the Blog!</h1>
            <div className={styles.test}>
               <p className={styles.test__child}>CSS Modules are cool</p>
            </div>
            <div className={styles.cardGroup}>
               {posts.map(({ node: post }) => (
                  <div className={styles.card}> {post.title} </div>
               ))}
            </div>
      </Container>
      </Layout>
   )
}

export const query = graphql`
   {
      allContentfulPost(
         sort: { fields: [publishDate], order: DESC }
         limit: 20
      ) {
         edges {
            node {
               title
               id
               slug
               publishDate
            }
         }
      }
   }
`