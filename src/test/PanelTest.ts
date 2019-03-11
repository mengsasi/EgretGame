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

	private groupScroll: eui.Group;
	protected comScroll: UIScrollView;

	public constructor() {
		super();
		this.skinName = panel.ScrollPanelTestSkin;
		this.percentWidth = 100;
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		let panel = this;
		PanelTest.DEBUG_AddKeyDownListener('a', () => {

			panel.comScroll.scrollToDirection('right');

		});

		PanelTest.DEBUG_AddKeyDownListener('d', () => {

			panel.comScroll.scrollToDirection('left');

		});

		PanelTest.DEBUG_AddKeyDownListener('s', () => {

			let source = [];
			source.push('0');
			source.push('0');
			source.push('0');
			source.push('0');
			source.push('0');
			source.push('0');
			panel.comScroll.source = source;
			panel.comScroll.refresh();

		});

	}

	async asyncShow() {
		
		// this.groupScroll.validateNow();
		this.updateUI();
	}

	protected updateUI() {
		let source = [];
		source.push('0');
		source.push('0');
		source.push('0');
		source.push('0');
		source.push('0');
		source.push('0');

		// this.comScroll.itemRenderer = '';
		// this.comScroll.itemRendererSkinName = panel.TestPageSkin;
		this.comScroll.itemRendererSkinName = panel.ScrollPanelTestImageSkin;
		this.comScroll.source = source;
		this.comScroll.refresh();
	}

	closePanel() {
		PanelTest.instance = null;
	}


	static DEBUG_AddKeyDownListener(key, callback) {
		document.addEventListener("keydown", function (event: KeyboardEvent) {
			if (event.key == key && callback != null) {
				callback();
			}
		})
	}

}