import IndexPage from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewIndexPage'
import { PreviewSuspense } from 'components/PreviewSuspense'
import { getAllPosts, getSettings } from 'lib/sanity.client'
import type { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

interface PageProps {
  data: {
    posts: Post[]
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
  const { preview = false, previewData = {} } = ctx

  const params = { slug: 'home' }

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

  const [settings, posts] = await Promise.all([getSettings(), getAllPosts()])

  return {
    props: {
      data: { settings, posts },
      preview,
      slug: params?.slug || null,
      token: null,
    },
    revalidate: 60, // In seconds
  }
}

export default function IndexRoute(props: PageProps) {
  const { data, preview, token } = props
  const [settings, posts] = data ? [data.settings, data.posts] : []

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <IndexPage loading preview posts={posts} settings={settings} />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

  return <IndexPage posts={posts} settings={settings} />
}
