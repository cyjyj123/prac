import { useState } from "react";
import { Button } from "@material-ui/core";

export default function Home(props){
    const prac=props.prac;
    
    let basic_info=<p>请先从下方进入目录中，选择练习题</p>;
    let authors=null;
    let licenses=null;

    if(prac.authors!=undefined){
        authors= (prac.authors instanceof Array) ? prac.authors.join(",") : prac.authors;
    }else{
        authors="佚名";
    }

    if(prac.licenses!=undefined){
        licenses= (prac.licenses instanceof Array) ? prac.licenses.join(",") : prac.licenses;
    }else{
        licenses="未说明";
    }

    if(prac.title!=undefined){
        basic_info=(<div>
            <h3 style={{color:"orange"}}>{prac.title}</h3>
            <p style={{color:"grey"}}>{prac.course!=undefined ? `课程：${prac.course}` : "其它课程"} {prac.chapter!=undefined ? `章节：${prac.chapter}` : "未分类章节"}</p>
            <p>作者：{authors}</p>
            <p>许可协议：{licenses}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{prac.description}</p>
        </div>)
    }

    return (
    <div>        
        <p style={{color:"grey"}}>基本信息</p>
        {basic_info}
        <hr/>
        
        <p><Button variant="contained" style={{backgroundColor:"lightskyblue",width:"95vw"}} onClick={
            ()=>{
                    props.ChangePage("prac")
            }
        }>开始练习</Button></p>
    </div>)
}