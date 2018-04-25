function Stopwatch(elem) {
    let time = 0;
    let interval, offset, formattedTime;
    this.isOn = false;

    function update() {
        time += delta();
        formattedTime = timeFormatter(time);
        elem.textContent = formattedTime;
    };

    function delta() {
        let now = Date.now();
        let timePassed = now - offset;
        offset = now;
        return timePassed;
    };

    function pad(t) {
        return ('00' + t).substr(-2);
    }

    function timeFormatter(timeInMilliseconds) {
        let time = new Date(timeInMilliseconds);
        let minutes = pad(time.getMinutes());
        let seconds = pad(time.getSeconds());
        let milliseconds = pad(Math.floor(time.getMilliseconds() / 10));
        return minutes + ":" + seconds + ":" + milliseconds;
    };

    this.returnTime = function () {
        return formattedTime;
    }

    this.start = function () {
        if (!this.isOn) {
            interval = setInterval(update, 1);
            offset = Date.now();
            this.isOn = true;
        }
    };

    this.stop = function () {
        if (this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;
        }
    };

    this.reset = function () {
        time = 0;
    };
}