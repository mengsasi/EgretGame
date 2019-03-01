class UIContainer extends eui.Component {

	protected stageWidth: number;
	protected stageHeight: number;

	public constructor() {
		super();
		this.items = [];
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(): void {
		this.stageWidth = this.stage.stageWidth;
		this.stageHeight = this.stage.stageHeight;
		this.render();
	}

	protected render() {

	}

	protected items: Array<any> = [];
	protected selectedIndex: number = 0;

	public get source(): any[] {
		return this.items;
	}

	public set source(value: any[]) {
		if (!value)
			value = [];
		this.items = value;
	}

	public addItem(item): void {
		this.items.push(item);
	}

	public removeItem(item): void {
		let index = this.items.indexOf(item);
		if (index > 0) this.items.splice(index, 1);
	}

	public getItem(index: number) {
		return this.items[index];
	}

	public getIndexOfItem(item) {
		return this.items.indexOf(item);
	}

	public get length(): number {
		return this.items.length;
	}

	public clear() {
		this.items.splice(0);
		this.selectedIndex = 0;
	}

}