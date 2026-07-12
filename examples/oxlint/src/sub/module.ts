// This should trigger 'shouldBeAbsolutePath' error (use @/utils instead of ../utils)
import { util } from "../utils"

console.log(util())
