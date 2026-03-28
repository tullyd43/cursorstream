

export default class CursorConfigs {
    #CursorBroadcast
    constructor(
        CursorBroadcast,
        configs = {
            throttleStatus: "auto",
            throttlePhases: "auto",
            idleTimer: 5000,
        }
    ) {
        this.#CursorBroadcast = CursorBroadcast;
        this.throttleStatus = configs.throttleStatus;
        this.throttlePhases = configs.throttlePhases;
        this.idleTimer = configs.idleTimer;
        this.applyConfigs()
    }

    setStatusThrottle() {
        if (this.throttleStatus === "auto") {
            this.#CursorBroadcast.statusThrottle = this.#CursorBroadcast.rAFThrottleStatus(this.#CursorBroadcast.broadcastStatusCallback);
            return 
        } else if (this.throttleStatus === 0) {
            this.#CursorBroadcast.statusThrottle = this.#CursorBroadcast.bypassThrottleStatus;
            return 
        } else if (this.throttleStatus >= 1) {
            this.#CursorBroadcast.statusThrottle = this.#CursorBroadcast.customThrottleStatusRate(this.throttleStatus);
            this.#CursorBroadcast.customThrottleStatusRate = 1000 / this.throttleStatus;
            return 
        } else {
            return // handle an error
        }
    }
    setPhasesThrottle() {
        if (this.throttlePhases === "auto") {
            this.#CursorBroadcast.phasesThrottle = this.#CursorBroadcast.rAFThrottlePhases;
            return;
        } else if (this.throttlePhases === 0) {
            this.#CursorBroadcast.phasesThrottle = this.#CursorBroadcast.bypassThrottlePhases;
            return;
        } else if (this.throttlePhases >= 1) {
            this.#CursorBroadcast.phasesThrottle = this.#CursorBroadcast.customThrottlePhases;
        } else {
            return // handle an error
        }
    }

    applyConfigs() {
        this.setStatusThrottle();
        this.setPhasesThrottle();
    }
}