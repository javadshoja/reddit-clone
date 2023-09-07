import React from 'react'

type CodeRendererProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ data }) => {
  return (
    <div className='rounded-md bg-gray-800 p-4'>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
      <code className='text-sm text-gray-100'>{data.code}</code>
    </div>
  )
}

export default CodeRenderer
