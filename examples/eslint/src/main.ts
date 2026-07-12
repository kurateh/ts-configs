// This should trigger 'shouldBeRelativePath' error (use ./utils instead of @/utils)
import { util } from "@/utils"

console.log(util())
