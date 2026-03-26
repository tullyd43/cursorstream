

export default class BroadcastRegistry {
	constructor() {
		this.statusSubscribers = new Set();
		this.intentSubscribers = new Set();
		this.commitSubscribers = new Set();
		this.cancelSubscribers = new Set();
	}
	// Register callbacks that take in the broadcast channel object
	subscribeStatus(subscriber) {
		this.statusSubscribers.add(subscriber);
		return;
	}
	subscribeIntent(subscriber) {
		this.intentSubscribers.add(subscriber);
		return;
	}
	subscribeCommit(subscriber) {
		this.commitSubscribers.add(subscriber);
		return;
	}
	subscribeCancel(subscriber) {
		this.cancelSubscribers.add(subscriber);
		return;
	}

    unSubscribeStatus(subscriber) {
        this.statusSubscribers.delete(subscriber);
        return;
    }
    unSubscribeIntent(subscriber) {
        this.intentSubscribers.delete(subscriber);
        return;
    }
    unSubscribeCommit(subscriber) {
        this.commitSubscribers.delete(subscriber);
        return;
    }
    unSubscribeCancel(subscriber) {
        this.cancelSubscribers.delete(subscriber);
        return;
    }
}