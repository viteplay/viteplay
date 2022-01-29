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

  await execa("nx", ["run", `${result.name}:dev`], {
    preferLocal: true,
    stdio: "inherit",
  })
}

main()
