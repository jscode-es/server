export default class Api {

    static getPage(page: string = '') {
        page.length && sessionStorage.setItem('page', page)
    }
}