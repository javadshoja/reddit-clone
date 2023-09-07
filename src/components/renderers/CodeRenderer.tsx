import React from 'react'

type CodeRendererProps = {
  data: any
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ data }) => {
  return (
    <div className='rounded-md bg-gray-800 p-4'>
      <code className='text-sm text-gray-100'>{data.code}</code>
    </div>
  )
}

export default CodeRenderer
