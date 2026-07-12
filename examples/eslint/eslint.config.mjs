// eslint-disable-next-line import/no-unresolved
import kurateh from "@kurateh/eslint-config"

export default [
  ...kurateh.recommended,
  {
    rules: {
      "no-console": "off",
    },
  },
]
