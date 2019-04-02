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
      MapDemo(v-if="selected == 'map'")
      MusicPlayerDemo(v-if="selected == 'music_player'")
      SheetMusicDemo(v-if="selected == 'sheet_music'")
      VideoPlayerDemo(v-if="selected == 'video_player'")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import GettingStarted from './components/demos/Main.vue';
import ExampleDemo from './components/demos/Example.vue';
import GraphDemo from './components/demos/Graph.vue';
import MapDemo from './components/demos/Map.vue';
import MusicPlayerDemo from './components/demos/MusicPlayer.vue';
import SheetMusicDemo from './components/demos/SheetMusic.vue';
import VideoPlayerDemo from './components/demos/VideoPlayer.vue';


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
    MapDemo,
    MusicPlayerDemo,
    SheetMusicDemo,
    VideoPlayerDemo,
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
    title: 'Map',
    icon: 'mdi-map',
    value: 'map',
  }, {
    title: 'Music Player',
    icon: 'mdi-music',
    value: 'music_player',
  }, {
    title: 'Sheet Music',
    icon: 'mdi-music-note-quarter',
    value: 'sheet_music',
  }, {
    title: 'Video Player',
    icon: 'mdi-video',
    value: 'video_player',
  }];
}
</script>
