module Sound {

	export class PlaySoundFx extends eui.Component implements eui.UIComponent {

		public constructor() {
			super();
			this.soundPlayer = new SoundPlayer();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
				this.soundPlayer.Init();
			}, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
				this.Destroy();
			}, this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.initSound();
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.Play();
			}, this);
			// this.initMask();
		}

		public Destroy() {
			this.soundPlayer.Destroy();
		}

		private initSound() {
			if (this.Source) {
				this.SetSource(this.Source);
			}
		}

		// private initMask() {
		// 	let mask = new egret.Shape();
		// 	let w = this.width;
		// 	let h = this.height;
		// 	mask.width = w;
		// 	mask.height = h;
		// 	mask.graphics.beginFill(0x000000, 0);
		// 	mask.graphics.drawRect(0, 0, w, h);
		// 	mask.graphics.endFill();
		// 	this.addChild(mask);

		// 	mask.touchEnabled = true;
		// 	mask.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
		// 		this.Play();
		// 	}, this);
		// }

		private soundPlayer: SoundPlayer;

		public Source: string = "";

		public SetSource(value: string) {
			this.Source = value;
			this.soundPlayer.Source = value;
		}

		public get Volume(): number {
			return this.soundPlayer.Volume;
		}

		public set Volume(value: number) {
			this.soundPlayer.Volume = value;
		}

		public Play(loop: number = 1): void {
			this.soundPlayer.Play(this.Source, loop);
		}

		public Stop() {
			this.soundPlayer.Stop();
		}

		public Pause() {
			this.soundPlayer.Pause();
		}

		public Resume() {
			this.soundPlayer.Resume();
		}
	}
}