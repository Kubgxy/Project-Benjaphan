"use client"

import { useRef, useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  description?: string
  [key: string]: any
}

interface SearchPopoverProps {
  isOpen: boolean
  anchorRef: React.RefObject<HTMLButtonElement>
  onClose: () => void
  products: Product[]
  onResultClick?: (product: Product) => void
}

const POPULAR = [
  "Diamond Ring",
  "Gold Necklace",
  "Pearl bencharm",
  "Wedding Band",
  "Bracelet",
]

export function SearchPopover({ isOpen, anchorRef, onClose, products, onResultClick }: SearchPopoverProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [position, setPosition] = useState<{top: number, left: number}>({top: 0, left: 0})

  // ตำแหน่ง popover ใต้ไอคอน (ขวาบน)
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 10, // 10px margin below icon
        left: rect.right + window.scrollX - 400, // 400 = box width, box ชิดขวากับ icon
      })
      setTimeout(() => inputRef.current?.focus(), 120)
    }
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }, [isOpen, anchorRef])

  // ฟังก์ชันค้นหา
  const handleSearch = (q: string) => {
    const keyword = q.trim().toLowerCase()
    if (!keyword) {
      setResults([])
      return
    }
    setResults(
      products.filter(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword)
      )
    )
  }

  return (
    <div
      className={`fixed z-[80] transition-all duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        top: position.top,
        left: position.left,
        width: 400,
      }}
    >
      {/* สามเหลี่ยม */}
      <div className="absolute -top-3 right-8 w-6 h-6 pointer-events-none">
        <svg width="24" height="24" className="block" viewBox="0 0 24 24">
          <polygon points="12,0 24,24 0,24" className="fill-white stroke-gold-200" />
        </svg>
      </div>
      {/* Popover box */}
      <div className="rounded-xl shadow-xl border border-gold-200 bg-white px-6 py-5 relative">
        <form
          className="w-full flex items-center gap-2"
          onSubmit={e => {
            e.preventDefault()
            handleSearch(query)
          }}
        >
          <Search className="h-5 w-5 text-gold-600" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            placeholder="ค้นหาสินค้าหรือข้อมูล"
            className="flex-1 border-none outline-none px-2 py-2 text-base focus:ring-0 bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setResults([])
                inputRef.current?.focus()
              }}
              className="text-gold-400 hover:text-gold-600"
              aria-label="Clear"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <Button
            type="submit"
            variant="luxury"
            disabled={!query.trim()}
            className="px-5 py-2"
          >
            ค้นหา
          </Button>
          <button
            type="button"
            className="ml-2 text-brown-400 hover:text-gold-600"
            onClick={onClose}
            aria-label="ปิด"
          >
            <X className="h-6 w-6" />
          </button>
        </form>
        {/* popular search */}
        <div className="mt-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Popular Searches</div>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term)
                  handleSearch(term)
                  inputRef.current?.focus()
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        {/* ผลลัพธ์ */}
        {query && (
          <div className="mt-4 max-h-48 overflow-y-auto border-t border-gold-100 pt-2">
            {results.length === 0 ? (
              <div className="text-center text-brown-600 py-3 text-sm">ไม่พบข้อมูล</div>
            ) : (
              <ul>
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="py-2 px-2 rounded hover:bg-cream-50 cursor-pointer"
                    onClick={() => onResultClick?.(item)}
                  >
                    <div className="font-medium">{item.name}</div>
                    {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}