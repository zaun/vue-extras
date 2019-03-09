<template lang="pug">
  v-app
    v-toolbar(app clipped-left)
      v-toolbar-side-icon(@click="showSidebar = !showSidebar")
      v-toolbar-title.headline.text-uppercase Vue Extras
      v-spacer

    v-navigation-drawer(v-model="showSidebar" app clipped width="200")
      v-list
        template(v-for="item in menu")
          v-divider(v-if="!item.title")
          v-list-tile(v-if="item.title" @click="selected = item.value")
            v-list-tile-avatar
              v-icon {{ item.icon }}
            v-list-tile-content
              v-list-tile-title {{ item.title }}

    v-content
      GettingStarted(v-if="selected == 'getting_started'")
      ExampleDemo(v-if="selected == 'example'")
      GraphDemo(v-if="selected == 'graph'")
      MusicPlayerDemo(v-if="selected == 'music_player'")
      SheetMusicDemo(v-if="selected == 'sheet_music'")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import GettingStarted from './components/demos/Main.vue';
import ExampleDemo from './components/demos/Example.vue';
import GraphDemo from './components/demos/Graph.vue';
import MusicPlayerDemo from './components/demos/MusicPlayer.vue';
import SheetMusicDemo from './components/demos/SheetMusic.vue';


export interface MenuItem {
  title: string;
  icon?: string;
  value?: string;
}

@Component({
  components: {
    GettingStarted,
    ExampleDemo,
    GraphDemo,
    MusicPlayerDemo,
    SheetMusicDemo,
  },
})
export default class App extends Vue {
  private showSidebar: boolean = true;
  private selected: string = 'getting_started';
  private menu: MenuItem[] = [{
    title: 'Getting Started',
    icon: 'mdi-speedometer',
    value: 'getting_started',
  }, {
    title: '',
  }, {
    title: 'Example',
    icon: 'mdi-code-tags-check',
    value: 'example',
  }, {
    title: 'Graph',
    icon: 'mdi-chart-gantt',
    value: 'graph',
  }, {
    title: 'Music Player',
    icon: 'mdi-music',
    value: 'music_player',
  }, {
    title: 'Sheet Music',
    icon: 'mdi-music-note-quarter',
    value: 'sheet_music',
  }];
}
</script>
