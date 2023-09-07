'use client'

import React from 'react'
import dynamic from 'next/dynamic'

import CodeRenderer from './renderers/CodeRenderer'
import ImageRenderer from './renderers/ImageRenderer'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  {
    ssr: false
  }
)

type EditorOutputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  }
}

const renderers = {
  image: ImageRenderer,
  code: CodeRenderer
}

const EditorOutput: React.FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data={content}
      style={style}
      className='text-sm'
      renderers={renderers}
    />
  )
}

export default EditorOutput
