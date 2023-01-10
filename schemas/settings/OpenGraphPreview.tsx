import { Card } from '@sanity/ui'
import { height, OpenGraphImage, width } from 'components/OpenGraphImage'
import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill'
import type { Settings } from 'lib/sanity.queries'
import React, { cache, use, useEffect, useMemo, useState } from 'react'
import _satori, { type SatoriOptions } from 'satori'
import styled from 'styled-components'

async function init(): Promise<SatoriOptions['fonts']> {
  if (!globalThis?.Intl?.Segmenter) {
    console.debug('Polyfilling Intl.Segmenter')
    //@ts-expect-error
    globalThis.Intl = globalThis.Intl || {}
    //@ts-expect-error
    globalThis.Intl.Segmenter = await createIntlSegmenterPolyfill(
      fetch(new URL('public/break_iterator.wasm', import.meta.url))
    )
  }

  const fontData = await fetch(
    new URL('public/Inter-Bold.woff', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return [{ name: 'Inter', data: fontData, style: 'normal', weight: 700 }]
}

const OpenGraphSvg = styled(Card).attrs({
  radius: 3,
  shadow: 1,
  overflow: 'hidden',
})`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
    object-fit: cover;
    aspect-ratio: ${width} / ${height};
    object-position: center;
    height: 100%;
    width: 100%;
  }
`

export default function OpenGraphPreview(props: Settings['ogImage']) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    async function getHtml() {
      const fonts = await init()
      const html = await _satori(<OpenGraphImage title={props.title || ''} />, {
        width,
        height,
        fonts,
      })

      console.log('html', html)

      setHtml(html)
    }

    getHtml()
  }, [html, props.title])

  return <OpenGraphSvg dangerouslySetInnerHTML={{ __html: html }} />
}
