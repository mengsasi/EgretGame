module Sound {

	enum SoundState {
		Null,
		Play,
		Stop,
		Pause
	}

	export class SoundPlayer extends egret.DisplayObjectContainer implements ISoundBase {

		public Init() {
			SoundManager.Instance.Register(this);
		}

		private source: string = "";
		public set Source(value: string) {
			this.source = value;
			SoundManager.Instance.CheckSound(value, () => {
				this.sound = RES.getRes(value);
			});
		}

		private loops: number;
		private sound: egret.Sound;
		private channel: egret.SoundChannel;

		public get Volume(): number {
			if (this.channel) {
				return this.channel.volume;
			}
			return 0;
		}

		public set Volume(value: number) {
			if (this.channel) {
				this.channel.volume = SoundManager.SetVolume(value);
			}
		}

		private state: SoundState = SoundState.Null;

		//循环播放，loop = -1
		public Play(res: string, loop: number = 1, callback: Function = null) {
			if (this.state == SoundState.Play) {
				this.Stop();
			}
			if (SoundManager.Instance.IsMuteSoundFx) {
				return;
			}
			if (this.sound && this.source == res) {
				this.playSound(loop, callback);
			}
			else {
				this.source = res;
				SoundManager.Instance.CheckSound(res, () => {
					this.sound = RES.getRes(res);
					this.playSound(loop, callback);
				});
			}
			this.loops = loop;
		}

		private playSound(loop: number = 1, callback: Function = null) {
			if (!this.sound) {
				return;
			}
			this.channel = this.sound.play(this.position, loop);
			this.Volume = SoundManager.Instance.SoundFxVolume;
			this.channel.once(egret.Event.SOUND_COMPLETE, () => {
				if (loop != -1) {
					this.Stop();
					if (callback) {
						callback();
					}
				}
			}, this);
			this.state = SoundState.Play;
		}

		public Stop() {
			if (this.channel) {
				this.channel.stop();
				this.channel = null;
			}
			this.position = 0;
			this.state = SoundState.Stop;
		}

		public Destroy() {
			SoundManager.Instance.UnRegister(this);
			this.Stop();
			this.sound = null;
		}

		private position: number = 0;

		public Pause() {
			if (this.channel) {
				this.position = this.channel.position;
				this.channel.stop();
				this.state = SoundState.Pause;
			}
		}

		public Resume() {
			if (this.state == SoundState.Pause) {
				this.Play(this.source, this.loops);
			}
		}
	}
}