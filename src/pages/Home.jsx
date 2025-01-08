import { useState } from "react";
import { Button, Checkbox, Chip, FormControlLabel} from "@material-ui/core";
import { translate } from "../utils/translate";
import { Board } from "./Board";
import { Divider } from "@mui/material";
import { styled } from "@mui/material";

export default function Home(props){
    const prac=props.prac;

    const [pcfg,setPcfg]=useState({q_center:false,order_random:false});
    
    let basic_info=<p>{translate("bi_tips")}</p>;
    let authors=null;
    let licenses=null;

    if(prac.authors!=undefined){
        authors= (prac.authors instanceof Array) ? prac.authors.join(",") : prac.authors;
    }else{
        authors=translate("noname");
    }

    if(prac.licenses!=undefined){
        licenses= (prac.licenses instanceof Array) ? prac.licenses.join(",") : prac.licenses;
    }else{
        licenses=translate("nosay");
    }

    if(prac.title!=undefined){
        basic_info=(<div style={{marginTop:"5vh"}}>
            <h3 style={{color:"orange"}}>{prac.title}</h3>
            <Chip style={{color:"grey"}} label={prac.course!=undefined ? `${translate("course")}${translate("sign_colon")}${prac.course}` : "其它课程"} />
            <p style={{color:"grey"}}>{prac.chapter!=undefined ? `章节：${prac.chapter}` : "未分类章节"}</p>
            <p style={{color:"grey"}}>{translate("authors")}{translate("sign_colon")}{authors}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{translate("licenses")}{translate("sign_colon")}{licenses}</p>
            <p style={{margin:"5vh 0"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{prac.description}</p>
        </div>)
    }

    return (
    <div>        
        <p style={{color:"grey"}}>{translate("bi")}</p>
        {basic_info}

        <FormControlLabel style={{color:"grey"}} control={
            <Checkbox  checked={pcfg.q_center} onChange={e=>{
                setPcfg({...pcfg,q_center:e.target.checked})
            }} />
        } label="题目居中" />
        <FormControlLabel style={{color:"grey"}} label="单选题选项乱序"
            control={
                <Checkbox checked={pcfg.order_random} onChange={e=>{
                    setPcfg({...pcfg,order_random:e.target.checked})
                }} />   
            }
        />

        <p><Button variant="contained" style={{backgroundColor:"lightskyblue",width:"95vw"}} onClick={
            ()=>{
                if(props.prac.title!=undefined){
                    props.ChangePracConfig(pcfg)
                    props.ChangePage("prac")
                }else{
                    props.ChangePage("menu")
                }
            }
        }>{translate("sp")}</Button></p>
        <p>
            <span>{prac.version!=undefined ? `版本：${prac.version}` : null }</span>
            <span>{prac.lang!=undefined ? `语言：${prac.lang}` : null }</span>
        </p>
        <p>{navigator.canShare!=undefined && navigator.canShare({text:JSON.stringify(props.prac)}) ? <Button onClick={()=>{
            navigator.share({text:JSON.stringify(prac)})
        }}>分享</Button> : null}</p>
    </div>)
}