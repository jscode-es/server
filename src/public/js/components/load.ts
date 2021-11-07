class Load {

    constructor() {

        let line: any = document.querySelector('.line')

        setTimeout(() => {

            line.classList.add('show')

        }, 500)
    }
}

export default Load