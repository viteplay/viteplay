import { Plugin } from "vite"

export declare type Page = { title: string; examples: string | string[] }

export declare type Options = {
  pages: Page[]
  cacheDir?: string
  getPath?: (slug: string) => string
}

export declare type CreatePlugin = (opts: Options) => Plugin

export declare const plugin: CreatePlugin

export default plugin
