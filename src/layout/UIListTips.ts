class UIListTips extends eui.Component implements eui.UIComponent {

	protected tipData;
	protected func: Function;

	get TipId() {
		if (this.tipData) {
			return this.tipData.id;
		}
		return null;
	}

	protected state;
	private setWindowType(state) {
		this.currentState = state;
		this.validateNow();
	}

	public ShowItem(data, fun: Function = null) {
		this.initData(data);
		this.func = fun;
		this.initState();
		this.updateUI();
	}

	protected initData(data) {
		this.tipData = data;
	}

	protected initState() {
		this.setWindowType(this.state);
	}

	protected updateUI() {

	}

	protected funcInvoke(parameter = null) {
		if (this.func) {
			this.func(parameter);
		}
	}

	public deInit() {

	}
}