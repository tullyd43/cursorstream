import CursorStream from "./cursorStream.js";

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

	get lastEventTime() {
		return this.#cursorBroadcast.lastEventTime;
	}
	get idleTimer() {
		return this.#cursorBroadcast.idleTimer;
	}
	get lastStatusRenderTime() {
		return this.#cursorBroadcast.lastStatusRenderTime;
	}
	get lastPhaseRenderTime() {
		return this.#cursorBroadcast.lastPhaseRenderTime;
	}
	get statusDeltaTime() {
		return this.#cursorBroadcast.statusDeltaTime;
	}
	get phaseDeltaTime() {
		return this.#cursorBroadcast.phaseDeltaTime;
	}


	// possible new inspector objects to expose
	phaseCallback; // Callback refs to be used in phase throttling methods. Active callback is stored in activePhaseCallback
	activePhaseCallback; // Active callback to be used in throttling methods. Phases are dynamic. Callback refs are held in phaseCallback {}
	activeStatusCallback; // Callback to be used in throttling methods. Status is static
	statusThrottle; // Configured throttle strategy method
	customStatusThrottleRate; // Calculated custom frame time from config object
	phaseThrottle; // Configured throttle strategy method
	customPhaseThrottleRate; // Calculated custom frame time from config object
}