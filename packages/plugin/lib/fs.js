import fs from "fs"
import path from "path"

/**
 *
 * @param {string} filepath
 * @param {string} content
 */
export const outputFileSync = (filepath, content) => {
  const dir = path.dirname(filepath)
  ensureDirSync(dir)
  fs.writeFileSync(filepath, content)
}

/**
 *
 * @param {string} filepath
 * @param {string} content
 */
export const outputFileIfChanged = (filepath, content) => {
  if (fs.existsSync(filepath)) {
    const oldContent = fs.readFileSync(filepath, "utf8")
    if (oldContent === content) {
      return
    }
  }
  outputFileSync(filepath, content)
}

/**
 * like mkdir -p
 * @param {string} dir
 */
export const ensureDirSync = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}
