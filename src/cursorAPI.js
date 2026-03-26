import CursorInspector from "./cursorInspector.js";
import CursorStream from "./cursorStream.js";

export default class CursorAPI {
	#CursorStream;
	Inspector;
	#CursorBroadcast;
	#BroadcastRegistry;
	#PayloadRegistry;
	constructor() {
		this.#CursorStream = new CursorStream();
		this.Inspector = new CursorInspector(this);
		this.#CursorBroadcast =
			this.#CursorStream.payloadRouter.buildPayload.cursorBroadcast;
		this.#BroadcastRegistry =
			this.#CursorStream.payloadRouter.buildPayload.cursorBroadcast.broadcastRegistry;
		this.#PayloadRegistry =
			this.#CursorStream.payloadRouter.buildPayload.cursorBroadcast.payloadRegistry;
	}
	streamStart() {
		this.#CursorStream.start();
	}
	streamStop() {
		this.#CursorStream.stop();
	}
	setIdleInterval() {}

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

	get statusSubscribers() {
		return this.#BroadcastRegistry.statusSubscribers;
	}
	get intentSubscribers() {
		return this.#BroadcastRegistry.intentSubscribers;
	}
	get commitSubscribers() {
		return this.#BroadcastRegistry.commitSubscribers;
	}
	get cancelSubscribers() {
		return this.#BroadcastRegistry.cancelSubscribers;
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

	get registeredStatusPayloads() {
		return this.#PayloadRegistry.statusPayloads;
	}
	get registeredIntentPayloads() {
		return this.#PayloadRegistry.intentPayloads;
	}
	get registeredCommitPayloads() {
		return this.#PayloadRegistry.commitPayloads;
	}
	get registeredCancelPayloads() {
		return this.#PayloadRegistry.cancelPayloads;
	}

	get statusBroadcastObj() {
		return this.#CursorBroadcast.statusBroadcast;
	}
	get intentBroadcastObj() {
		return this.#CursorBroadcast.intentBroadcast;
	}
	get commitBroadcastObj() {
		return this.#CursorBroadcast.commitBroadcast;
	}
	get cancelBroadcastObj() {
		return this.#CursorBroadcast.cancelBroadcast;
	}
}
