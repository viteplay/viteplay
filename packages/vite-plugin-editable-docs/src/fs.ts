import fs from "fs"
import path from "path"

export const outputFileSync = (filepath: string, content: any) => {
  const dir = path.dirname(filepath)
  ensureDirSync(dir)
  fs.writeFileSync(filepath, content)
}

export const ensureDirSync = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true })
}
