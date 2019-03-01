class PanelTest extends eui.Panel {

	private static instance: PanelTest;
	public static ShowPanel() {
		if (PanelTest.instance) {
			return;
		}
		PanelTest.instance = new PanelTest();
		PanelTest.instance.asyncShow();
		return PanelTest.instance;
	}

	protected comScroll: UIScrollView;

	public constructor() {
		super();
		this.skinName = panel.ScrollPanelTestSkin;
		this.percentWidth = 100;
	}

	protected childrenCreated(): void {
		super.childrenCreated();

	}

	async asyncShow() {
		this.updateUI();
	}

	protected updateUI() {
		let source = [];
		source.push('0');
		source.push('0');
		source.push('0');

		// this.comScroll.itemRenderer = '';
		this.comScroll.itemRendererSkinName = panel.TestPageSkin;
		this.comScroll.source = source;
		this.comScroll.refresh();
	}

	closePanel() {
		PanelTest.instance = null;
	}

}