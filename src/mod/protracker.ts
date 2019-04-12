/**
 * Based on https://github.com/jhalme/webaudio-mod-player/blob/master/js/pt.js
 * MIT
 */

import { Tracker } from './tracker';

interface Channel {
  sample: number;
  period: number;
  voiceperiod: number;
  note: number;
  volume: number;
  command: number;
  data: number;
  samplepos: number;
  samplespeed: number;
  flags: number;
  noteon: number;
  slidespeed: number;
  slideto: number;
  slidetospeed: number;
  arpeggio: number;

  semitone: number;
  vibratospeed: number;
  vibratodepth: number;
  vibratopos: number;
  vibratowave: number;
}

interface Sample {
  name: string;
  length: number;
  finetune: number;
  volume: number;
  loopstart: number;
  looplength: number;
  data: Float32Array;
}

class Protracker extends Tracker {
  private playing: boolean = false;
  private paused: boolean = false;
  private filter: boolean = false;

  private mixval: number = 4.0;
  private syncqueue = [];
  private samplerate: number = 44100;

  private baseperiodtable: Float32Array;
  private finetunetable: Float32Array;
  private vibratotable: Float32Array[];
  private patterntable: Int8Array = new Int8Array(128);

  private effectsT0: Array<(mod: any, ch: any) => {}>;
  private effectsT0E: Array<(mod: any, ch: any) => {}>;
  private effectsT1: Array<(mod: any, ch: any) => {}>;
  private effectsT1_e: Array<(mod: any, ch: any) => {}>;


  private syncqueue = [];

  private tick = 0;
  private offset = 0;
  private flags = 0;

  private breakrow = 0;
  private patternjump = 0;
  private patterndelay = 0;
  private patternwait = 0;

  private channel: Channel[] = new Array();
  private chvu: Float32Array = new Float32Array();
  private pattern: Uint8Array[] = new Array();
  private note: Uint8Array[] = new Array();
  private pattern_unpack: Uint8Array[] = new Array();

  private samples: number = 0;
  private sample: Sample[] = new Array();
  private repeatpos: number = 0;

  constructor() {
    super();

    this.baseperiodtable = new Float32Array([
    856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453,
    428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
    214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113]);

    this.finetunetable = new Float32Array(16);
    for (let t = 0; t < 16; t += 1) {
      this.finetunetable[t] = Math.pow(2, (t - 8) / 12 / 8);
    }

    this.vibratotable = new Array();
    for (let t = 0; t < 4; t += 1) {
      this.vibratotable[t] = new Float32Array(64);
      for (let i = 0; i < 64; i += 1) {
        switch (t) {
          case 0:
            this.vibratotable[t][i] = 127 * Math.sin(Math.PI * 2 * (i / 64));
            break;
          case 1:
            this.vibratotable[t][i] = 127 - 4 * i;
            break;
          case 2:
            this.vibratotable[t][i] = (i < 32) ? 127 : -127;
            break;
          case 3:
            this.vibratotable[t][i] = (1 - 2 * Math.random()) * 127;
            break;
        }
      }
    }

    this.effectsT0 = new Array(
      this.effectT0_0, this.effectT0_1, this.effectT0_2, this.effectT0_3,
      this.effectT0_4, this.effectT0_5, this.effectT0_6, this.effectT0_7,
      this.effectT0_8, this.effectT0_9, this.effectT0_a, this.effectT0_b,
      this.effectT0_c, this.effectT0_d, this.effectT0E, this.effectT0_f);

    this.effectsT0E = new Array(
      this.effectT0E0, this.effectT0E1, this.effectT0E2, this.effectT0E3,
      this.effectT0E4, this.effectT0E5, this.effectT0E6, this.effectT0E7,
      this.effectT0E8, this.effectT0E9, this.effectT0Ea, this.effectT0Eb,
      this.effectT0Ec, this.effectT0Ed, this.effectT0Ee, this.effectT0Ef);
    this.effectsT1 = new Array(
      this.effectT1_0, this.effectT1_1, this.effectT1_2, this.effectT1_3,
      this.effectT1_4, this.effectT1_5, this.effectT1_6, this.effectT1_7,
      this.effectT1_8, this.effectT1_9, this.effectT1_a, this.effectT1_b,
      this.effectT1_c, this.effectT1_d, this.effectT1E, this.effectT1_f);
    this.effectsT1_e = new Array(
      this.effectT1E0, this.effectT1E1, this.effectT1E2, this.effectT1E3,
      this.effectT1E4, this.effectT1E5, this.effectT1E6, this.effectT1E7,
      this.effectT1E8, this.effectT1E9, this.effectT1Ea, this.effectT1Eb,
      this.effectT1Ec, this.effectT1Ed, this.effectT1Ee, this.effectT1Ef);

    for (let i = 0; i < this.channels; i += 1) {
      this.channel[i] = new Object() as Channel;
      this.channel[i].sample = 0;
      this.channel[i].period = 214;
      this.channel[i].voiceperiod = 214;
      this.channel[i].note = 24;
      this.channel[i].volume = 64;
      this.channel[i].command = 0;
      this.channel[i].data = 0;
      this.channel[i].samplepos = 0;
      this.channel[i].samplespeed = 0;
      this.channel[i].flags = 0;
      this.channel[i].noteon = 0;
      this.channel[i].slidespeed = 0;
      this.channel[i].slideto = 214;
      this.channel[i].slidetospeed = 0;
      this.channel[i].arpeggio = 0;

      this.channel[i].semitone = 12;
      this.channel[i].vibratospeed = 0;
      this.channel[i].vibratodepth = 0;
      this.channel[i].vibratopos = 0;
      this.channel[i].vibratowave = 0;
    }

    this.clearsong();
  }

  private clearsong() {
    this.title = '';

    this.songlen = 1;
    this.repeatpos = 0;
    this.patterntable = new Int8Array(128);
    const patternTableView = new Int8Array(this.patterntable);
    for (let i = 0; i < 128; i += 1) {
      patternTableView[i] = 0;
    }

    this.channels = 4;
    this.sample = new Array();
    this.samples = 31;
    for (let i = 0; i < 31; i += 1) {
      this.sample[i] = new Object() as Sample;
      this.sample[i].name = '';
      this.sample[i].length = 0;
      this.sample[i].finetune = 0;
      this.sample[i].volume = 64;
      this.sample[i].loopstart = 0;
      this.sample[i].looplength = 0;
      this.sample[i].data = new Float32Array();
    }

    this.patterns = 0;
    this.pattern = new Array();
    this.note = new Array();
    this.pattern_unpack = new Array();

    this.looprow = 0;
    this.loopstart = 0;
    this.loopcount = 0;

    this.patterndelay = 0;
    this.patternwait = 0;
  }

  private parse(buffer: Int8Array) {
    console.log('parse');
    let signature = '';
    for (let i = 0; i < 4; i += 1) {
      signature += String.fromCharCode(buffer[1080 + i]);
    }

    switch (signature) {
      case 'M.K.':
      case 'M!K!':
      case '4CHN':
      case 'FLT4':
        this.channels = 0;
        break;

      case '6CHN':
        this.channels = 6;
        break;

      case '8CHN':
      case 'FLT8':
        this.channels = 8;
        break;

      case '28CH':
        this.channels = 28;
        break;

      default:
        throw new Error('Unknown signature');
    }

    // Initilize volume
    this.chvu = new Float32Array();
    for (let i = 0; i < this.channels; i += 1) {
      this.chvu[i] = 0.0;
    }

    // Load title
    this.title = '';
    for (let i = 0; i < 20; i += 1) {
      this.title += String.fromCharCode(buffer[i]);
    }

    // Load Samples
    for (let i = 0; i < this.samples; i += 1) {
      const st = 20 + i * 30;
      let j = 0;
      while (buffer[st + j] && j < 22) {
        this.sample[i].name +=
          ((buffer[st + j] > 0x1f) && (buffer[st + j] < 0x7f)) ?
          (String.fromCharCode(buffer[st + j])) :
          (' ');
        j += 1;
      }

      this.sample[i].length = 2 * (buffer[st + 22] * 256 + buffer[st + 23]);
      this.sample[i].finetune = buffer[st + 24];
      if (this.sample[i].finetune > 7) {
        this.sample[i].finetune = this.sample[i].finetune - 16;
      }
      this.sample[i].volume = buffer[st + 25];
      this.sample[i].loopstart = 2 * (buffer[st + 26] * 256 + buffer[st + 27]);
      this.sample[i].looplength = 2 * (buffer[st + 28] * 256 + buffer[st + 29]);
      if (this.sample[i].looplength === 2) {
        this.sample[i].looplength = 0;
      }
      if (this.sample[i].loopstart > this.sample[i].length) {
        this.sample[i].loopstart = 0;
        this.sample[i].looplength = 0;
      }
    }

    this.songlen = buffer[950];
    if (buffer[951] !== 127) {
      this.repeatpos = buffer[951];
    }

    for (let i = 0; i < 128; i += 1) {
      this.patterntable[i] = buffer[952 + i];
      if (this.patterntable[i] > this.patterns) {
        this.patterns = this.patterntable[i];
      }
    }
    this.patterns += 1;
    const patlen = 4 * 64 * this.channels;

    this.pattern = new Array();
    this.note = new Array();
    this.pattern_unpack = new Array();

    for(let i = 0; i < this.patterns; i += 1) {
      this.pattern[i] = new Uint8Array(patlen);
      this.note[i] = new Uint8Array(this.channels * 64);
      this.pattern_unpack[i] = new Uint8Array(this.channels * 64 * 5);

      for (let j = 0; j < patlen; j += 1) {
        this.pattern[i][j] = buffer[1084 + i * patlen + j];
      }

      for (let j = 0; j < 64; j += 1) {
        for (let c = 0; c < this.channels; c += 1) {
          this.note[i][j * this.channels + c] = 0;
          // tslint:disable-next-line: no-bitwise max-line-length
          const n = (this.pattern[i][j * 4 * this.channels + c * 4] & 0x0f) << 8 | this.pattern[i][j * 4 * this.channels + c * 4 + 1];
          for (let np = 0; np < this.baseperiodtable.length; np += 2) {
            if (n === this.baseperiodtable[np]) {
              this.note[i][j * this.channels + c] = np;
            }
          }
        }
      }

      for (let j = 0; j < 64; j += 1) {
        for (let c = 0; c < this.channels; c += 1) {
          const pp = j * 4 * this.channels + c * 4;
          const ppu = j * 5 * this.channels + c * 5;
          let n = (this.pattern[i][pp] & 0x0f) << 8 | this.pattern[i][pp + 1];
          if (n) {
            n = this.note[i][j * this.channels + c];
            n = (n % 12) | (Math.floor(n / 12) + 2) << 4;
          }
          this.pattern_unpack[i][ppu + 0] = (n) ? n : 255;
          this.pattern_unpack[i][ppu + 1] = this.pattern[i][pp + 0] & 0xf0 | this.pattern[i][pp + 2] >> 4;
          this.pattern_unpack[i][ppu + 2] = 255;
          this.pattern_unpack[i][ppu + 3] = this.pattern[i][pp + 2] & 0x0f;
          this.pattern_unpack[i][ppu + 4] = this.pattern[i][pp + 3];
        }
      }
    }

    let sst = 1084 + this.patterns * patlen;
    for (let i = 0; i < this.samples; i += 1) {
      this.sample[i].data = new Float32Array(this.sample[i].length);
      for (let j = 0; j < this.sample[i].length; j += 1) {
        let q = buffer[sst + j];
        if (q < 128) {
          q = q / 128.0;
        } else {
          q = ((q - 128) / 128.0) - 1.0;
        }
        this.sample[i].data[j] = q;
      }
      sst += this.sample[i].length;
    }

    // look ahead at very first row to see if filter gets enabled
    this.filter = false;
    for (let ch = 0; ch < this.channels; ch++) {
      const p = this.patterntable[0];
      const pp = ch * 4;
      const cmd = this.pattern[p][pp + 2] & 0x0f;
      const data = this.pattern[p][pp + 3];
      if (cmd === 0x0e && ((data & 0xf0) === 0x00)) {
        if (!(data & 0x01)) {
          this.filter = true;
        } else {
          this.filter = false;
        }
      }
    }
    
    console.log(this);
  }

  /**
   * Efects
   */

  private effectT0_0(mod, ch) {
    // 0 arpeggio
    mod.channel[ch].arpeggio = mod.channel[ch].data;
  }

  private effectT0_1(mod, ch) {
    // 1 slide up
    if (mod.channel[ch].data) {
      mod.channel[ch].slidespeed = mod.channel[ch].data;
    }
  }

  private effectT0_2(mod, ch) {
    // 2 slide down
    if (mod.channel[ch].data) {
      mod.channel[ch].slidespeed = mod.channel[ch].data;
    }
  }

  private effectT0_3(mod, ch) {
    // 3 slide to note
    if (mod.channel[ch].data) {
      mod.channel[ch].slidetospeed = mod.channel[ch].data;
    }
  }

  // tslint:disable: no-bitwise
  private effectT0_4(mod, ch) {
    // 4 vibrato
    if (mod.channel[ch].data & 0x0f && mod.channel[ch].data & 0xf0) {
      mod.channel[ch].vibratodepth = (mod.channel[ch].data & 0x0f);
      mod.channel[ch].vibratospeed = (mod.channel[ch].data & 0xf0) >> 4;
    }
    mod.effectsT1[4](mod, ch);
  }
  // tslint:enable: no-bitwise

  private effectT0_5(mod, ch) {
    // 5
  }

  private effectT0_6(mod, ch) {
    // 6
  }

  private effectT0_7(mod, ch) {
    // 7
  }

  // tslint:disable: no-bitwise
  private effectT0_8(mod, ch) {
    // 8 unused, used for syncing
    mod.syncqueue.unshift(mod.channel[ch].data & 0x0f);
  }
  // tslint:enable: no-bitwise

  private effectT0_9(mod, ch) {
    // 9 set sample offset
    mod.channel[ch].samplepos = mod.channel[ch].data * 256;
  }

  private effectT0_a(mod, ch) {
    // a
  }

  private effectT0_b(mod, ch) {
    // b pattern jump
    mod.breakrow = 0;
    mod.patternjump = mod.channel[ch].data;
    mod.flags |= 16;
  }

  private effectT0_c(mod, ch) {
    // c set volume
    mod.channel[ch].volume = mod.channel[ch].data;
  }

  private effectT0_d(mod, ch) {
    // d pattern break
    mod.breakrow = ((mod.channel[ch].data & 0xf0) >> 4) * 10 + (mod.channel[ch].data & 0x0f);
    if (!(mod.flags & 16)) {
      mod.patternjump = mod.position + 1;
    }
    mod.flags |= 16;
  }

  private effectT0E(mod, ch) {
    // e
    var i = (mod.channel[ch].data & 0xf0) >> 4;
    mod.effectsT0E[i](mod, ch);
  }

  private effectT0_f(mod, ch) {
    // f set speed
    if (mod.channel[ch].data > 32) {
      mod.bpm = mod.channel[ch].data;
    } else {
      if (mod.channel[ch].data) {
        mod.speed = mod.channel[ch].data;
      }
    }
  }



  private effectT0E0(mod, ch) { // e0 filter on/off
    if (mod.channels > 4) return; // use only for 4ch amiga tunes
    if (mod.channel[ch].data&0x01) {
      mod.filter=false;
    } else {
      mod.filter=true;
    }
  }

  private effectT0E1(mod, ch) { // e1 fine slide up
    mod.channel[ch].period-=mod.channel[ch].data&0x0f;
    if (mod.channel[ch].period < 113) mod.channel[ch].period=113;
  }

  private effectT0E2(mod, ch) { // e2 fine slide down
    mod.channel[ch].period+=mod.channel[ch].data&0x0f;
    if (mod.channel[ch].period > 856) mod.channel[ch].period=856;
    mod.channel[ch].flags|=1;
  }

  private effectT0E3(mod, ch) { // e3 set glissando
  }

  private effectT0E4(mod, ch) { // e4 set vibrato waveform
    mod.channel[ch].vibratowave=mod.channel[ch].data&0x07;
  }

  private effectT0E5(mod, ch) { // e5 set finetune
  }

  private effectT0E6(mod, ch) { // e6 loop pattern
    if (mod.channel[ch].data&0x0f) {
      if (mod.loopcount) {
        mod.loopcount--;
      } else {
        mod.loopcount=mod.channel[ch].data&0x0f;
      }
      if (mod.loopcount) mod.flags|=64;
    } else {
      mod.looprow=mod.row;
    }
  }

  private effectT0E7(mod, ch) { // e7
  }

  private effectT0E8(mod, ch) { // e8, use for syncing
    mod.syncqueue.unshift(mod.channel[ch].data&0x0f);
  }

  private effectT0E9(mod, ch) { // e9
  }

  private effectT0Ea(mod, ch) { // ea fine volslide up
    mod.channel[ch].volume+=mod.channel[ch].data&0x0f;
    if (mod.channel[ch].volume > 64) mod.channel[ch].volume=64;
  }

  private effectT0Eb(mod, ch) { // eb fine volslide down
    mod.channel[ch].volume-=mod.channel[ch].data&0x0f;
    if (mod.channel[ch].volume < 0) mod.channel[ch].volume=0;
  }

  private effectT0Ec(mod, ch) { // ec
  }

  private effectT0Ed(mod, ch) { // ed delay sample
    if (mod.tick==(mod.channel[ch].data&0x0f)) {
      // start note
      var p=mod.patterntable[mod.position];
      var pp=mod.row*4*mod.channels + ch*4;
      n=(mod.pattern[p][pp]&0x0f)<<8 | mod.pattern[p][pp+1];
      if (n) {
        mod.channel[ch].period=n;
        mod.channel[ch].voiceperiod=mod.channel[ch].period;
        mod.channel[ch].samplepos=0;
        if (mod.channel[ch].vibratowave>3) mod.channel[ch].vibratopos=0;
        mod.channel[ch].flags|=3; // recalc speed
        mod.channel[ch].noteon=1;
      }
      n=mod.pattern[p][pp+0]&0xf0 | mod.pattern[p][pp+2]>>4;
      if (n) {
        mod.channel[ch].sample=n-1;
        mod.channel[ch].volume=mod.sample[n-1].volume;
      }
    }
  }

  private effectT0Ee(mod, ch) { // ee delay pattern
    mod.patterndelay = mod.channel[ch].data & 0x0f;
    mod.patternwait = 0;
  }

  private effectT0Ef(mod, ch) { // ef
  }


  private effectT1_0(mod, ch) { // 0 arpeggio
    if (mod.channel[ch].data) {
      let apn = mod.channel[ch].note;
      if ((mod.tick % 3) == 1) {
        apn += mod.channel[ch].arpeggio >> 4;
      }
      if ((mod.tick % 3) == 2) {
        apn += mod.channel[ch].arpeggio & 0x0f;
      }
      if (apn >= 0 && apn <= mod.baseperiodtable.length) {
        mod.channel[ch].voiceperiod = mod.baseperiodtable[apn];
      }
      mod.channel[ch].flags |= 1;
    }
  }
  private effectT1_1(mod, ch) { // 1 slide up
    mod.channel[ch].period-=mod.channel[ch].slidespeed;
    if (mod.channel[ch].period<113) mod.channel[ch].period=113;
    mod.channel[ch].flags|=3; // recalc speed
  }
  private effectT1_2(mod, ch) { // 2 slide down
    mod.channel[ch].period+=mod.channel[ch].slidespeed;
    if (mod.channel[ch].period>856) mod.channel[ch].period=856;
    mod.channel[ch].flags|=3; // recalc speed
  }
  private effectT1_3(mod, ch) { // 3 slide to note
    if (mod.channel[ch].period < mod.channel[ch].slideto) {
      mod.channel[ch].period+=mod.channel[ch].slidetospeed;
      if (mod.channel[ch].period > mod.channel[ch].slideto)
        mod.channel[ch].period=mod.channel[ch].slideto;
    }
    if (mod.channel[ch].period > mod.channel[ch].slideto) {
      mod.channel[ch].period-=mod.channel[ch].slidetospeed;
      if (mod.channel[ch].period<mod.channel[ch].slideto)
        mod.channel[ch].period=mod.channel[ch].slideto;
    }
    mod.channel[ch].flags|=3; // recalc speed
  }
  private effectT1_4(mod, ch) { // 4 vibrato
    var waveform=mod.vibratotable[mod.channel[ch].vibratowave&3][mod.channel[ch].vibratopos]/63.0; //127.0;
  
    // two different implementations for vibrato
  //  var a=(mod.channel[ch].vibratodepth/32)*mod.channel[ch].semitone*waveform; // non-linear vibrato +/- semitone
    var a=mod.channel[ch].vibratodepth*waveform; // linear vibrato, depth has more effect high notes
  
    mod.channel[ch].voiceperiod+=a;
    mod.channel[ch].flags|=1;
  }
  private effectT1_5(mod, ch) { // 5 volslide + slide to note
    mod.effectT1_3(mod, ch); // slide to note
    mod.effectT1_a(mod, ch); // volslide
  }
  private effectT1_6(mod, ch) { // 6 volslide + vibrato
    mod.effectT1_4(mod, ch); // vibrato
    mod.effectT1_a(mod, ch); // volslide
  }
  private effectT1_7(mod, ch) { // 7
  }
  private effectT1_8(mod, ch) { // 8 unused
  }
  private effectT1_9(mod, ch) { // 9 set sample offset
  }
  private effectT1_a(mod, ch) { // a volume slide
    if (!(mod.channel[ch].data&0x0f)) {
      // y is zero, slide up
      mod.channel[ch].volume+=(mod.channel[ch].data>>4);
      if (mod.channel[ch].volume>64) mod.channel[ch].volume=64;
    }
    if (!(mod.channel[ch].data&0xf0)) {
      // x is zero, slide down
      mod.channel[ch].volume-=(mod.channel[ch].data&0x0f);
      if (mod.channel[ch].volume<0) mod.channel[ch].volume=0;
    }
  }
  private effectT1_b(mod, ch) { // b pattern jump
  }
  private effectT1_c(mod, ch) { // c set volume
  }
  private effectT1_d(mod, ch) { // d pattern break
  }
  private effectT1E(mod, ch) { // e
    var i=(mod.channel[ch].data&0xf0)>>4;
    mod.effectsT1_e[i](mod, ch);
  }
  private effectT1_f(mod, ch) { // f
  }
  
  

  private effectT1E0(mod, ch) { // e0
  }
  private effectT1E1(mod, ch) { // e1
  }
  private effectT1E2(mod, ch) { // e2
  }
  private effectT1E3(mod, ch) { // e3
  }
  private effectT1E4(mod, ch) { // e4
  }
  private effectT1E5(mod, ch) { // e5
  }
  private effectT1E6(mod, ch) { // e6
  }
  private effectT1E7(mod, ch) { // e7
  }
  private effectT1E8(mod, ch) { // e8
  }
  private effectT1E9(mod, ch) { // e9 retrig sample
    if (mod.tick%(mod.channel[ch].data&0x0f)==0)
      mod.channel[ch].samplepos=0;
  }
  private effectT1Ea(mod, ch) { // ea
  }
  private effectT1Eb(mod, ch) { // eb
  }
  private effectT1Ec(mod, ch) { // ec cut sample
    if (mod.tick==(mod.channel[ch].data&0x0f))
      mod.channel[ch].volume=0;
  }
  private effectT1Ed(mod, ch) { // ed delay sample
    mod.effectT0Ed(mod, ch);
  }
  private effectT1Ee(mod, ch) { // ee
  }
  private effectT1Ef(mod, ch) { // ef
  }
}

export { Protracker };
