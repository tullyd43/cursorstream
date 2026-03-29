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
		//buffer registered payloads
	}
	buildIntentPayload(payload) {
		this.cursorBroadcast.intentBroadcast.x = payload.x;
		this.cursorBroadcast.intentBroadcast.y = payload.y;
		this.cursorBroadcast.intentBroadcast.buttons = payload.buttons;
		this.cursorBroadcast.intentBroadcast.phase = payload.phase;
		this.cursorBroadcast.intentBroadcast.status = payload.status;
		this.cursorBroadcast.intentBroadcast.target = payload.target;
		this.cursorBroadcast.activeStatusCallback = this.cursorBroadcast.phaseCallback.intent;
		this.cursorBroadcast.broadcastIntent();
	}
	buildCommitPayload(payload) {
		this.cursorBroadcast.commitBroadcast.x = payload.x;
		this.cursorBroadcast.commitBroadcast.y = payload.y;
		this.cursorBroadcast.commitBroadcast.buttons = payload.buttons;
		this.cursorBroadcast.commitBroadcast.phase = payload.phase;
		this.cursorBroadcast.commitBroadcast.status = payload.status;
		this.cursorBroadcast.commitBroadcast.target = payload.target;
		this.cursorBroadcast.activeStatusCallbacke = this.cursorBroadcast.phaseCallback.commit;
		this.cursorBroadcast.broadcastCommit();
	}
	// havent decided on cancel strategy yet. this probably aint it. 
	buildCancelPayload(payload) {
		// this.#cursorBroadcast.broadcastCancel.x = payload.x;
		// this.#cursorBroadcast.broadcastCancel.y = payload.y;
		// this.#cursorBroadcast.broadcastCancel.buttons = payload.buttons;
		// this.#cursorBroadcast.broadcastCancel.phase = payload.phase;
		// this.#cursorBroadcast.broadcastCancel.status = payload.status;
		// this.#cursorBroadcast.broadcastCancel.target = payload.status;
		// this.cursorBroadcast.activeStatusCallback = this.cursorBroadcast.phaseCallback.cancel;
	}
}
