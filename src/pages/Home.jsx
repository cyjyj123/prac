import { useEffect, useState } from "react";
import { Button,ButtonGroup, Checkbox, Chip, FormControlLabel} from "@material-ui/core";
import { translate } from "../utils/translate";

export default function Home(props){
    const prac=props.prac;

    const [pcfg,setPcfg]=useState({q_center:false,order_random:false,qid_center:false});
    
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
            <p style={{margin:"5vh 0"}}>{prac.description}</p>
        </div>)
    }

    return (
    <div>        
        <p style={{color:"grey"}}>{translate("bi")}</p>
        {basic_info}

        <p>
        <FormControlLabel style={{color:"grey"}} control={
            <Checkbox  checked={pcfg.qid_center} onChange={e=>{
                setPcfg({...pcfg,qid_center:e.target.checked})
            }} />
        } label="题号居中" />
        <FormControlLabel style={{color:"grey"}} control={
            <Checkbox  checked={pcfg.q_center} onChange={e=>{
                setPcfg({...pcfg,q_center:e.target.checked})
            }} />
        } label="题目居中" />
        </p>
        <p>
        <FormControlLabel style={{color:"grey"}} label="单选题选项乱序"
            control={
                <Checkbox checked={pcfg.order_random} onChange={e=>{
                    setPcfg({...pcfg,order_random:e.target.checked})
                }} />   
            }
        />
        <FormControlLabel style={{color:"grey"}} label="沉浸式模式" 
            control={
                <Checkbox checked={pcfg.imm_mode} onChange={e=>
                    setPcfg({...pcfg,imm_mode:e.target.checked})
                } />
            }
        />
        </p>

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
            <span style={{color:"grey"}}>{prac.version!=undefined ? `版本：${prac.version}` : null }</span>
            &nbsp;
            <span style={{color:"grey"}}>{prac.lang!=undefined ? `语言：${prac.lang}` : null }</span>
        </p>
        <ButtonGroup variant="text">
        {
            props.prac.contact !=undefined ?
            <Button style={{padding:"0 5vw"}}><a href={props.prac.contact} style={{color:"black",textDecoration:"none"}}>联系方式</a></Button>
            : null
        }
        {navigator.canShare!=undefined && navigator.canShare({text:JSON.stringify(props.prac)}) ? <Button style={{padding:"0 5vw"}} onClick={()=>{
            navigator.share({text:JSON.stringify(prac)})
        }}>分享</Button> : null}
        </ButtonGroup>
    </div>)
}