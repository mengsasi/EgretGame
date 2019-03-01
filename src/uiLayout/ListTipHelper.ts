class ListTipHelper {

	public static uiTips: UIListTips;

	static onTapTip(list: eui.List, item, create: Function, callback: Function = null) {
		if (this.uiTips) {
			if (list.contains(this.uiTips)) {
				list.removeChild(this.uiTips);
				if (this.uiTips.TipId == item.id) {
					this.uiTips.deInit();
					if (list['scrollToOriginal']) {
						list['scrollToOriginal']();
						list['scrollToOriginal'] = null;
					}
					this.uiTips = null;
					return false;
				}
			}
			this.uiTips = null;
		}
		this.uiTips = create();
		list.addChild(this.uiTips);
		this.uiTips.ShowItem(item, (data) => {
			if (callback) {
				callback(data);
			}
		});

		list['scrollToPosition'] = (data) => {
			let extraY = data.extraY;
			let extraHeight = data.extraHeight;
			let height = list.height;

			let scrollPos = list.scrollV;//当前滑动位置

			let listBottom = scrollPos + height;//list最下边
			let tipBottom = extraY + extraHeight;

			if (tipBottom > listBottom) {
				list.validateNow();
				let offset = tipBottom - listBottom;
				let newScroll = scrollPos + offset;
				list.scrollV = newScroll;
				list['scrollToOriginal'] = () => {
					list.validateNow();
					list.scrollV = scrollPos;
				}
			}
		};
		return true;
	}

	static clearTips(list: Array<eui.List>) {
		let contain = false;
		for (let l of list) {
			if (l.contains(this.uiTips)) {
				l.removeChild(this.uiTips);
				contain = true;
			}
			if (l['scrollToOriginal']) {
				l['scrollToOriginal']();
				l['scrollToOriginal'] = null;
			}
		}
		if (this.uiTips && contain) {
			this.uiTips.deInit();
		}
	}

	//this.selectedIndex = this.list.selectedIndex;
	static checkSelectedIndex(list, collection, selectedId, selectedIndex = -1) {
		if (selectedIndex != -1 && ListTipHelper.uiTips) {
			list.validateNow();
			let index = 0;
			let items = collection.source;
			for (let i in items) {
				let item = items[i];
				if (item.id == selectedId) {
					break;
				}
				index++;
			}
			if (selectedIndex != index) {
				list.selectedIndex = index;
				if (list.contains(ListTipHelper.uiTips)) {
					list.removeChild(ListTipHelper.uiTips)
					list.addChild(ListTipHelper.uiTips)
				}
			}
		}
	}
}