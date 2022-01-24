// This script run all `dev` scripts (if present) in public packages
// `ultra -r dev` isn't flexible enough (can't filter out test-* packages?)
// So my workflow is to run `node scripts/dev.js` once
// And run `pnpm run dev --filter <a-playground-package>` to run a playground

import { execa } from "execa"

/**
 * @returns {Promise<Array<{name: string, path:string,private:boolean}>>}
 */
const getPackages = async () => {
  const { stdout } = await execa("pnpm", [
    `ls`,
    `-r`,
    `--depth`,
    `-1`,
    `--json`,
  ])
  return JSON.parse(stdout)
}

async function main() {
  const packages = await getPackages().then((ps) =>
    ps.filter((p) => !p.private),
  )
  for (const p of packages) {
    const cmd = execa(
      "pnpm",
      ["run", "dev", "--if-present", "--filter", p.name],
      {
        preferLocal: true,
        env: {
          FORCE_COLOR: "true",
        },
      },
    )
    cmd.stdout.on("data", (data) => console.log(`${p.name}: ${data}`))
    cmd.stderr.on("data", (data) => console.log(`${p.name}: ${data}`))
  }
}

main()
