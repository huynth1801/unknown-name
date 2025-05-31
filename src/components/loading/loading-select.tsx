import React from "react"
import { SelectTrigger } from "../ui/select"
import { Loader2 } from "lucide-react"

// Loading component với spinner
const LoadingSelect = ({ placeholder }: { placeholder: string }) => (
  <SelectTrigger>
    <div className="flex items-center">
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      <span>{placeholder}</span>
    </div>
  </SelectTrigger>
)

export default LoadingSelect
