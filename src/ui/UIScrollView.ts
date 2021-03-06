//移动灵敏度
let scrollSensitivity = 1.25;
//滑动检测距离
let scrollHDetectionDistance = 10;
//移动距离大于此值，翻页
let turnPageDistance = 20;

/*
 * this.percentWidth = 100;面板全屏宽度
 * 不是全屏，需要加一个mask
 * 第一次打开页面，需要父物体的Group,validateNow()一下
 */

class UIScrollView extends UIView {

	private _itemScale: number = 0.7;
	public get itemScale(): number {
		return this._itemScale;
	}
	public set itemScale(value: number) {
		this._itemScale = value;
	}

	private _scaleOffset: number = 0.24;
	public get scaleOffset(): number {
		return this._scaleOffset;
	}
	public set scaleOffset(value: number) {
		this._scaleOffset = value;
	}

	private _gap: number = 16;
	public get gap(): number {
		return this._gap;
	}
	public set gap(value: number) {
		this._gap = value;
	}

	/*
	 * 是否是全屏板 panel.percentWidth = 100?
	 */
	private _isStageWidth: boolean = false;
	public get isStageWidth(): boolean {
		return this._isStageWidth;
	}
	public set isStageWidth(value: boolean) {
		this._isStageWidth = value;
	}

	/*
	 * 是否是用父物体高度一半，还是自己有Y
	 */
	private _isStageHeight: boolean = false;
	public get isStageHeight(): boolean {
		return this._isStageHeight;
	}
	public set isStageHeight(value: boolean) {
		this._isStageHeight = value;
	}

	private get calculateWidth(): number {
		return this._isStageWidth ? this.stageWidth : this.width;
	}

	public constructor() {
		super();
	}

	protected register() {
		let container = this.container;
		container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
		container.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
		container.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
	}

	protected unregister() {
		let container = this.container;
		container.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
		container.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
		container.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
	}

	protected render(): void {
		this.unregister();
		this.update();
		if (this.items.length > 1) {
			this.register();
		}
	}

	protected update() {
		super.update();
	}

	protected updateDisplay() {
		this.updateDisplayScale();
		this.updateDisplayPosition();
	}

	protected updateDisplayScale() {
		let max = 1 + this._scaleOffset;
		let _container = this.container;
		let numChildren = this.listUIItems.length;
		for (let i = 0; i < numChildren; i++) {
			let uiItem = this.listUIItems[i];
			if (i == 0) {
				this.setItemScale(uiItem, max);
			}
			else {
				this.setItemScale(uiItem, 1);
			}
		}
	}

	protected updateDisplayPosition() {
		let startPos = 0;
		let gap = this._gap;
		let useY;
		if (this._isStageHeight) {
			useY = this.parent.height / 2;
		}
		else {
			useY = this.y;
		}
		let selfY = this.y;
		let _container = this.container;
		let paddingLeft = this.getPaddingStage();

		startPos += paddingLeft;
		let numChildren = this.listUIItems.length;
		for (let i = 0; i < numChildren; i++) {
			let uiItem = this.listUIItems[i];
			uiItem.x = startPos;
			uiItem.y = useY - uiItem.height * uiItem.scaleX / 2;
			startPos += uiItem.width * uiItem.scaleX;
			startPos += gap;
		}
	}

	private touchPositionX: number;
	private lastPosition: number;
	private checkScroll: boolean = false;//检测到移动

	/**
	 * 记录按下的对象，touchCancle时使用
	 */
	private downTarget: egret.DisplayObject;

	private tempStage: egret.Stage;

	private resetTouch() {
		this.lastPosition = -1;
		this.checkScroll = false;
	}

	private onTouchBeginCapture(event: egret.TouchEvent): void {
		if (!this.$stage) {
			return;
		}
		this.touchPositionX = event.stageX;
		this.onTouchBegin(event);
	}

	private onTouchEndCapture(event: egret.TouchEvent): void {
		this.onTouchEnd(event);
	}

	private onTouchTapCapture(event: egret.TouchEvent): void {
		this.onRemoveListeners();
	}

	private onTouchBegin(event: egret.TouchEvent): void {
		if (event.isDefaultPrevented()) {
			return;
		}
		this.downTarget = event.target;
		let stage = this.$stage;
		stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
		this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
		stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		this.tempStage = stage;

		this.lastPosition = -1;
	}

	private onTouchMove(event: egret.TouchEvent): void {
		if (!this.checkScroll) {
			let posX = event.stageX;
			let offsetX = posX - this.touchPositionX;
			if (Math.abs(offsetX) > scrollHDetectionDistance) {
				egret.Tween.removeTweens(this);
				this.checkScroll = true;
			}
		}
		if (this.checkScroll) {
			this.onScroll(event);
		}
	}

	private onTouchCancel(event: egret.TouchEvent): void {
		this.onRemoveListeners();
	}

	private onTouchEnd(event: egret.TouchEvent): void {
		this.onRemoveListeners();
		this.onScrollEnd(event);
	}

	private onRemoveListeners(): void {
		this.resetTouch();
		let stage = this.tempStage || this.$stage;
		stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
		this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
		stage.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
	}

	private isScroll = false;

	private onScroll(event) {
		let posX = event.stageX;
		if (this.lastPosition == -1) {
			this.lastPosition = posX;
		}
		this.scrollContainer(posX);
		this.scrollScaleChild();
		this.isScroll = true;
	}

	private onScrollEnd(event) {
		if (this.isScroll) {
			if (!this.$stage) {
				return;
			}
			let posX = event.stageX;
			let offset = posX - this.touchPositionX;
			let dir = offset > 0 ? 1 : -1;
			let move: boolean = Math.abs(offset) > turnPageDistance;

			this.scrollToPos(dir, move);
			this.isScroll = false;
		}
	}

	private scrollContainer(touchPoint: number): void {
		let _container = this.container;
		let disMove = touchPoint - this.lastPosition;
		let scrollPos = disMove * scrollSensitivity + _container.x;
		this.lastPosition = touchPoint;
		this.setScrollPosX(scrollPos);
	}

	private setScrollPosX(scrollPos) {
		if (scrollPos > 0) {
			scrollPos = 0;
		}
		else {
			let contentWidth = this.getContentWidth();
			let limit = this.calculateWidth - contentWidth;
			if (scrollPos < limit) {
				scrollPos = limit;
			}
		}
		this.container.x = scrollPos;
	}

	private scrollScaleChild() {
		let _container = this.container;
		let midX: number = Math.abs(_container.x) + this.calculateWidth / 2;
		let count: number = _container.numChildren;
		for (let i: number = 0; i < count; i++) {
			let uiItem = _container.getChildAt(i);
			let width = uiItem.width * uiItem.scaleX;
			let dist: number = Math.abs(midX - uiItem.x - width / 2);
			if (dist > width) {
				this.setItemScale(uiItem, 1);
			}
			else {
				let ss: number = 1 + (1 - dist / width) * this._scaleOffset;
				this.setItemScale(uiItem, ss);
			}
		}
		this.updateDisplayPosition();
	}

	private tweenScroll: egret.Tween;
	private containerPosX: number;

	private scrollToPos(dir: number, move: boolean, offset: boolean = false) {
		if (!this.$stage) {
			return;
		}
		let finalPos = this.moveTo(dir, move, offset);
		let scroll = this;
		this.containerPosX = this.container.x;
		this.tweenScroll = egret.Tween.get(this, { loop: false, onChange: this.onChange, onChangeObj: this })
			.to({ containerPosX: finalPos }, 200)
			.call(function () {
				// alien.Dispatcher.dispatch('UIScrollView_ScrollEnd', { index: scroll.getSelectedIndex() });
				egret.Tween.removeTweens(scroll);
				scroll.tweenScroll = null;
			});
	}

	//offset：通过按钮移动，不是通过手势移动操作
	private moveTo(dir: number, move: boolean, offset: boolean = false) {
		let count = this.listUIItems.length;
		let curScrollH = Math.abs(this.container.x);
		let gap = this.gap;
		let width = this.getItemWidth();
		let w = width + gap;
		let selectedIndex = 0;
		if (dir > 0) {
			if (offset) {
				curScrollH = Math.abs(curScrollH - w / 2);
			}
			selectedIndex = Math.ceil(curScrollH / w);
			if (move) {
				//selectedIndex--;dir是right
				selectedIndex = selectedIndex - dir;
			}
		}
		else {
			if (offset) {
				curScrollH += w / 2;
			}
			selectedIndex = Math.floor(curScrollH / w);
			if (move) {
				//selectedIndex++;dir是left
				selectedIndex = selectedIndex - dir;//负数，减是加
			}
		}
		if (selectedIndex < 0) {
			selectedIndex = 0;
		}
		if (selectedIndex > count - 1) {
			selectedIndex = count - 1;
		}
		//alien.Dispatcher.dispatch('UIScrollView_ScrollStart', { index: selectedIndex });
		let scrollH = selectedIndex * w;
		return -scrollH;
	}

	private onChange(event: egret.Event) {
		this.setScrollPosX(this.containerPosX);
		this.scrollScaleChild();
		this.isScroll = false;
	}

	private getContentWidth() {
		let paddingLeft = this.getPaddingStage();
		let contentWidth = paddingLeft * 2;
		let gap = this._gap;
		let count = this.listUIItems.length;
		let w = 0;
		if (count > 0) {
			w = (this.getItemWidth() + gap) * (count - 1);
		}
		let max = this.getItemWidth(1 + this._scaleOffset);
		contentWidth += w;
		contentWidth += max;
		return contentWidth;
	}

	//中间项和屏幕/父物体两边宽度
	private getPaddingStage() {
		let stageWidth = this.calculateWidth;
		let itemWidth = this.getItemWidth(1 + this._scaleOffset);
		return (stageWidth - itemWidth) / 2;
	}

	private getItemRealWidth(item: egret.DisplayObject): number {
		return item.width * item.scaleX;
	}

	//1 到 1 + this.scaleOffset
	private getItemWidth(scale: number = 1): number {
		if (this.listUIItems.length <= 0) {
			return 0;
		}
		return this.listUIItems[0].width * this._itemScale * scale;//乘了缩放
	}

	private setItemScale(uiItem: egret.DisplayObject, scale: number) {
		uiItem.scaleX = scale * this._itemScale;
		uiItem.scaleY = scale * this._itemScale;
	}

	public getSelectedIndex() {
		let curScrollH = Math.abs(this.container.x);
		let gap = this.gap;
		let width = this.getItemWidth();
		let w = width + gap;
		return Math.ceil(curScrollH / w);
	}

	/**
	 * left -1 -2
	 * right 1 2 
	 */
	public scrollToDirection(dir: number) {
		this.scrollToPos(dir, true, true);
	}

	/**
	 * 滚动到指定索引 从0开始
	 */
	public scrollToIndex(index: number) {
		let x = this.getSelectedIndex();
		this.scrollToDirection(x - index);
	}

}
