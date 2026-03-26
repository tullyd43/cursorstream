

export default class CursorInspector {
	constructor(CursorAPI) {
		this.CursorAPI = CursorAPI;
	}

    get statusSubscribers() { return this.CursorAPI.BroadcastRegistry.statusSubscribers; }
	get intentSubscribers() {
		return this.CursorAPI.BroadcastRegistry.intentSubscribers;
	}
	get commitSubscribers() {
		return this.CursorAPI.BroadcastRegistry.commitSubscribers;
	}
	get cancelSubscribers() {
		return this.CursorAPI.BroadcastRegistry.cancelSubscribers;
	}
}