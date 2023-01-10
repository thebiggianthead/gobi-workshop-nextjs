import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import BlogMeta from 'components/BlogMeta'
import MoreStories from 'components/MoreStories'
import PostBody from 'components/PostBody'
import PostHeader from 'components/PostHeader'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { notFound } from 'next/navigation'

export default function PostPage(props: {
  preview?: boolean
  loading?: boolean
  data: { post: Post; morePosts: Post[] }
  settings: Settings
}) {
  const { preview, loading, data, settings } = props
  const { post = {} as any, morePosts = [] } = data || {}
  const { title = demo.title } = settings || {}

  const slug = post?.slug

  if (!slug && !preview) {
    notFound()
  }

  return (
    <>
      <Head>
        <title>{post.title ? `${post.title} | ${title}` : title}</title>
        <BlogMeta />
        {post.coverImage?.asset?._ref && (
          <meta
            property="og:image"
            content={urlForImage(post.coverImage)
              .width(1200)
              .height(627)
              .fit('crop')
              .url()}
          />
        )}
      </Head>
      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} level={2} />
          {preview && !post ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <article>
                <PostHeader
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  author={post.author}
                />
                <PostBody content={post.content} />
              </article>
              <SectionSeparator />
              {morePosts?.length > 0 && <MoreStories posts={morePosts} />}
            </>
          )}
        </Container>
      </Layout>
    </>
  )
}
