<template lang="pug">
  .audio-player
    slot
    .a-mini(v-if="display === 'mini'")
      .a-player
        .a-play-pause-btn(@click="doPlayPause")
          img(:src="controlIcon")
        .a-controls
          span.a-time {{ displayCurrentTime }}
          .a-slider(data-direction="horizontal")
            .a-progress(:style="{ width: progress + '%' }")
              .a-pin
          span.a-time {{ displayTotalTime }}
        .a-volume
          .a-volume-btn(@click.stop="onToggleVolume")
            img(:src="volumeIcon")
          .a-volume-controls(v-if="showVolume")
            .a-slider(@click="onVolumeChange" @mousedown="onDraggingStart" data-direction="vertical")
              .a-progress(:style="{ height: volume + '%' }" data-name="volume")
                .a-pin

    .a-small(v-if="display === 'small'")
      .a-player
        .a-artwork(:style="artworkStyle" @click="doPlayPause")
          .a-play-pause-btn
            img(:src="controlIcon")
        .a-controls
          .a-top {{ title }}
          .a-bottom
            span.a-time {{ displayTime }}
            .a-slider(data-direction="horizontal")
              .a-progress(:style="{ width: progress + '%' }")
                .a-pin
            .a-volume
              .a-volume-btn(@click.stop="onToggleVolume")
                img(:src="volumeIcon")
              .a-volume-controls(v-if="showVolume")
                .a-slider(@click="onVolumeChange" @mousedown="onDraggingStart" data-direction="vertical")
                  .a-progress(:style="{ height: volume + '%' }" data-name="volume")
                    .a-pin
    
    ul(v-if="playlist")
      li(v-for="(track, index) in tracks" :key="index" @click="doPlayItem(track)")
        span {{ index + 1  }}
        | {{ track.title }}
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { indexOf } from 'lodash';

/* tslint:disable:no-var-requires */
const noCoverArt = require('@/assets/noCoverArt.png');
const playIcon = require('@/assets/play.png');
const pauseIcon = require('@/assets/pause.png');
const stopIcon = require('@/assets/stop.png');
const audio0 = require('@/assets/audio-0.png');
const audio1 = require('@/assets/audio-1.png');
const audio2 = require('@/assets/audio-2.png');
const audio3 = require('@/assets/audio-3.png');
/* tslint:enable */

interface Track {
  url: string;
  art: string;
  title: string;
}

interface TrackInternal extends Track {
  id: string;
}

interface Player {
  load: (url: string, autoPlay?: boolean) => void;
  play: () => void;
  pause: () => void;
  volume: () => number;
  setVolume: (val: number) => void;
  duration: () => number;
  currentTime: () => number;
  isPlaying: () => boolean;
}

interface PlayerHash {
  [index: string]: Player;
}

@Component
export default class AudioPlayer extends Vue {
  @Prop({ default: [] })
  public tracks!: Track[];

  @Prop({ default: 'mini' })
  public display!: string;

  @Prop({ default: false })
  public playlist!: boolean;

  protected players: PlayerHash = {};
  private player: Player | null = null;
  private track: Track | null = null;

  private requestedVolume: number = 100;                // Volume 0 to 1
  private showVolume: boolean = false;                  // True if the volumne slider is show

  private currentlyDragged: HTMLElement | null = null;  //  Set if a slider is draggin

  /**
   * Utility functions
   */
  protected nextTrack(autoPlay?: boolean) {
    let updated: boolean = false;
    if (this.track === null) {
      this.track = this.tracks[0];
      updated = true;
    } else {
      const idx = indexOf<Track>(this.tracks, this.track);
      if (idx !== -1 && idx < this.tracks.length - 1) {
        this.track = this.tracks[idx + 1];
        updated = true;
      }
    }

    if (this.player !== null) {
      this.player.pause();
    }

    this.getPlayer(this.track.url);
    if (autoPlay && updated) {
      this.doPlay();
    }
  }

  private getPlayer(url: string) {
    const ext: string = url.split('.').pop() as string;
    this.player = null;
    if (this.players[ext]) {
      this.player = this.players[ext];
      this.player.load(url);
    } else {
      console.error('Player not found for ' + url);
    }
  }

  private pad(num: number, size: number) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  /**
   * Display getters
   */
  private get duration() {
    if (this.player === null) {
      return 0;
    }
    return this.player.duration();
  }

  private get currentTime() {
    if (this.player === null) {
      return 0;
    }
    return this.player.currentTime();
  }

  private get progress() {
    return this.currentTime / this.duration * 100;
  }

  // Return the current M:SS
  private get displayCurrentTime(): string {
    let ret = '';
    // tslint:disable-next-line no-bitwise
    const minT: number = Math.floor((this.duration / 60) << 0);
    // tslint:disable-next-line no-bitwise
    const minC: number = Math.floor((this.currentTime / 60) << 0);
    const secC: number = Math.floor((this.currentTime) % 60);
    if (minT > 0) {
      ret = this.pad(minC, 1) + ':';
    }
    ret += this.pad(secC, 2);
    return ret;
  }

  // Return the total M:SS
  private get displayTotalTime(): string {
    let ret = '';
    // tslint:disable-next-line no-bitwise
    const minT = Math.floor((this.duration / 60) << 0);
    const secT = Math.floor((this.duration) % 60);
    if (minT > 0) {
      ret = this.pad(minT, 1) + ':';
    }
    ret += this.pad(secT, 2);
    return ret;
  }

  private get displayTime(): string {
    // tslint:disable-next-line no-bitwise
    const minC: number = Math.floor((this.currentTime / 60) << 0);
    const secC: number = Math.floor((this.currentTime) % 60);
    // tslint:disable-next-line no-bitwise
    const minT: number = Math.floor((this.duration / 60) << 0);
    const secT: number = Math.floor((this.duration) % 60);
    let ret = '';
    if (minT > 0) {
      ret = this.pad(minC, 2) + ':';
    }
    ret += this.pad(secC, 2) + ' / ';
    if (minT > 0) {
      ret += this.pad(minT, 2) + ':';
    }
    ret += this.pad(secT, 2);
    return ret;
  }

  private get volume() {
    if (this.player !== null) {
      return this.player.volume();
    } else {
      return this.requestedVolume;
    }
  }

  private get volumeIcon() {
    if (this.volume > 75) {
      return audio3;
    } else if (this.volume <= 0) {
      return audio0;
    } else if (this.volume < 25) {
      return audio1;
    }
    return audio2;
  }

  private get isPlaying() {
    if (this.player && this.player.isPlaying()) {
      return true;
    }
    return false;
  }

  private get controlIcon() {
    if (this.player === null) {
      return playIcon;
    }

    if (this.isPlaying) {
      return playIcon;
    } else {
      return pauseIcon;
    }
  }

  private get artworkStyle() {
    if (this.track === null || !this.track.art) {
      return `background-image: url("${noCoverArt}")`;
    }
    return `background-image: url("${this.track.art}")`;
  }

  private get title() {
    if (this.track === null) {
      return '';
    } else {
      return this.track.title;
    }
  }

  /**
   * Play / Pause control
   */
  private doPlayItem(item: Track) {
    if (!this.track || this.track.url !== item.url) {
      this.track = item;

      if (this.player) {
        this.player.pause();
      }

      this.getPlayer(this.track.url);
      this.doPlay();
    }
  }

  private doPlay() {
    if (this.track == null) {
      this.nextTrack(true);
      return;
    }

    if (this.player && !this.isPlaying) {
      this.player.play();
      return;
    }
  }

  private doPlayPause() {
    if (this.isPlaying) {
      this.doPause();
    } else {
      this.doPlay();
    }
  }

  private doPause() {
    if (this.player !== null) {
      this.player.pause();
    }
  }

  /**
   * Volume control
   */
  private onToggleVolume() {
    this.showVolume = !this.showVolume;
  }

  private onVolumeChange(event: MouseEvent) {
    this.requestedVolume = this.getCoefficient(event) * 100;
    if (this.player !== null) {
      this.player.setVolume(this.requestedVolume);
    }
  }

  /**
   * Dragging support for volume
   */
  private isDraggable(el: HTMLElement) {
    let canDrag = false;
    const classes = Array.from(el.classList);
    if (classes.indexOf('a-pin') !== -1) {
      canDrag = true;
    }
    return canDrag;
  }

  private onDraggingStart(event: MouseEvent) {
    if (!this.isDraggable(event.target as HTMLElement) || this.currentlyDragged !== null) {
      return false;
    }
    this.currentlyDragged = event.target as HTMLElement;
  }

  // Dragging event on the window on all mouse up events
  private onDraggingStop() {
    if (this.currentlyDragged !== null) {
      this.currentlyDragged = null;
      this.showVolume = false;
    }
  }

  // Dragging event on the window on all mouse move events
  private onDragging(event: MouseEvent) {
    let name: string = '';
    if (this.currentlyDragged && this.currentlyDragged.parentElement) {
      name = this.currentlyDragged.parentElement.dataset.name || '';
    }
    if (this.currentlyDragged !== null && name === 'volume') {
      this.onVolumeChange(event);
    }
  }

  // Get the slider based on the mouse event type
  private getRangeBox(event: MouseEvent): HTMLElement | null {
    if (event.target === null) {
      return null;
    }

    let rangeBox: HTMLElement | null = null;
    const el: HTMLElement | null = this.currentlyDragged;
    if (event.type === 'click' && this.isDraggable(event.target as HTMLElement)) {
      const target: HTMLElement = event.target as HTMLElement;
      if (target.parentElement !== null) {
        rangeBox = target.parentElement.parentElement;
      }
    }
    if (event.type === 'mousemove' && el !== null) {
      if (el.parentElement != null) {
        rangeBox = el.parentElement.parentElement;
      }
    }
    return rangeBox;
  }

  // returns 0 to 1 based on the slide position
  private getCoefficient(event: MouseEvent): number {
    const slider: HTMLElement | null = this.getRangeBox(event);
    if (slider === null) {
      return 0;
    }

    const rect: DOMRect = slider.getBoundingClientRect() as DOMRect;
    let K = 0;
    if (slider.dataset.direction === 'horizontal') {
      const offsetX = event.clientX - slider.offsetLeft;
      const width = slider.clientWidth;
      K = offsetX / width;
    } else if (slider.dataset.direction === 'vertical') {
      const height = slider.clientHeight;
      const offsetY = event.clientY - rect.top;
      K = 1 - offsetY / height;
    }
    return K < 0 ? 0 : K > 1 ? 1 : K;
  }

  /**
   * Vue hooks
   */
  private created() {
    window.addEventListener('mouseup', this.onDraggingStop, false);
    window.addEventListener('mousemove', this.onDragging, false);
  }

  private destroyed() {
    window.removeEventListener('mouseup', this.onDraggingStop, false);
    window.removeEventListener('mousemove', this.onDragging, false);
  }

  private mounted() {
    this.nextTrack();
  }
}
</script>

<style lang="scss" scoped>
.audio-player {
  font-weight: 300;
  .a-mini {
    display: flax;
    flex-direction: column;
    align-items: center;
    height: 3em;
    .a-player {
      min-width: 300px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 1rem;
      padding-right: 1rem;
      user-select: none;
      background-color: #fff;
      border: 1px solid #eee;
      .a-play-pause-btn {
        cursor: pointer;
        width: 2em;
        height: 2em;
        img {
          opacity: 0.5;
          width: 100%;
        }
      }
      .a-controls {
        font-size: 16px;
        line-height: 18px;
        color: #55606E;
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        margin-left: 24px;
        margin-right: 24px;
        .a-time {
          cursor: default;
        }
      }
    }
  }

  .a-small {
    display: flax;
    flex-direction: column;
    align-items: center;
    height: 6em;
    .a-player {
      min-width: 300px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 1rem;
      user-select: none;
      border: 1px solid #eee;
      .a-artwork {
        width: 6em;
        height: 6em;
        background-position: center center;
        background-size: cover;
        border-right: 1px solid #eee;
        cursor: pointer;
        .a-play-pause-btn {
          margin: 1.5em;
          width: 3em;
          height: 3em;
          opacity: 0.4;
          background-color: #fff;
          border-radius: 100px;
          img {
            width: 100%;
          }
        }
        &:hover {
          .a-play-pause-btn {
          opacity: 0.5;
          }
        }
      }
      .a-controls {
        height: 100%;
        font-size: 16px;
        line-height: 18px;
        color: #55606E;
        display: flax;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        margin-left: 1rem;
        .a-top {
          display: block;
          height: 1.3em;
          margin-top: 0.5em;
          line-height: 1.5;
          font-size: 1.5em;
          overflow: hidden;
        }
        .a-bottom {
          position: relative;
          font-size: 16px;
          line-height: 18px;
          color: #55606E;
          display: flex;
          flex-grow: 1;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }

  .a-slider {
    margin-left: 16px;
    margin-right: 16px;
    border-radius: 2px;
    height: 4px;
    flex-grow: 1;
    background-color: #D8D8D8;
    cursor: pointer;
    position: relative;
    .a-progress {
      height: 100%;
      background-color: #44BFA3;
      border-radius: inherit;
      position: absolute;
      pointer-events: none;
      .a-pin {
        height: 16px;
        width: 16px;
        border-radius: 8px;
        background-color: #44BFA3;
        position: absolute;
        pointer-events: all;
        box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.32);
        right: -8px;
        top: -6px;
      }
    }
  }

  .a-volume {
    position: relative;
    .a-volume-btn {
      cursor: pointer;
      width: 2em;
      height: 2em;
      img {
        opacity: 0.5;
        width: 100%;
      }
    }
  }
  
  .a-volume-controls {
    width: 30px;
    height: 135px;
    background-color: rgba(0, 0, 0, 0.62);
    border-radius: 7px;
    position: absolute;
    left: -3px;
    bottom: 52px;
    flex-direction: column;
    align-items: center;
    display: flex;
    bottom: -135px;
    left: -3px;
    z-index: 999;
    .a-slider {
      margin-top: 12px;
      margin-bottom: 12px;
      width: 6px;
      border-radius: 3px;
      .a-progress {
        bottom: 0;
        height: 100%;
        width: 6px;
        .a-pin {
          left: -5px;
          top: -8px;
        }
      }
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      padding: 0 1em;
      border-bottom: 1px solid #eee;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      height: 3em;
      line-height: 3em;
      margin: 0;
      span {
        text-align: right;
        padding-right: 1em;
        display: inline-block;
        width: 2em;
      }
      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>