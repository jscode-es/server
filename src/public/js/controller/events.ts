class events {

    static listener() {
        console.log('Controlar eventos del dom')

        events.ready(events.start)
    }

    private static ready(fn: any) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    private static start() {

        setTimeout(events.animate, 500)

    }

    private static animate() {
        let animate: any = document.querySelectorAll('.animate')

        for (const item of animate) {
            item.classList.add('show')
        }
    }
}

export default events