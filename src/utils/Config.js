export class Config{
    static lang=undefined;
    static load(){
        const config=localStorage.getItem("config");
        if(config==null){
            // 初始化采用默认值
            Config.lang=navigator.language.split("-")[0];
        }else{
            const data=JSON.parse(config);
            for(let key in data){
                Config[key]=data[key];
            }
        }
    }
    static save(){
        let data={};
        for(let key in Config){
            data[key]=Config[key];
        }
        localStorage.setItem("config",JSON.stringify(data));
    }
}