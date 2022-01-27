import { execa } from "execa"
import Enquirer from "enquirer"

/**
 * @returns {Promise<Array<{name: string, path:string,private:boolean}>>}
 */
const getPackages = async () => {
  const { stdout } = await execa("pnpm", [`ls`, `-r`, `--depth`, `-1`, `--json`])
  return JSON.parse(stdout)
}

async function main() {
  const packages = await getPackages()
  const result = await Enquirer.prompt([
    {
      name: "package",
      type: "select",
      message: "Choose a playground to run dev script",
      choices: packages
        .filter((p) => p.name.startsWith("test-"))
        .map((p) => {
          return {
            name: p.name,
            value: p.name,
          }
        }),
    },
  ])

  await execa("turbo", ["run", "dev", `--scope=${result.package}`, `--include-dependencies^C`], {
    preferLocal: true,
    stdio: "inherit",
  })
}

main()
