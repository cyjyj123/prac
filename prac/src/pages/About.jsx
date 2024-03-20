import { useEffect, useState } from "react"
import {Button} from "@material-ui/core"
import "./about.css"

export default function About(){
    const [submenu,setSubmenu]=useState("");

    let content=null;

        if(submenu=="help"){
            content=(
            <div>
                <p>Hello，您好，欢迎使用本软件，当前的有些功能还尚未完善，暂且请先不要使用这些功能。</p>
                <p>当前，较为完善的功能是：打开单文件进行练习，以后将会支持使用打包好的课程练习文件进行练习。</p>
            </div>)
        }else if(submenu=="credits"){
            content=<div><iframe class="aif" src="credits.txt"></iframe></div>
        }else if(submenu=="license"){
            content=<div><p>GPL</p></div>
        }else{}

    return (<div>
        <p>关于</p>
        <Button class="ab" variant="contained" onClick={()=>setSubmenu("help")}>帮助</Button>
        <Button class="ab" variant="contained" onClick={()=>setSubmenu("credits")}>致谢</Button>
        <Button class="ab" variant="contained" onClick={()=>setSubmenu("license")}>许可协议</Button>
        {
            content
        }
    </div>)
}