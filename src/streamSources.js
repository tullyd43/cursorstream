import CursorStream from "./cursorStream";

export default class StreamSources {
    constructor() {
        this.onMove = (e) => CursorStream.setStreamActivity(e);
		this.onDown = (e) => CursorStream.streamPhase(e);
		this.onUp = (e) => CursorStream.streamPhase(e);
		this.onCancel = (e) => CursorStream.clear();
    }
    moveListener() {
        return window.addEventListener('pointermove', this.onMove)
    }
    downListener() {
        return window.addEventListener('pointerdown', this.onDown);
    }
    upListener() {
        return window.addEventListener('pointerup', this.onUp);
    }
    cancelListener() {
        return window.addEventListener('pointercancel', this.onCancel);
    }
}