'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Users } from 'lucide-react'

import type { Subreddit } from '@/db/schema'
import { cn } from '@/lib/utils'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/Command'
import { Skeleton } from '../ui/Skeleton'

const SearchBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [input, setInput] = useState('')

  const commandRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const request = debounce(async () => {
    await refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    void request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: queryResults,
    refetch,
    isFetching
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get<Subreddit[]>(`/api/search?q=${input}`)

      return data
    },
    queryKey: ['search-query', input],
    enabled: false
  })

  return (
    <Command
      ref={commandRef}
      className='relative z-50 max-w-lg overflow-visible rounded-lg border'
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        className='border-none outline-none ring-0 focus:border-none focus:outline-none'
        placeholder='Search communities...'
      />

      {input.length > 0 && (
        <CommandList className='absolute inset-x-0 top-full rounded-b-md bg-white shadow'>
          <CommandEmpty
            className={cn(isFetching ? 'hidden' : 'py-6 text-center text-sm')}
          >
            No communities found.
          </CommandEmpty>
          {isFetching ? (
            <div className='space-y-1 overflow-hidden px-1 py-2'>
              <Skeleton className='h-4 w-20 rounded' />
              <Skeleton className='h-8 rounded-sm' />
              <Skeleton className='h-8 rounded-sm' />
            </div>
          ) : (
            (queryResults?.length ?? 0) > 0 && (
              <CommandGroup heading='Communities'>
                {queryResults?.map((subreddit) => (
                  <CommandItem
                    key={subreddit.id}
                    value={subreddit.name}
                    onSelect={(e) => {
                      router.push(`/r/${e}`)
                      router.refresh()
                    }}
                  >
                    <Users className='mr-2 h-4 w-4' />
                    <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          )}
        </CommandList>
      )}
    </Command>
  )
}

export default SearchBar
