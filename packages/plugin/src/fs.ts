import fs from "node:fs"
import path from "node:path"

export const outputFileSync = (filepath: string, content: string) => {
  const dir = path.dirname(filepath)
  ensureDirSync(dir)
  fs.writeFileSync(filepath, content)
}

export const outputFileIfChanged = (filepath: string, content: string) => {
  if (fs.existsSync(filepath)) {
    const oldContent = fs.readFileSync(filepath, "utf8")
    if (oldContent === content) {
      return
    }
  }

  outputFileSync(filepath, content)
}

/**
 * Like mkdir -p
 */
export const ensureDirSync = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true })
}
