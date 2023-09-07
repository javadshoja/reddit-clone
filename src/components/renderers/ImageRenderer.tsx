import React from 'react'
import Image from 'next/image'

type ImageRendererProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const src = data.file.url

  return (
    <div className='relative min-h-[15rem] w-full'>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <Image alt='image' className='object-contain' fill src={src} />
    </div>
  )
}

export default ImageRenderer
