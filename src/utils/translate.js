import { Config } from "./Config";

// 格式：key：{语言标志：文字内容}
const dict={
    "title":{
        "en":"Welcome Use Prac",
        "zh":"欢迎使用Prac"
    },
    "scan":{
        "en":"Scan",
        "zh":"扫描"
    },
    "bi":{
        "en":"Basic Info",
        "zh":"基本信息"
    },
    "bi_tips":{
        "en":"Please Choose the Practise File from the menu below",
        "zh":"请先从下方进入目录中，选择练习题"
    },
    "sp":{
        "en":"Start",
        "zh":"开始练习"
    },
    "menu_home":{
        "en":"Home",
        "zh":"首页"
    },
    "menu_menu":{
        "en":"Menu",
        "zh":"目录"
    },
    "menu_about":{
        "en":"About",
        "zh":"关于"
    },
    "noname":{
        "en":"Anonymous",
        "zh":"佚名"
    },
    "nosay":{
        "en":"Unspecified",
        "zh":"未说明"
    },
    "course":{
        "en":"course",
        "zh":"课程"
    },
    "authors":{
        "en":"Author(s)",
        "zh":"作者"
    },
    "licenses":{
        "en":"License(s)",
        "zh":"许可协议"
    },
    sign_colon:{
        "en":":",
        "zh":"："
    },
    sets_lang:{
        "en":"Languag",
        "zh":"Language 语言"
    }
}

export function translate(key){
    const lang=Config.lang;
    const ret=dict[key];

    if(ret!=undefined && ret[lang]!=undefined){
        return ret[lang];
    }else{
        return ret["en"];
    }
}