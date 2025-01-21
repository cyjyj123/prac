import { CapacitorHttp } from "@capacitor/core";
import { ConvertCSV } from "./ConvertCSV";

// string , function,function
export async function urlGet(url,changePrac,changePage=null){
    try{
        let data=null;
        if(process.env.REACT_APP_PLATFORM=="web"){
            const url_fetch=await fetch(url);
            data=await url_fetch.text();
        }else if(process.env.REACT_APP_PLATFORM=="android"){
            const url_get=await CapacitorHttp.get({url,method:"GET"});
            data=url_get.data;
        }else{}

        if(data!=null){
            if(url.endsWith(".json")){
                changePrac(typeof data == "string" ? JSON.parse(data):data);
            }else if(url.endsWith(".csv")){
                const explain=window.prompt("是否含有解析字段？");
                changePrac(ConvertCSV(data,explain));
            }else{}

            if(changePage!=null){
                changePage("home");
            }
        }
    }catch(e){
        alert(e);
    }
}