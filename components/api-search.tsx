"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { siteConfig } from "@/settings/config"

interface ApiSearchProps {
  onFilterChange: (filteredEndpoints: any[]) => void
}

export function ApiSearch({ onFilterChange }: ApiSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const allEndpoints = siteConfig.apiCategories.flatMap((category) =>
    category.endpoints.map((endpoint) => ({
      ...endpoint,
      category: category.name,
      categoryColor: category.color,
    })),
  )

  const filterEndpoints = () => {
    let filtered = allEndpoints

    if (searchTerm) {
      filtered = filtered.filter(
        (endpoint) =>
          endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
          endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          endpoint.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setTimeout(() => filterEndpoints(), 0)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onFilterChange(allEndpoints)
  }

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search endpoints..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 h-10 sm:h-11 text-sm"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 touch-manipulation"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
