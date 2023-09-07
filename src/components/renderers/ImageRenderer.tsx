import React from 'react'
import Image from 'next/image'

type ImageRendererProps = {
  data: any
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ data }) => {
  const src = data.file.url

  return (
    <div className='relative min-h-[15rem] w-full'>
      <Image alt='image' className='object-contain' fill src={src} />
    </div>
  )
}

export default ImageRenderer
