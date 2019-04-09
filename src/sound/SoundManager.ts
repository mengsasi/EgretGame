module Sound {
	export interface ISoundBase {
		Volume: number;
	}

	export class SoundManager {

		public constructor() {
			this.soundFxs = new Array<SoundPlayer>();
			this.musics = {};
			this.LoadData();
		}

		private static instance: SoundManager;
		public static get Instance(): SoundManager {
			if (this.instance == null) {
				this.instance = new SoundManager();
			}
			return this.instance;
		}

		private isMuteMusic: boolean = false;
		private isMuteSoundFx: boolean = false;

		private musicVolume: number = 1;
		private soundFxVolume: number = 1;

		private LoadData(): void {
			let setting = LocalData.Instance.soundSetting;
			if (setting) {
				this.isMuteMusic = setting["isMuteMusic"] ? setting["isMuteMusic"] : false;
				this.isMuteSoundFx = setting["isMuteSoundFx"] ? setting["isMuteSoundFx"] : false;
			}
		}

		private Save(): void {
			let setting = {};
			setting["isMuteMusic"] = this.isMuteMusic;
			setting["isMuteSoundFx"] = this.isMuteSoundFx;
			LocalData.Instance.soundSetting = setting;
		}

		private UnSave(): void {
			this.LoadData();
		}

		public get MusicVolume(): number {
			return this.musicVolume;
		}

		public set MusicVolume(value: number) {
			this.musicVolume = value;
			for (let i in this.musics) {
				this.musics[i].Volume = value;
			}
		}

		public get SoundFxVolume(): number {
			return this.soundFxVolume;
		}

		public set SoundFxVolume(value: number) {
			this.soundFxVolume = value;
			for (let i = 0; i < this.soundFxs.length; i++) {
				this.soundFxs[i].Volume = value;
			}
		}

		public get IsMuteMusic() {
			return this.isMuteMusic;
		}

		public set IsMuteMusic(value: boolean) {
			this.isMuteMusic = value;
			this.Save();
			if (value == false) {
				this.PlayBgm(this.bgmSource);
				return;
			}
			for (let i in this.musics) {
				this.musics[i].Stop();
			}
		}

		public get IsMuteSoundFx() {
			return this.isMuteSoundFx;
		}

		public set IsMuteSoundFx(value: boolean) {
			this.isMuteSoundFx = value;
			this.Save();
			if (value == false) {
				return;
			}
			for (let i = 0; i < this.soundFxs.length; i++) {
				this.soundFxs[i].Stop();
			}
		}

		private soundFxs: Array<SoundPlayer>;

		public Register(sound: SoundPlayer): void {
			let index = this.soundFxs.indexOf(sound);
			if (index == -1) {
				this.soundFxs.push(sound);
			}
		}

		public UnRegister(sound: SoundPlayer): void {
			let index = this.soundFxs.indexOf(sound);
			if (index != -1) {
				this.soundFxs.splice(index, 1);
			}
		}

		public LoadSound(path: string, callback: Function = null): egret.Sound {
			if (path == null || path == "") {
				return null;
			}
			let sound: egret.Sound = new egret.Sound();
			sound.addEventListener(egret.Event.COMPLETE, function loadOver(event: egret.Event) {
				if (callback) {
					callback();
				}
			}, this);
			sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event: egret.IOErrorEvent) {
				console.log(`loaded error! path: ${path}`);
			}, this);
			sound.load(path);//resource/sound/sound.mp3
			return sound;
		}

		public CheckSound(key: string, callback: Function = null): void {
			if (RES.getRes(key)) {
				if (callback) {
					callback();
				}
			}
			else {
				//加载
				// RES.getResAsync(key, (music: egret.Sound) => {
				// 	if (callback) {
				// 	callback();
				// }
				// }, this);
			}
		}

		public static BGMTrack: string = 'bgm';
		private musics: { [key: string]: SoundTrackPlayer };

		private bgmSource: string;
		public PlayBgm(res: string) {
			if (res == null || res == "") {
				return;
			}
			this.bgmSource = res;
			this.PlayMusic(res, SoundManager.BGMTrack, -1);
		}

		//播音效
		public PlaySoundFx(res: string, loop: number = 1, callback: Function = null): SoundPlayer {
			let player: SoundPlayer = new SoundPlayer();
			player.Init();
			player.Play(res, loop, () => {
				if (callback) {
					callback();
				}
				player.Destroy();
			});
			return player;
		}

		//播音乐
		//循环播放loop -1
		public PlayMusic(res: string, track: string = null, loop: number = 1, callback: Function = null): SoundTrackPlayer {
			if (track == null) {
				track = res;
			}
			let player: SoundTrackPlayer = null;
			if (this.musics[track] == null) {
				player = new SoundTrackPlayer();
				player.Track = track;
				this.musics[track] = player;
			}
			else {
				player = this.musics[track];
			}
			player.Play(res, loop, callback);
			return player;
		}

		public StopMusic(track: string) {
			let player = this.musics[track]
			if (player != null) {
				player.Destroy();
				//delete this.musics[track];
			}
		}

		static SetVolume(volume: number): number {
			if (volume < 0) {
				volume = 0;
			}
			else if (volume > 1) {
				volume = 1;
			}
			return volume;
		}

	}
}