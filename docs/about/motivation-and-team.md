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

# Motivation

... coming soon

# Our Team

Say hello to our awesome team.

<VPTeamMembers size="small" :members="members" />
