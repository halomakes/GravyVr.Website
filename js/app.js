class CountdownEvent {
    static fromJson(data) {
        const event = new CountdownEvent();
        event.name = data.name;
        event.date = new Date(data.date);
        return event;
    }
}
class CountdownTimer {
    constructor(element) {
        this.element = element;
        this.loadEvents();
        this.animate();
    }
    loadEvents() {
        const jsonElement = document.getElementById(this.element.dataset.id);
        if (!jsonElement)
            return;
        this.events = JSON.parse(jsonElement.innerHTML).map(CountdownEvent.fromJson);
    }
    updateDisplay() {
        const nextEvent = this.events && this.events
            .filter(e => e.date && e.date.getTime() > (new Date()).getTime())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .find(_ => true);
        if (!nextEvent) {
            this.element.style.display = 'none';
            return;
        }
        this.element.style.display = 'flex';
        const timeDifference = nextEvent.date.getTime() - (new Date()).getTime();
        var days = Math.floor(timeDifference / 86400000);
        if (days > 99)
            days = 99;
        const hours = Math.floor(timeDifference / 3600000) % 24;
        const minutes = Math.floor(timeDifference / 60000) % 60;
        const seconds = Math.floor(timeDifference / 1000) % 60;
        const digits = `${days.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
        const digitDisplays = Array.from(this.element.getElementsByClassName('digit'));
        digitDisplays.forEach((d, i) => {
            if (d.innerHTML != digits[i])
                d.innerHTML = digits[i];
        });
        const label = this.element.getElementsByClassName('event-name')[0];
        label.innerHTML = nextEvent.name;
    }
    animate() {
        this.updateDisplay();
        window.requestAnimationFrame(() => this.animate());
    }
}
CountdownTimer.selector = 'countdown-timer';
const app = {};
window.app = app;
app.countdownTimers = [];
for (let element of Array.from(document.getElementsByTagName(CountdownTimer.selector))) {
    app.countdownTimers.push(new CountdownTimer(element));
}
//# sourceMappingURL=app.js.map