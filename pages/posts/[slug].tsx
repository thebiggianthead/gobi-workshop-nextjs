import PostPage from 'components/PostPage'
import PreviewPostPage from 'components/PreviewPostPage'
import { PreviewSuspense } from 'components/PreviewSuspense'
import {
  getAllPostsSlugs,
  getPostAndMoreStories,
  getSettings,
} from 'lib/sanity.client'
import type { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

export async function generateStaticParams() {
  return await getAllPostsSlugs()
}

export const getStaticPaths = async () => {
  const data = await getAllPostsSlugs()

  return { paths: data?.map((d) => `/posts/${d.slug}`) || [], fallback: false }
}

interface PageProps {
  data: {
    post: Post
    morePosts: Post[]
    settings: Settings
  }
  preview: boolean
  slug: string | null
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { params = {}, preview = false, previewData = {} } = ctx

  if (preview && previewData.token) {
    return {
      props: {
        data: null,
        preview,
        slug: params?.slug || null,
        token: previewData.token,
      },
    }
  }

  const [settings, posts] = await Promise.all([
    getSettings(),
    getPostAndMoreStories(params.slug),
  ])

  return {
    props: {
      data: { settings, ...posts },
      preview,
      slug: params?.slug || null,
      token: null,
    },
    revalidate: 60, // In seconds
  }
}

export default function SlugRoute(props: PageProps) {
  console.log('props', props)

  const { data, preview, token, slug } = props
  const [settings, post, morePosts] = data
    ? [data.settings, data.post, data.morePosts]
    : []

  if (preview) {
    return (
      <PreviewSuspense
        fallback={<PostPage loading preview data={data} settings={settings} />}
      >
        <PreviewPostPage token={token} slug={slug} />
      </PreviewSuspense>
    )
  }

  return <PostPage data={data} settings={settings} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
