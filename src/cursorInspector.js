

export default class CursorInspector {
	#broadcastRegistry;
	#payloadRegistry;
	#cursorBroadcast;
	constructor(CursorAPI) {
		this.#broadcastRegistry = CursorAPI.broadcastRegistry;
		this.#payloadRegistry = CursorAPI.payloadRegistry;
		this.#cursorBroadcast = CursorAPI.cursorBroadcast;
	}

	get statusSubscribers() {
		return this.#broadcastRegistry.statusSubscribers;
	}
	get intentSubscribers() {
		return this.#broadcastRegistry.intentSubscribers;
	}
	get commitSubscribers() {
		return this.#broadcastRegistry.commitSubscribers;
	}
	get cancelSubscribers() {
		return this.#broadcastRegistry.cancelSubscribers;
	}
	get allSubscribers() {
		return { ...this.#broadcastRegistry };
	}

	get registeredStatusPayloads() {
		return this.#payloadRegistry.statusPayloads;
	}
	get registeredIntentPayloads() {
		return this.#payloadRegistry.intentPayloads;
	}
	get registeredCommitPayloads() {
		return this.#payloadRegistry.commitPayloads;
	}
	get registeredCancelPayloads() {
		return this.#payloadRegistry.cancelPayloads;
	}
	get allRegistersPayloads() {
		return { ...this.#payloadRegistry };
	}

	get statusBraoadscastObj() {
		return this.#cursorBroadcast.statusBraoadscast;
	}
	get intentBroadcastObj() {
		return this.#cursorBroadcast.intentBroadcast;
	}
	get commitBroadcastObj() {
		return this.#cursorBroadcast.commitBroadcast;
	}
	get cancelBroadcastObj() {
		return this.#cursorBroadcast.cancelBroadcast;
	}
	get allBroadcastObj() {
		return { ...this.#cursorBroadcast };
	}
}