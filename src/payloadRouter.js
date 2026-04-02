import BuildPayload from "./buildPayload.js";

export default class PayloadRouter {
	static BUFFER_MIRROR = {
		x: 0,
		y: 0,
		buttons: 0,
		phase: null,
		status: null,
		target: null,
		// config sets new buffer mirror items for injected fields
	};
	constructor() {
		this.payloadBuffer = {};
		this.buildPayload = new BuildPayload();
		this.extraFields = []
		this.forwardInjections = null;
		this.resetBufferInjection = null;
	}
	route() {
		switch (this.payloadBuffer.phase) {
			case "intent":
				this.buildPayload.buildIntentPayload(this.payloadBuffer);
				console.log("intent buffer", this.payloadBuffer);
				break;
			case "commit":
				this.buildPayload.buildCommitPayload(this.payloadBuffer);
				console.log("commit buffer", this.payloadBuffer);
				break;
			case "cancel":
				this.buildPayload.buildCancelPayload(this.payloadBuffer);
				console.log("cancel buffer", this.payloadBuffer);
				break;
		}
		this.buildPayload.buildStatusPayload(this.payloadBuffer);
		console.log("buffer", this.payloadBuffer);
		this.resetPayloadBuffer();
		return;
	}
	resetPayloadBuffer() {
		this.payloadBuffer.x = PayloadRouter.BUFFER_MIRROR.x;
		this.payloadBuffer.y = PayloadRouter.BUFFER_MIRROR.y;
		this.payloadBuffer.buttons = PayloadRouter.BUFFER_MIRROR.buttons;
		this.payloadBuffer.phase = PayloadRouter.BUFFER_MIRROR.phase;
		this.payloadBuffer.status = PayloadRouter.BUFFER_MIRROR.status;
		this.payloadBuffer.target = PayloadRouter.BUFFER_MIRROR.target;
		this.resetMirroredInjections();
	}

	injectToBuffer(liveMutableObj) {
		for (let i = 0; i < this.extraFields.length; i++) {
			this[this.extraFields[i]] = liveMutableObj[this.extraFields[i]];
		}
	}
	resetMirroredInjections() {
		for (let i = 0; i < this.extraFields.length; i++) {
			this[this.extraFields[i]] =
				PayloadRouter.BUFFER_MIRROR[this.extraFields[i]];
		}
	}

}
