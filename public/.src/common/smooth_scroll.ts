import Scrollbar from 'smooth-scrollbar'

export default class Scroll
{
    static init()
    {
        Scrollbar.init(document.querySelector('#main'), {damping:0.10});
        //Scrollbar.init(document.querySelector('content'), {damping:0.10});
    }
}