//import Load from "./components/load"
function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(() => {
    let line: any = document.querySelector('.line')
    let span: any = document.querySelectorAll('.span')
    let span_name: any = document.querySelector('.span_name')

    setTimeout(() => {

        line.classList.add('show')

    }, 500)

    setTimeout(async () => {

        for await (const item of span) {

            item.classList.add('show')
            await sleep(500)
        }

    }, 900)

    setTimeout(() => {

        span_name.classList.add('show')

    }, 2500)
})()