import PayloadRouter from "./payloadRouter.js";
import StreamSources from "./streamSources.js";

export default class CursorStream {
	static lastEventTime;
	static idleTimer;
	idleDelay;
	StreamSources = new StreamSources(this);
	payloadRouter = new PayloadRouter();
	extraFields = {
		status: [],
		intent: [],
		commit: [],
		cancel: [],
	};
	nullFields = {
		status: [],
		intent: [],
		commit: [],
		cancel: [],
	};
	constructor() {
		this.x;
		this.y;
		this.buttons;
		this.phase;
		this.status;
		this.target;
	}

	start() {
		this.StreamSources.moveListener();
		this.StreamSources.downListener();
		this.StreamSources.upListener();
		this.StreamSources.cancelListener();
		this.idleTimer = null;
		this.injectExtraFields();
		return;
	}
	stop() {
		window.removeEventListener("pointermove", this.StreamSources.onMove);
		window.removeEventListener("pointerdown", this.StreamSources.onDown);
		window.removeEventListener("pointerup", this.StreamSources.onUp);
		window.removeEventListener(
			"pointercancel",
			this.StreamSources.onCancel,
		);
		return;
	}
	streamPhase(e) {
		switch (e.type) {
			case "pointerdown":
				this.phase = "intent";
				this.buttons = e.buttons;
				this.runIntentInjection();
				this.forwardPayload();
				this.nullIntentInjection();
				break;
			case "pointerup":
				this.phase = "commit";
				this.buttons = e.buttons;
				this.forwardPayload();
				this.phase = null;
				this.buttons = 0;
				this.nullCommitInjection();
				break;
			// Cancel might need another path for a dedicated cancel button
			case "pointercancel":
				this.phase = "cancel";
				this.buttons = e.buttons;
				this.forwardPayload();
				this.phase = null;
				this.buttons = 0;
				this.nullCancelInjection();
				break;
		}
		return;
	}
	streamStatus() {
		this.status = "active";
		this.stopIdleTimer();
		this.startIdleTimer();
		this.forwardPayload();
		return;
	}
	setStreamActivity(e) {
		this.lastEventTime = e.timeStamp;
		this.x = e.clientX;
		this.y = e.clientY;
		this.target = e.target;
		this.lastEventTime = e.timeStamp;
		this.runStatusInjection();
		this.streamStatus();
		return;
	}
	forwardPayload() {
		this.payloadRouter.payloadBuffer.x = this.x;
		this.payloadRouter.payloadBuffer.y = this.y;
		this.payloadRouter.payloadBuffer.buttons = this.buttons;
		this.payloadRouter.payloadBuffer.phase = this.phase;
		this.payloadRouter.payloadBuffer.status = this.status;
		this.payloadRouter.payloadBuffer.target = this.target;
		console.log("live mutable", this);
		this.payloadRouter.route();
	}
	setStreamActive() {
		this.status = "active";
	}
	setStreamIdle = () => {
		this.status = "idle";
	};
	startIdleTimer() {
		this.idleTimer = setTimeout(() => {
			this.setStreamIdle();
			this.forwardPayload();
		}, this.idleDelay);
	}
	stopIdleTimer() {
		clearTimeout(this.idleTimer);
		this.idleTimer = null;
	}

	runStatusInjection(e) {
		for (let i = 0; i < this.extraFields.status.length; i++) {
			this[this.extraFields.status[i]] = e[this.extraFields.status[i]];
		}
	}
	runIntentInjection(e) {
		for (let i = 0; i < this.extraFields.intent.length; i++) {
			this[this.extraFields.intent[i]] = e[this.extraFields.intent[i]];
		}
	}
	runCommitInjection(e) {
		for (let i = 0; i < this.extraFields.commit.length; i++) {
			this[this.extraFields.commit[i]] = e[this.extraFields.commit[i]];
		}
	}
	runCancelInjection(e) {
		for (let i = 0; i < this.extraFields.cancel.length; i++) {
			this[this.extraFields.cancel[i]] = e[this.extraFields.cancel[i]];
		}
	}

	nullIntentInjection() {
		for (let i = 0; i < this.nullFields.intent.length; i++) {
			this[this.nullFields.intent[i]] = null;
		}
	}
	nullCommitInjection() {
		for (let i = 0; i < this.nullFields.commit.length; i++) {
			this[this.nullFields.commit[i]] = null;
		}
	}
	nullCancelInjection() {
		for (let i = 0; i < this.nullFields.cancel.length; i++) {
			this[this.nullFields.cancel[i]] = null;
		}
	}
}