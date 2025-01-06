import { useState } from "react";
import {parseMeta} from "../utils/parseMeta"
import {Card, CardContent, CardHeader} from "@material-ui/core"

export default function Knows(props){
    const prac=props.prac;

   
    const [status,setStatus]=useState("menu"); // menu或者列表下标分别代表知识点列表和具体知识点内容在数组中的索引
    const knowsList=prac.knows.map((v,i)=>
        <Card onClick={()=>setStatus(i)} variant="outlined" style={{marginBottom:"2px"}}>
            <CardContent>
                <h3 style={{textAlign:"left",fontStyle:"italic"}}>{i+1}</h3>
                <p style={{textAlign:"right"}}>{v.title}</p>
            </CardContent>
        </Card>
    )
    return (
        <div>
            <h1>知识点列表</h1>
            {
                status=="menu" ?
                <div>
                    {knowsList}
                </div> :
                <div>
                    <p><button style={{backgroundColor:"lightskyblue",border:0,width:"80vw",padding:"5px",borderRadius:"5%"}} onClick={()=>setStatus("menu")}>返回列表</button></p>
                    
                    <p style={{color:"grey",textAlign:"left"}}>知识点：{prac.knows[status].title}</p>
                    {prac.knows[status].content.map(v=>
                        <div style={{textAlign:"left",lineHeight:"2em",padding:"1vw"}} dangerouslySetInnerHTML={{__html:parseMeta(v,prac.meta)}}>
                        </div>)}
                    <p>&nbsp;</p>
                </div>
            }
        </div>
    )
}