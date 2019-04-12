<template lang="pug">
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Howl, Howler } from 'howler';

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
export default class AudioHowler extends Vue {

  private audio: Howl | null = null;
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
      this.$parent.$data.players.mp3 = this.player;
      // this.$parent.$data.players.ogg = this.player; // Not supported in Safari
      this.$parent.$data.players.flac = this.player;
      this.$parent.$data.players.m4a = this.player;

      this.nextTrack = (this.$parent as any).nextTrack;
    }
    const self = this;
    this.playerWatcher = setInterval(this.watchPlayer.bind(self), 100);
  }

  private beforeDestroy() {
    if (this.$parent && this.$parent.$data.players) {
      delete this.$parent.$data.players.mp3;
      // delete this.$parent.$data.players.ogg;
      delete this.$parent.$data.players.flac;
      delete this.$parent.$data.players.m4a;
    }
    if (this.playerWatcher !== -1) {
      clearInterval(this.playerWatcher);
    }
    if (this.audio !== null) {
      this.audio.unload();
      this.audio = null;
    }
  }

  private watchPlayer() {
    if (this.audio === null) {
      this.pCurrentTime = 0;
      this.pDuration = 0;
      this.pVolume = 0;
      return;
    }

    const ct: number = this.audio.seek() as number;
    if (Number.isNaN(ct)) {
      this.pCurrentTime = 0;
    } else {
      this.pCurrentTime = ct;
    }

    this.pDuration = this.audio.duration() || 1;
    this.pVolume = this.audio.volume() * 100;
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
    if (this.audio) {
      this.audio.volume(val / 100);
    }
  }

  private load(url: string, autoPlay?: boolean) {
    if (this.audio !== null) {
      this.audio.unload();
    }

    this.audio = new Howl({
      src: url,
      onload: () => {
        if (autoPlay) {
          this.play();
        }
      },
      onloaderror: (id, err) => {
        // tslint:disable-next-line no-console
        console.error('loaderror', err);
        this.audio = null;
        if (this.nextTrack !== null) {
          this.nextTrack(true);
        }
      },
      onend: () => {
        if (this.nextTrack !== null) {
          this.nextTrack(true);
        }
      },
    });
  }

  private isPlaying(): boolean {
    if (this.audio === null) {
      return false;
    }
    return this.audio.playing();
  }

  private play() {
    if (this.audio === null) {
      return;
    }
    this.audio.play();
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
