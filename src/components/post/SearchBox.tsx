'use client'
import { Input } from '@/components/ui/input'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { set } from 'date-fns'

export default function SearchBox() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const router = useRouter()

  // デバウンス
  useEffect(() =>{
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchKeyword])

  // debouncedKeywordが変化したら実行
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      router.push(`/?searchKeyword=${encodeURIComponent(debouncedKeyword.trim())}`)
    } else {
      router.push(`/`)
    }
  }, [debouncedKeyword, router])


  return (
    <>
      <Input
        placeholder="記事を検索..."
        className="w-\[200px\] lg\:w-\[300px\] bg-white"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

    </>
  )
}
