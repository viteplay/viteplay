<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/mesqueeb.png',
    name: 'Luca Ban',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/mesqueeb' },
      { icon: 'twitter', link: 'https://twitter.com/mesqueeb' }
    ]
  },
  {
    avatar: 'https://www.github.com/egoist.png',
    name: 'EGOIST',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/egoist' },
      { icon: 'twitter', link: 'https://twitter.com/_egoistlily' }
    ]
  },
]
</script>

# Design Goals, Motivation & Team

## Design Goals

- No more time wasted **setting up development pages**
  <br /><small>→ VitePlay gives you a `/dev` route to develop _any_ component, auto-detected based on your files</small>
- **NO complex new syntax** for creating component examples
  <br /><small>→ Component examples are just Vue files in which you import your component and use it... that's it</small>
- Be able to use your **existing Vite project**
  <br /><small>→ Decide on the route path, no conflicts</small>
- Can focus on developing a component **in isolation**
  <br /><small>→ Use the component examples page or even focus on a single example</small>
- Be able to **showcase** all components being used in your project
  <br /><small>→ Go to VitePlay's `/dev` route to browse through all your project's components</small>
- Show other developers **how components can / should be used**
  <br /><small>→ Have your team look at the code used in the component examples</small>
- Auto generated **props table** with extra documentation
  <br /><small>→ Add `/** JSDoc comments */` above props to show them in the auto-generated props table</small>
- A place where designers can verify and **interact with a component** early
  <br /><small>→ Auto deploy your VitePlay to the web and share the link with your designers for early feedback</small>
- Have a place to **explain certain usage examples** of components
  <br /><small>→ Add Markdown documentation to your VitePlay pages with `<docs>use this when...</docs>`</small>

## Motivation

When I came up with the idea of VitePlay, I really just wanted a way to easily develop components without all the setup hassle. I've experienced endless _setup hell_ with frameworks like StoryBook. Others similar frameworks I found, didn't check all my boxes for what I needed from a development framework (see [Design Goals](#design-goals)).

Another really big turn off to me is that you have to learn a new syntax to write components examples. One of my main design choices for VitePlay is that component examples are _just_ a Vue files where you import a component and use it in the template. The closer it is to _real usage_ throughout your project, the more it makes sense.

<div class="quote">
  <div>“I did not want to learn a whole new Syntax, just to write component examples</div>
  <div>- Luca Ban</div>
</div>

I wanted to create something with VitePlay where _everyone_ benefits. You can use it during development to build your component in isolation and immidiately test how they react with different props. Other developers can all reference the examples and its code. Designers can interact with the components you build.

## Our Team

Say hello to our awesome team.

<VPTeamMembers size="small" :members="members" />
