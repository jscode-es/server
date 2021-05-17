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

        // Compilar código publico
        await Compiler.getList('public');

        // Compolar código privado
        //await Compiler.getList('private');

        console.timeEnd('[ Build ] Compiler file');
    }

    static getList(name='public')
    {
        let dir     = `front/${name}`;
        
        return new Promise(res=>fs.readdir( dir, (err, list) => {
            
            if(err) return;
            
            for (const item of list) 
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

            res(true);
        
        }));
    }

    static prepare(infile)
    {
        let splitDir  = infile.split('/');
        let isPrivate = splitDir[1] === 'public' ? 'public' : 'private';
        let [fileName, ext] = splitDir[splitDir.length-1].split('.')
        let folder    = ext === 'scss' ? 'css' : 'js'

        let outfile = `${isPrivate}/${folder}/${fileName}.min.${folder}`
        
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