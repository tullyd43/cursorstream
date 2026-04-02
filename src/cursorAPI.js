import CursorConfigs from "./cursorConfigs.js";
import CursorInspector from "./cursorInspector.js";
import CursorStream from "./cursorStream.js";

export default class CursorAPI {
	#CursorStream;
	#CursorBroadcast;
	#BroadcastRegistry;
	#PayloadRegistry;
	Inspector;
	#CursorConfigs;
	constructor(configs) {
		this.#CursorStream = new CursorStream();
		this.#CursorBroadcast = this.#CursorStream.payloadRouter.buildPayload.cursorBroadcast;
		this.#BroadcastRegistry = this.#CursorStream.payloadRouter.buildPayload.cursorBroadcast.broadcastRegistry;
		this.#PayloadRegistry = this.#CursorStream.payloadRouter.buildPayload.cursorBroadcast.payloadRegistry;
		this.#CursorConfigs = new CursorConfigs(this.#CursorStream, this.#CursorBroadcast, this.#CursorStream.payloadRouter, configs);
		this.Inspector = new CursorInspector({
			broadcastRegistry: this.#BroadcastRegistry,
			payloadRegistry: this.#PayloadRegistry,
			cursorBroadcast: this.#CursorBroadcast,
		});
	}
	streamStart() {
		this.#CursorConfigs.applyConfigs()
		this.#CursorStream.start();
	}
	streamStop() {
		this.#CursorStream.stop();
	}

	subscribeStatus(callback) {
		this.#BroadcastRegistry.subscribeStatus(callback);
	}
	subscribeIntent(callback) {
		this.#BroadcastRegistry.subscribeIntent(callback);
	}
	subscribeCommit(callback) {
		this.#BroadcastRegistry.subscribeCommit(callback);
	}
	subscribeCancel(callback) {
		this.#BroadcastRegistry.subscribeCancel(callback);
	}

	unSubscribeStatus(callback) {
		this.#BroadcastRegistry.unSubscribeStatus(callback);
	}
	unSubscribeIntent(callback) {
		this.#BroadcastRegistry.unSubscribeIntent(callback);
	}
	unSubscribeCommit(callback) {
		this.#BroadcastRegistry.unSubscribeCommit(callback);
	}
	unSubscribeCancel(callback) {
		this.#BroadcastRegistry.unSubscribeCancel(callback);
	}

	registerStatusPayload(providerID, payloadRef) {
		this.#PayloadRegistry.includeWithStatus(providerID, payloadRef);
	}
	registerIntentPayload(providerID, payloadRef) {
		this.#PayloadRegistry.includeWithIntent(providerID, payloadRef);
	}
	registerCommitPayload(providerID, payloadRef) {
		this.#PayloadRegistry.includeWithCommit(providerID, payloadRef);
	}
	registerCancelPayload(providerID, payloadRef) {
		this.#PayloadRegistry.includeWithCancel(providerID, payloadRef);
	}

	removeStatusPayload(providerID) {
		this.#PayloadRegistry.removeStatusPayload(providerID);
	}
	removeIntentPayload(providerID) {
		this.#PayloadRegistry.removeIntentPayload(providerID);
	}
	removeCommitPayload(providerID) {
		this.#PayloadRegistry.removeCommitPayload(providerID);
	}
	removeCancelPayload(providerID) {
		this.#PayloadRegistry.removeCancelPayload(providerID);
	}
}
