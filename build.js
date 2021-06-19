// Modulos de node
const fs = require('fs')
const path = require('path')

// Core compilador
const { build }  = require('esbuild')
const sassPlugin = require('esbuild-plugin-sass')

// Compilar
class Compiler 
{
    static async init()
    {   
        console.time('[ Build ] Compiler file');

        await Compiler.getList('public');

        console.timeEnd('[ Build ] Compiler file');
    }

    static getList()
    {
        let dir  = `public/.src`;
        
        return new Promise(res=>fs.readdir( dir, (err, list) => {
            
            if(err) return;
            
            for (const item of list) 
            {
                if(item!='common')
                {
                    let subDirName = `${dir}/${item}`;
                                   
                    fs.readdir(subDirName,(err,subDirs)=>{
    
                        if(err) return;
                        
                        for (const subDir of subDirs) 
                        {
                            Compiler.prepare(`${subDirName}/${subDir}`);
                        }
                    });
                }
            }

            res(true);
        
        }));
    }

    static prepare(infile)
    {
        let splitDir = infile.split('/');
        let filename = splitDir[3]
        let ext    = splitDir[2] === 'js' ? 'ts' : 'scss'

        let outfile = `public/${splitDir[2]}/${filename}.min.${splitDir[2]}`

        infile = `${infile}/main.${ext}`
    
        if (fs.existsSync(infile)) 
        {
           Compiler.build(infile,outfile);
        }

    }
    
    static build(infile,outfile)
    {
        let setting = 
        {
            entryPoints: [infile],
            bundle: true,
            minify: false,
            sourcemap: false,
            //target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
            outfile,
            define: { 'process.env.NODE_ENV': '"developer"' },
            plugins: [sassPlugin()]
        }

        build(setting);
    }
}

// Inicializar
Compiler.init();