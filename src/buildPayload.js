import CursorBroadcast from "./cursorBroadcast.js";

export default class BuildPayload {
	cursorBroadcast;
	constructor() {
		this.cursorBroadcast = new CursorBroadcast();
	}

	buildStatusPayload(payload) {
		console.log("builder payload", payload);
		this.cursorBroadcast.statusBroadcast.x = payload.x;
		this.cursorBroadcast.statusBroadcast.y = payload.y;
		this.cursorBroadcast.statusBroadcast.buttons = payload.buttons;
		this.cursorBroadcast.statusBroadcast.phase = payload.phase;
		this.cursorBroadcast.statusBroadcast.status = payload.status;
		this.cursorBroadcast.statusBroadcast.target = payload.target;
		this.cursorBroadcast.broadcastStatus();
	}
	buildIntentPayload(payload) {
		this.cursorBroadcast.intentBroadcast.x = payload.x;
		this.cursorBroadcast.intentBroadcast.y = payload.y;
		this.cursorBroadcast.intentBroadcast.buttons = payload.buttons;
		this.cursorBroadcast.intentBroadcast.phase = payload.phase;
		this.cursorBroadcast.intentBroadcast.status = payload.status;
		this.cursorBroadcast.intentBroadcast.target = payload.target;
		this.cursorBroadcast.activePhaseThrottleRef = this.cursorBroadcast.phaseThrottleRefs.intent;
		this.cursorBroadcast.activePhaseCallback = this.cursorBroadcast.phaseCallbacks.intent;
		this.cursorBroadcast.broadcastIntent();
	}
	buildCommitPayload(payload) {
		this.cursorBroadcast.commitBroadcast.x = payload.x;
		this.cursorBroadcast.commitBroadcast.y = payload.y;
		this.cursorBroadcast.commitBroadcast.buttons = payload.buttons;
		this.cursorBroadcast.commitBroadcast.phase = payload.phase;
		this.cursorBroadcast.commitBroadcast.status = payload.status;
		this.cursorBroadcast.commitBroadcast.target = payload.target;
		this.cursorBroadcast.activePhaseThrottleRef = this.cursorBroadcast.phaseThrottleRefs.commit;
		this.cursorBroadcast.activePhaseCallback = this.cursorBroadcast.phaseCallbacks.commit;
		this.cursorBroadcast.broadcastCommit();
	}
	// havent decided on cancel strategy yet. this probably aint it. 
	buildCancelPayload(payload) {
		// this.#cursorBroadcast.cancelBroadcast.x = payload.x;
		// this.#cursorBroadcast.cancelBroadcast.y = payload.y;
		// this.#cursorBroadcast.cancelBroadcast.buttons = payload.buttons;
		// this.#cursorBroadcast.cancelBroadcast.phase = payload.phase;
		// this.#cursorBroadcast.cancelBroadcast.status = payload.status;
		// this.#cursorBroadcast.cancelBroadcast.target = payload.status;
		// this.cursorBroadcast.activePhaseThrottleRef = this.cursorBroadcast.phaseThrottleRefs.cancel
		// this.cursorBroadcast.activePhaseCallback = this.cursorBroadcast.phaseCallbacks.cancel;
		// this.cursorBroadcast.broadcastCancel()
	}

	mergeInjections() {

	}
}
