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
   * The path the generated routes should be nested under as children.
   *
   * @example '/dev'
   */
  parentPath?: string
  pages?: Page[]
  cacheDir?: string
  getPath?: (slug: string) => string
}

export declare type CreatePlugin = (opts: Options) => Plugin

export declare const plugin: CreatePlugin

export default plugin
