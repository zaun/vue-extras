/**
 * Based on https://github.com/jhalme/webaudio-mod-player/blob/master/js/pt.js
 * MIT
 */

class Tracker {
  public headphones: boolean = false;

  public title: string = '';
  public songlen: number = 0;
  public channels: number = 0;
  public patterns: number = 0;

  protected repeat: boolean = false;
  protected endofsong: boolean = false;
  protected row = 0;
  protected position = 0;
  protected speed = 6;
  protected bpm = 125;

  protected impMix: () => {};

  private context: AudioContext | webkitAudioContext;
  private filterNode: BiquadFilterOptions;
  private lowpassNode: BiquadFilterOptions;
  private mixerNode: ScriptProcessorNode | JavaScriptNode;

  constructor() {
    if ( typeof AudioContext !== 'undefined') {
      this.context = new AudioContext();
    } else if ( typeof webkitAudioContext !== 'undefined') {
      this.context = new webkitAudioContext();
    } else {
      throw new Error('Unsupported Environment');
    }

    this.filterNode = this.context.createBiquadFilter();
    this.filterNode.frequency.value = 22050;

    this.lowpassNode = this.context.createBiquadFilter();

    // Look into supporting AudioWorklet
    if ( typeof this.context.createScriptProcessor === 'function') {
      // Tthis feature in deprecated
      this.mixerNode = this.context.createScriptProcessor(this.bufferlen, 1, 2);
    } else if ( typeof this.context.createJavaScriptNode === 'function') {
      // This feature is obsolete
      this.mixerNode = this.context.createJavaScriptNode(this.bufferlen, 1, 2);
    }
    this.mixerNode.module = this;
    this.mixerNode.onaudioprocess = this.mix;

    // patch up some cables :)
    this.mixerNode.connect(this.filterNode);
    this.filterNode.connect(this.lowpassNode);
    this.lowpassNode.connect(this.context.destination);
  }

  private mix(ape: AudioProcessingEvent) {
    let mod: Tracker;

    if (ape.srcElement) {
      mod = ape.srcElement.module;
    } else {
      mod = this.module;
    }

    if (mod.player && mod.delayfirst === 0) {
      const bufs = new Array(ape.outputBuffer.getChannelData(0), ape.outputBuffer.getChannelData(1));
      const buflen = ape.outputBuffer.length;
      mod.impMix(mod.player, bufs, buflen);

      // apply stereo separation and soft clipping
      const outp = new Float32Array(2);
      for (let s = 0; s < buflen; s += 1) {
        outp[0] = bufs[0][s];
        outp[1] = bufs[1][s];

        // a more headphone-friendly stereo separation
        if (mod.headphones) {
          const t = outp[0];
          if (mod.separation === 2) {
            // mono
            outp[0] = outp[0] * 0.5 + outp[1] * 0.5;
            outp[1] = outp[1] * 0.5 + t * 0.5;
          } else {
            // narrow stereo
            outp[0] = outp[0] * 0.65 + outp[1] * 0.35;
            outp[1] = outp[1] * 0.65 + t * 0.35;
          }
        }

        // scale down and soft clip
        outp[0] /= mod.mixval;
        outp[0] = 0.5 * (Math.abs(outp[0] + 0.975) - Math.abs(outp[0] - 0.975));
        outp[1] /= mod.mixval;
        outp[1] = 0.5 * (Math.abs(outp[1] + 0.975) - Math.abs(outp[1] - 0.975));

        bufs[0][s] = outp[0];
        bufs[1][s] = outp[1];
      }

      if (mod.player.filter !== mod.filter) {
        mod.setfilter(mod.player.filter);
      }

      if (mod.endofsong && mod.playing) {
        mod.stop();
      }

      if (mod.delayfirst > 0) {
        mod.delayfirst -= 1;
      }
      mod.delayload = 0;

      // update this.chvu from player channel vu
      for (let i = 0; i < mod.player.channels; i++) {
        mod.chvu[i] = mod.chvu[i] * 0.25 + mod.player.chvu[i] * 0.75;
        mod.player.chvu[i] = 0.0;
      }
    }
  }
}

export { Tracker };
