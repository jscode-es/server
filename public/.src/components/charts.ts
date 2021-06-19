declare global {
    interface Window {
        BlockStadistic:any;
    }
}
declare var Modal: any;
declare var Sortable: any;
declare var Uppy: any;

// Modulos propios
import Highcharts from 'highcharts'

class BlockStadistic extends HTMLElement 
{
	// Atributos de clase
	isLoaded:boolean  = false
	isFirstLoad:boolean = true

	// Atributos observables
	static get observedAttributes() { return [ 'service', 'icon' ] }

	// Contructor
	constructor(){ super() }

	// Inicializar 
	connectedCallback()
	{
		this.isLoaded = true
		this.render($(this))

        console.log({Highcharts})
	}

	//Escuchar los cambios
	attributeChangedCallback(name:any, oldValue:any, newValue:any)
	{	
		if(this.isLoaded && oldValue != newValue )
		{	
			this.isFirstLoad = false
			this.render($(this), { name, oldValue, newValue })
		}
	}

	static getAttributes({attributes}:any,props:any)
	{	
		let obj   = {}

		for (const item of attributes) 
		{
			let { name, value } = item
			obj[name]= value
		}

		return obj;

	}

	static async ajax(setting:any)
	{	
		/*let { service } = setting;
		
		let {status,error,result} = await new Api(service,{block:true}).get();

		if(status===200)
		{	
			return result;
		}

		console.warn(error)
		return false;*/
		
	}

    private async render(self:any, attrs:any = {})
    {   

        //let {service,icon}:any = BlockStadistic.getAttributes(self[0],attrs)
        
        //let {total,stadistic} = await BlockStadistic.ajax({service})

        let html = `
        <div>
            <!--h2>Estaditicas</h2-->
            <div id="chart"></div>

        </div>
        
        `

        self.html(html)

        Highcharts.chart('chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Analisis entre ventas y promociones'
            },
            /*subtitle: {
                text: 'Source: WorldClimate.com'
            },*/
            xAxis: [{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: 'Art. {value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: 'Art. {value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || // theme
                    'rgba(255,255,255,0.25)'
            },
            series: [{
                name: 'Promociones',
                type: 'column',
                yAxis: 1,
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                tooltip: {
                    valueSuffix: ' Art.'
                }
        
            }, {
                name: 'Productos',
                type: 'spline',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                tooltip: {
                    valueSuffix: ' Art.'
                }
            }]
        });
    }
	
}

window.BlockStadistic = BlockStadistic;

customElements.define('block-stadistic', BlockStadistic)