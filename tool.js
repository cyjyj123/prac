const fs=require("fs");
const base_path=`${__dirname}/android/app/src/main/res`

const logo_path=`${__dirname}/public/logo512.png`

const app_res=fs.readdirSync(base_path);

app_res.map(folder=>{
    if(folder.startsWith("drawable-land") || folder.startsWith("drawable-port")){
        fs.copyFileSync(logo_path,`${base_path}/${folder}/splash.png`);
    }
    else if(folder.startsWith("mipmap") && !folder.endsWith("v26")){
        fs.copyFileSync(logo_path,`${base_path}/${folder}/ic_launcher.png`);
        fs.copyFileSync(logo_path,`${base_path}/${folder}/ic_launcher_round.png`);
        fs.copyFileSync(logo_path,`${base_path}/${folder}/ic_launcher_foreground.png`);
    }
    else{}
})