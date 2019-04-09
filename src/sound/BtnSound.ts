class BtnSound extends eui.Button {

	private $sourceId: string = '';
	public get sourceId(): string {
		return this.$sourceId;
	}

	public set sourceId(value: string) {
		this.$sourceId = value;
	}

	private $source: string = '';
	public get source(): string {
		return this.$source;
	}

	public set source(value: string) {
		this.$source = value;
	}

	private soundPlayer: Sound.SoundPlayer;

	public constructor() {
		super();
		this.soundPlayer = new Sound.SoundPlayer();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
			this.soundPlayer.Init();
		}, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
			this.soundPlayer.Destroy();
		}, this);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		//if (this.sourceId) {
		//	let conf = musicConfigs.GetConfig(this.sourceId);
		//	this.source = conf ? conf.filename : '';
		//}
		// if (this.source && this.source != '') {
		// 	this.soundPlayer.Source = this.source;
		// }
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.Play();
		}, this);
	}

	public Play(loop: number = 1): void {
		if (this.source && this.source != '') {
			this.soundPlayer.Play(this.source, loop);
		}
	}

}