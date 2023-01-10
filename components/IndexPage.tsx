import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import BlogMeta from 'components/BlogMeta'
import HeroPost from 'components/HeroPost'
import MetaDescription from 'components/MetaDescription'
import MoreStories from 'components/MoreStories'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'

export default function IndexPage(props: {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  settings: Settings
}) {
  const { preview, loading, posts, settings } = props
  const [heroPost, ...morePosts] = posts || []
  const {
    title = demo.title,
    description = demo.description,
    ogImage = {},
  } = settings || {}

  const ogImageTitle = ogImage?.title || demo.ogImageTitle

  return (
    <>
      <Head>
        <title>{title}</title>
        <BlogMeta />
        <MetaDescription value={description} />
        <meta
          property="og:image"
          // Because OG images must have a absolute URL, we use the
          // `VERCEL_URL` environment variable to get the deployment’s URL.
          // More info:
          // https://vercel.com/docs/concepts/projects/environment-variables
          content={`${
            process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
          }/api/og?${new URLSearchParams({ title: ogImageTitle })}`}
        />
      </Head>
      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} description={description} level={1} />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}
