<template lang="pug">
#playback-title
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Protracker } from '../mod/protracker';

interface Player {
  load: (url: string, autoPlay?: boolean) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  volume: () => number;
  setVolume: (val: number) => void;
  duration: () => number;
  currentTime: () => number;
  isPlaying: () => boolean;
}

@Component
export default class AudioTracker extends Vue {

  private audio: Protracker | null = null;
  private playerWatcher: number = -1;

  private pCurrentTime: number = 0;
  private pDuration: number = 0;
  private pVolume: number = 0;

  private nextTrack: null | ((autoPlay: boolean) => {}) = null;

  private player: Player = {
    load: this.load,
    play: this.play,
    pause: this.pause,
    stop: this.stop,
    volume: this.volume,
    setVolume: this.setVolume,
    duration: this.duration,
    currentTime: this.currentTime,
    isPlaying: this.isPlaying,
  };

  private mounted() {
    if (this.$parent && this.$parent.$data.players) {
      this.$parent.$data.players.mod = this.player;

      this.nextTrack = (this.$parent as any).nextTrack;
    }

    const self = this;
    this.playerWatcher = setInterval(this.watchPlayer.bind(self), 100);
  }

  private beforeDestroy() {
    if (this.$parent && this.$parent.$data.players) {
      delete this.$parent.$data.players.mod;
    }
    if (this.playerWatcher !== -1) {
      clearInterval(this.playerWatcher);
    }
    if (this.audio !== null) {
      this.audio.stop();
    }
  }

  private watchPlayer() {
    // todo
  }

  private currentTime(): number {
    return this.pCurrentTime;
  }

  private duration(): number {
    return this.pDuration;
  }

  private volume(): number {
    return this.pVolume;
  }

  private setVolume(val: number) {
    // todo
  }

  private load(url: string, autoPlay?: boolean) {
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buff) => new Int8Array(buff))
      .then((buf) => {
        this.audio = new Protracker();
        this.audio.parse(buf);
      });
  }

  private isPlaying(): boolean {
    if (this.audio === null) {
      return false;
    }
    return this.audio.playing;
  }

  private play() {
    if (this.audio === null) {
      return;
    }
    this.audio.start();
  }

  private pause() {
    if (this.audio === null) {
      return;
    }
    this.audio.pause();
  }

  private stop() {
    if (this.audio === null) {
      return;
    }
    this.audio.stop();
  }
}
</script>
