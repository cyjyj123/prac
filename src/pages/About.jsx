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
                <p>版本：v0.2.0</p>
                <p></p>
            </div>)
        }else if(submenu=="credits"){
            content=<div><iframe class="aif" src="credits.txt"></iframe></div>
        }else if(submenu=="license"){
            content=<div><p>GPL</p></div>
        }else{}

    return (<div>
        <p>关于</p>
        <Button className="ab" variant="contained" onClick={()=>setSubmenu("help")}>帮助</Button>
        <Button className="ab" variant="contained" onClick={()=>setSubmenu("credits")}>致谢</Button>
        <Button className="ab" variant="contained" onClick={()=>setSubmenu("license")}>许可协议</Button>
        {
            content
        }
    </div>)
}