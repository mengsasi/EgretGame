module Sound {

	export class SoundTrackPlayer extends egret.DisplayObjectContainer implements ISoundBase {

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

		public Track: string;
		private source: string;
		private loops: number;
		private isPlaying: boolean;

		public Play(res: string = null, loop: number = 1, callback: Function = null) {
			if (SoundManager.Instance.IsMuteMusic) {
				return;
			}
			if (this.sound && this.source == res) {
				if (this.channel && this.isPlaying) {
					return;
				}
				else {
					this.playSound(loop, callback);
				}
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

		private async playSound(loop: number = 1, callback: Function = null) {
			if (this.channel && this.isPlaying) {
				await this.channelFade(this.channel, 0);
			}
			if (!this.sound) {
				return;
			}
			this.channel = this.sound.play(this.position, loop);
			this.channel.volume = 0;
			let volume = SoundManager.Instance.MusicVolume;
			await this.channelFade(this.channel, volume, 1000);
			this.channel.once(egret.Event.SOUND_COMPLETE, () => {
				if (loop != -1) {
					this.Stop();
					if (callback) {
						callback();
					}
				}
			}, this);
			this.isPlaying = true;
		}

		private async channelFade(channel: egret.SoundChannel, volume, duration = 500) {
			if (duration == 0) {
				if (volume == 0) {
					egret.Tween.removeTweens(channel);
					channel.stop();
				}
			}
			else {
				await alien.EgretUtils.getTweenPromise(
					egret.Tween
						.get(channel, null, null, true)
						.to({ volume }, duration)
				);
			}
			/*if (duration == 0) {
				if (volume == 0) {
					egret.Tween.removeTweens(channel);
					channel.stop();
				}
			}
			else {
				let fade = () => {
					let tw = egret.Tween.get(channel, null, null, true);
					tw.to({ volume }, duration);
					//tw.call(change, this);
				}
				fade();
			}*/
		}

		private position: number = 0;

		public Stop() {
			this.isPlaying = false;
			this.source = null;
			if (this.channel) {
				if (this.Track == SoundManager.BGMTrack) {
					this.position = this.channel.position;
				}
				this.channelFade(this.channel, 0, 0);
				this.channel = null;
			}
		}

		public Destroy() {
			this.Stop();
			this.sound = null;
		}
	}
}