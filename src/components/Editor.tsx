'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import type EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import TextareaAutoSize from 'react-textarea-autosize'

import { uploadFiles } from '@/lib/uploadthing'
import { PostValidator, type PostCreationRequest } from '@/lib/validators/post'
import { toast } from '@/hooks/useToast'

type EditorProps = {
  subredditId: number
}

const Editor: React.FC<EditorProps> = ({ subredditId }) => {
  const pathname = usePathname()
  const router = useRouter()

  const [isMounted, setIsMounted] = useState(false)

  const editorRef = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null
    }
  })

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const Embed = (await import('@editorjs/embed')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          editorRef.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link'
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: 'imageUploader'
                  })

                  return {
                    success: 1,
                    file: {
                      url: res?.url
                    }
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed
        }
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description: (value as { message: string }).message,
          variant: 'destructive'
        })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        // Set focus to title
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init().catch(() => {})

      return () => {
        editorRef.current?.destroy()
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        subredditId
      }

      const { data } = await axios.post<string>(
        '/api/subreddit/post/create',
        payload
      )

      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your post not published, please try again later.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      console.log('🚀 ~ file: Editor.tsx:163 ~ pathname:', pathname)
      console.log('🚀 ~ file: Editor.tsx:163 ~ newPathname:', newPathname)
      router.push(newPathname)

      router.refresh()

      return toast({
        title: 'Success',
        description: 'Your post has been published.'
      })
    }
  })

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await editorRef.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId
    }

    createPost(payload)
  }

  const { ref: titleRef, ...rest } = register('title')

  if (!isMounted) {
    return null
  }

  return (
    <div className='w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4'>
      <form
        id='subreddit-form-post'
        className='w-fit'
        onSubmit={() => void handleSubmit(onSubmit)}
      >
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutoSize
            ref={(e) => {
              titleRef(e)

              // @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />

          <div id='editor' className='min-h-[500px]' />
        </div>
      </form>
    </div>
  )
}

export default Editor
