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
	static phaseCallbacks; // Callback refs to be used in phase throttling methods. Active callback is stored in activePhaseCallback
	static activePhaseCallback; // Active callback to be used in throttling methods. Phases are dynamic. Callback refs are held in phaseCallback {}
	static statusBroadcastCallback; // Callback to be used in throttling methods. Status is set statically below
	static statusThrottle; // Configured throttle strategy method
	static customStatusThrottleRate; // Calculated custom frame time from config object
	static phaseThrottle; // Configured throttle strategy method
	static customPhaseThrottleRate; // Calculated custom frame time from config object
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
		this.phaseCallbacks = {
			intent: this.intentPhaseCallback,
			commit: this.commitPhaseCallback,
			cancel: this.cancelPhaseCallback,
		};
		this.activePhaseCallback = null; // Set by config at init. Default "auto" (rAF)
		this.phaseThrottleRefs = {
			intent: null,
			commit: null,
			cancel: null,
		};
		this.activePhaseThrottleRef = null;
		this.statusThrottleRef = null;
	}
	// Broadcast to subscribers
	broadcastStatus() {
		this.statusThrottle();
	}
	statusBroadcastCallback = (timestamp) => {
		console.log("last render", this.lastPhaseRenderTime);
		this.lastStatusRenderTime = timestamp;
		this.statusDeltaTime = 0;
		this.statusThrottleRef = null
		this.broadcastRegistry.statusSubscribers.forEach((subscriber) => {
			subscriber(this.statusBroadcast);
			return;
		});
	};

	broadcastIntent(timestamp) {
		this.phaseThrottle(timestamp);
	}
	intentPhaseCallback = (timestamp) => {
		console.log("last render", this.lastPhaseRenderTime);
		this.lastPhaseRenderTime = timestamp;
		this.phaseDeltaTime = 0;
		this.activePhaseThrottleRef = null;
		this.broadcastRegistry.intentSubscribers.forEach((subscriber) => {
			subscriber(this.intentBroadcast);
		});
	};

	broadcastCommit() {
		this.phaseThrottle();
	}
	commitPhaseCallback = (timestamp) => {
		console.log("last render", this.lastPhaseRenderTime);
		this.lastPhaseRenderTime = timestamp;
		this.phaseDeltaTime = 0;
		this.activePhaseThrottleRef = null;
		this.broadcastRegistry.commitSubscribers.forEach((subscriber) => {
			subscriber(this.commitBroadcast);
		});
	};

	broadcastCancel() {
		this.phaseThrottle();
	}
	cancelPhaseCallback = (timestamp) => {
		console.log("last render", this.lastPhaseRenderTime);
		this.lastPhaseRenderTime = timestamp;
		this.phaseDeltaTime = 0;
		this.activePhaseCallback = null;
		this.broadcastRegistry.cancelSubscribers.forEach((subscriber) => {
			subscriber(this.cancelBroadcast);
		});
	};

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
	rAFThrottleStatus() {
		if (!this.statusThrottleRef) {
			this.statusThrottleRef = window.requestAnimationFrame(this.statusBroadcastCallback);
			return
		}
	}
	customThrottleStatus() {
		this.getStatusDeltaTime();
		if (this.statusDeltaTime >= this.customStatusThrottleRate) {
			return this.broadcastStatusCallback(performance.now());
		};
	}
	bypassThrottleStatus() {
		return this.statusBroadcastCallback(performance.now);
	}
	getStatusDeltaTime() {
		this.statusDeltaTime = performance.now() - this.lastStatusRenderTime;
		return;
	}

	rAFThrottlePhases() {
		if (!this.activePhaseThrottleRef) {
			this.activePhaseThrottleRef = window.requestAnimationFrame(this.activePhaseCallback);
			return;
		}
	}
	customThrottlePhases() {
		this.getPhaseDeltaTime();
		if (this.phaseDeltaTime >= this.customPhaseThrottleRate) {
			return this.activePhaseCallback(performance.now());
		}
	}
	bypassThrottlePhases() {
		this.activePhaseCallback(performance.now());
	}
	getPhaseDeltaTime() {
		this.phaseDeltaTime = performance.now() - this.lastPhaseRenderTime;
		return;
	}
}