import { Plugin } from "vite"

export declare type Page = { title: string; examples: string | string[] }

export declare type Options = {
  /**
   * Path to extract components from to create dev pages for
   *
   * @example './components/*\/*.vue'
   */
  components?: string
  /**
   * Path to extract component examples from to put on each dev page
   *
   * @example './components/*\/*.example.vue'
   */
  componentExamples?: string
  /**
   * The base path the generated routes should be nested under as children.
   *
   * @example '/dev'
   */
  base?: string
  /**
   * Navbar title
   */
  title?: string
  /**
   * Navbar logo
   */
  logo?: string
  pages?: Page[]
  cacheDir?: string
  getPath?: (slug: string) => string
}

/** Mark some properties as required, leaving others unchanged */
type MarkRequired<T, RK extends keyof T> = Exclude<T, RK> &
  Required<Pick<T, RK>>

export type GetPagesFromOptions = (options: {
  pages?: Page[]
  components?: string
  componentExamples?: string
}) => Promise<Page[]>

export declare type BuildOptions = MarkRequired<Options, "cacheDir">

export declare type CreatePlugin = (opts: Options) => Plugin

export declare const plugin: CreatePlugin

export default plugin
