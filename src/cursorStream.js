import PayloadRouter from "./payloadRouter.js";
import StreamSources from "./streamSources.js";

export default class CursorStream {
	static lastEventTime;
	static idleTimer;
	idleDelay;
	StreamSources = new StreamSources(this);
	payloadRouter = new PayloadRouter(this);
	extraFields = {
		status: [],
		intent: [],
		commit: [],
		cancel: [],
	};
	nullFields = {
		intent: [],
		commit: [],
		cancel: [],
	};
	injectionBypass = {
		status: null,
		intent: null,
		commit: null,
		cancel: null,
	};
	nullInjectionBypass = {
		intent: null,
		commit: null,
		cancel: null,
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
				this.injectionBypass.intent();
				this.forwardPayload();
				this.nullInjectionBypass.intent();
				break;
			case "pointerup":
				this.phase = "commit";
				this.buttons = e.buttons;
				this.injectionBypass.commit();
				this.forwardPayload();
				this.phase = null;
				this.buttons = 0;
				this.nullInjectionBypass.commit();
				break;
			// Cancel might need another path for a dedicated cancel button
			case "pointercancel":
				this.phase = "cancel";
				this.buttons = e.buttons;
				this.injectionBypass.cancel();
				this.forwardPayload();
				this.phase = null;
				this.buttons = 0;
				this.nullInjectionBypass.cancel();
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
		this.injectionBypass.status();
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
	// iterate over array of declared extra fields populated by configs at at init time set by the user at instantiation.
	// defaults to bypassing injection. defailt sets reference to null to skip injection loop.
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
	// resets per phase injected fields to null on phase events. Runs after forwarding payloads to keep state in sync for phases.
	// status runs and mutates every frame. It's always fresh, no need to null.
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