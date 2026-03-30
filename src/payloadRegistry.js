
export default class PayloadRegistry {
	constructor(CursorBroadcast) {
		this.statusPayloads = new Map();
		this.intentPayloads = new Map();
		this.commitPayloads = new Map();
		this.cancelPayloads = new Map();
		this.cursorBroadcast = CursorBroadcast;
	}
	// Attach payloads to broadcast channel objects
	includeWithStatus(providerID, payloadReference) {
		this.statusPayloads.set(providerID, payloadReference);
		this.cursorBroadcast.linkStatusBroadcast(providerID, payloadReference);
		return;
	}
	includeWithIntent(providerID, payloadReference) {
		this.intentPayloads.set(providerID, payloadReference);
		this.cursorBroadcast.linkIntentBroadcast(providerID, payloadReference);
		return;
	}
	includeWithCommit(providerID, payloadReference) {
		this.commitPayloads.set(providerID, payloadReference);
		this.cursorBroadcast.linkCommitBroadcast(providerID, payloadReference);
		return;
	}
	includeWithCancel(providerID, payloadReference) {
		this.cancelPayloads.set(providerID, payloadReference);
		this.cursorBroadcast.linkCancelBroadcast(providerID, payloadReference);
		return;
	}
	// Remove payloads from payloadRegistry and cusrorBroadcast objects
	removeStatusPayload(providerID) {
		this.statusPayloads.delete(providerID);
		this.cursorBroadcast.statusBroadcast.payloads.delete(providerID);
	}
	removeIntentPayload(providerID) {
		this.intentPayloads.delete(providerID);
		this.cursorBroadcast.intentBroadcast.payloads.delete(providerID);
		return;
	}
	removeCommitPayload(providerID) {
		this.commitPayloads.delete(providerID);
		this.cursorBroadcast.commitBroadcast.payloads.delete(providerID);
		return;
	}
	removeCancelPayload(providerID) {
		this.cancelPayloads.delete(providerID);
		this.cursorBroadcast.cancelBroadcast.payloads.delete(providerID);
		return;
	}
}