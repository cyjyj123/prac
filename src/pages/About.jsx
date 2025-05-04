import { useState } from "react"
import {Button, MenuItem, Select} from "@material-ui/core"
import "./about.css"
import { Config } from "../utils/Config";
import { translate } from "../utils/translate";

export default function About(){
    const [submenu,setSubmenu]=useState("");
    const [sets,setSets]=useState({lang:Config.lang})

    let content=null;

        if(submenu=="help"){
            content=(
            <div>
                <p>版本：v{process.env.REACT_APP_VERSION}</p>
                <p>本软件的主要功能是练习，您可以加载符合格式的JSON或者CSV文件进行单次练习，也可以加载ZIP文件进行课程的添加。</p>
                <p>作为课程的压缩文件，由若干个单次练习构成，您可以选择这些练习进行练习。</p>
                <p>在本软件中，您也可以制作练习文件，当然，也可以在外部编辑器中制作练习。</p>
                <p>从版本1.0.0开始，如果您需要使用课程列表功能，则需要先选择存储目录并授予权限，课程将会被存储在此目录的courses子目录中，该子目录在不存在时会被自动创建。原Local Storage存储方式被废弃，您可以通过清除浏览器缓存等方式清除原先在其中存储的内容。</p>
                <p></p>
            </div>)
        }else if(submenu=="credits"){
            content=<div><iframe class="aif" src="credits.txt"></iframe></div>
        }else if(submenu=="license"){
            content=<div><p>GPL</p></div>
        }else{}
    
    const settings=
        <div>
            <div>
                <span>{translate("sets_lang")}{translate("sign_colon")}</span>
                <Select value={sets.lang} onChange={e=>{
                    setSets({...sets,lang:e.target.value});
                    Config.lang=e.target.value;
                    Config.save();
                }}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="zh">中文 Chinese</MenuItem>
                    <MenuItem value="jp">日本語　Japanese</MenuItem>
                </Select>
            </div>
        </div>

    return (<div>
        <p>关于</p>
        {settings}
        <Button className="ab" variant="contained" onClick={()=>setSubmenu("help")}>帮助</Button>
        <Button className="ab" variant="contained" onClick={()=>setSubmenu("credits")}>致谢</Button>
        <Button className="ab" variant="contained" onClick={()=>setSubmenu("license")}>许可协议</Button>
        {
            content
        }
    </div>)
}