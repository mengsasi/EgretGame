class UIView extends UIContainer {

	public itemRenderer: string = 'eui.Component';
	public itemRendererSkinName: any;

	protected container: UIContainer;
	protected listUIItems: Array<any> = [];

	public constructor() {
		super();
		this.container = new UIContainer();
		this.addChild(this.container);
		this.listUIItems = [];
	}

	public refresh() {
		this.container.x = 0;
		this.render();
	}

	//长度一样的list
	public replaceAll(source: any[]): void {
		this.source = source;
		let items = this.items;
		let uiItems = this.listUIItems;
		let count = uiItems.length;
		for (let i = 0; i < count; i++) {
			let ui = uiItems[i];
			ui['data'] = items[i];
			if (ui.updateUI) {
				ui.updateUI();
			}
		}
	}

	protected render(): void {

	}

	protected update() {
		this.listUIItems.splice(0);
		this.container.removeChildren();
		if (this.itemRendererSkinName == undefined) {
			return;
		}
		let source = this.items;
		for (let item of source) {
			this.addUIItem(item);
		}
		this.updateDisplay();
	}

	private addUIItem(data) {
		let clz: any = egret.getDefinitionByName(this.itemRenderer);
		let uiItem = new clz();
		uiItem.skinName = this.itemRendererSkinName;
		this.container.addChild(uiItem);
		uiItem['data'] = data;
		if (uiItem.updateUI) {
			uiItem.updateUI();
		}
		this.listUIItems.push(uiItem);
	}

	protected updateDisplay() {

	}

}