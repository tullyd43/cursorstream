import BroadcastRegistry from "./broadcastRegistry.js";
import CursorStream from "./cursorStream.js";
import PayloadRegistry from "./payloadRegistry.js";

export default class CursorBroadcast {
	broadcastRegistry;
	payloadRegistry;
	static lastStatusRenderTime = performance.now();
	static lastPhaseRenderTime = performance.now();
	static statusDeltaTime = performance.now();
	static phaseDeltaTime = performance.now();
	constructor() {
		this.broadcastRegistry = new BroadcastRegistry();
		this.payloadRegistry = new PayloadRegistry(this);
		this.statusBroadcast = {
			x: 0,
			y: 0,
			buttons: 0,
			phase: null,
			status: null,
			target: null,
			payloads: {},
		};
		this.intentBroadcast = {
			x: 0,
			y: 0,
			buttons: 0,
			phase: null,
			status: null,
			target: null,
			payloads: {},
		};
		this.commitBroadcast = {
			x: 0,
			y: 0,
			buttons: 0,
			phase: null,
			status: null,
			target: null,
			payloads: {},
		};
		this.cancelBroadcast = {
			x: 0,
			y: 0,
			buttons: 0,
			phase: null,
			status: null,
			target: null,
			payloads: {},
		};
		this.statusThrottle;
		this.customStatusThrottleRate;
		this.phaseThrottle;
		this.customPhaseThrottleRate;
	}
	// Broadcast to subscribers
	broadcastStatus() {
		this.statusThrottle();
	}
	broadcastStatusCallback = (timestamp) => {
		this.lastStatusRenderTime = timestamp;
		this.statusDeltaTime = 0;
		this.broadcastRegistry.statusSubscribers.forEach((subscriber) => {
			subscriber(this.statusBroadcast);
			return;
		});
	};
	broadcastPhasesCallback = (timestamp) => {};

	broadcastIntent() {
		this.broadcastRegistry.intentSubscribers.forEach((subscriber) => {
			subscriber(this.statusBroadcast);
			return;
		});
	}
	broadcastCommit() {
		this.broadcastRegistry.commitSubscribers.forEach((subscriber) => {
			subscriber(this.statusBroadcast);
			return;
		});
	}
	broadcastCancel() {
		this.broadcastRegistry.cancelSubscribers.forEach((subscriber) => {
			subscriber(this.statusBroadcast);
			return;
		});
	}
	// Add payload references to broadcast channels
	linkStatusBroadcast(providerID, payloadReference) {
		this.statusBroadcast.payloads[providerID] = payloadReference;
		return;
	}
	linkIntentBroadcast(providerID, payloadReference) {
		this.intentBroadcast.payloads[providerID] = payloadReference;
		return;
	}
	linkCommitBroadcast(providerID, payloadReference) {
		this.commitBroadcast.payloads[providerID] = payloadReference;
		return;
	}
	linkCancelBroadcast(providerID, payloadReference) {
		this.cancelBroadcast.payloads[providerID] = payloadReference;
		return;
	}
	// Stop broadcast channels
	stopBroadcast() {
		this.statusBroadcast = null;
	}
	stopIntentBroadcast() {
		this.intentBroadcast = null;
	}
	stopCommitBroadcast() {
		this.commitBroadcast = null;
	}
	stopCancelBroadcast() {
		this.cancelBroadcast = null;
	}

	// Rate limit control
	rAFThrottleStatus(callback) {
		this.getStatusDeltaTime();
		return window.requestAnimationFrame(callback);
	}

	customThrottleStatus() {
		this.getStatusDeltaTime();
		if (this.statusDeltaTime >= this.customStatusThrottleRate) {
			this.broadcastStatusCallback(performance.now());
		}
		//not done
	}
	bypassThrottleStatus() {
		this.broadcastStatusCallback(performance.now());
	}
	getStatusDeltaTime() {
		this.statusDeltaTime = performance.now() - this.lastStatusRenderTime;
		return;
	}

	rAFThrottlePhases() {}
	customThrottlePhases() {}
	bypassThrottlePhases() {}
}