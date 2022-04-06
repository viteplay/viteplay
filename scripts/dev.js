import { execa } from "execa"
import fs from "fs"
import Enquirer from "enquirer"

/**
 * @returns {string[]}
 */
const getPackages = () => {
  return fs.readdirSync("./playground")
}

async function main() {
  const names = getPackages()
  const result = await Enquirer.prompt([
    {
      name: "name",
      type: "select",
      message: "Choose a playground to run dev script",
      choices: names.map((name) => {
        return {
          name,
          value: name,
        }
      }),
    },
  ])

  const client = "pnpm"
  const args = [`-r`, `--filter`, `${result.name}...`, `--parallel`, `run`, `dev`]
  console.log(">", client, ...args)

  await execa(client, args, {
    preferLocal: true,
    stdio: "inherit",
  })
}

main()
