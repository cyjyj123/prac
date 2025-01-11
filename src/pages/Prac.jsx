import { useState } from "react";
import "./prac.css"
import { Avatar, Button,Chip, Dialog, DialogContent, DialogTitle,Drawer } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert"
import { parseMeta } from "../utils/parseMeta";
import Tips from "./Tips";
import GridIcon from "@mui/icons-material/GridOn"
import Grid from "@mui/material/Grid2";

function showResult(result,id,sheet,setSheetFunc){
    if(result=="Correct"){
        //alert("回答正确");
        sheet[id]="Correct";
        setSheetFunc([...sheet])
    }else if(result=="Error"){
      //  alert("回答错误")
        sheet[id]="Error";
        setSheetFunc([...sheet])
    }else{}
}



export default function Prac(props){
    const prac=props.prac;

    const MAX=prac.questions.length; // 此次练习的题目数量
    let init_sheet=[]
    for(let i=0;i<MAX;i++){
        init_sheet.push("Unanswer")
    }

    const [sheet,setSheet]=useState(init_sheet); // 答题卡，记录答题情况，初始为未答题状态
    const [id,setId]=useState(0); // 当前正在回答的题目下标，从0（即第1题）开始计算
    const [explainVisible,setExplainVisible]=useState(false);

    const [blankUserAns,setBlankUserAns]=useState("");
    const [mchoiceUserAns,setMchoiceUserAns]=useState([]);

    const [optionsSort,setOptionsSort]=useState([]); // 乱序顺序，每个元素为一个数组，代表该题的从第一个选项开始的对应源文件中选项的顺序

    const [kn_dialog,setKnDialog]=useState(-1);

    const [all_sheet,setAllSheet]=useState(false);

    let options=null;
    if(prac.questions[id].type=="choice"){
        // 单选
        const ans=prac.questions[id].answer;

        const init_options=prac.questions[id].options.map((v,i)=>
            <p><button key={i} className="option" score={i==ans ? 1 : 0} style={{background:sheet[id]=="Correct" && ans==i ? "lightskyblue" : "transparent"}} dangerouslySetInnerHTML={{__html:parseMeta(v,prac.meta)}} onClick={(e)=>{
                const score=e.target.getAttribute("score");
                if(score==1){    
                    
                    showResult("Correct",id,sheet,setSheet);
                }else{
                    
                    showResult("Error",id,sheet,setSheet);
                }
                //setSheet(before_sheet);
            }}></button></p>
        )

        if(optionsSort[id]==undefined){
            // 未乱序时乱序
            console.log("乱序")
            let afterrand=[]; // 初始为未乱序，最终为乱序后的顺序
            for(let i=0;i<prac.questions[id].options.length;i++){
                afterrand.push(i);
            }

            if(props.PracConfig.order_random){
                // 设置乱序时乱序，否则不乱序
                afterrand.sort((a,b)=>Math.random()-0.5);
            }
            
            options=[];
            for(let i=0;i<afterrand.length;i++){
                options[i]=init_options[afterrand[i]];
            }

            optionsSort[id]=afterrand;
            setOptionsSort([...optionsSort])
        }else{
            // 已乱序，则按乱序后的顺序排序
            console.log("已乱序",optionsSort[id])
            options=[];
            for(let i=0;i<optionsSort[id].length;i++){
                options[i]=init_options[optionsSort[id][i]]
            }
        }
    }else if(prac.questions[id].type=="mchoice"){
        // 之后再说
        const ans=prac.questions[id].answer;
        let initUserAns=[];
        for(let i=0;i<prac.questions[id].options.length;i++){
            initUserAns.push(false);
        }
        //console.log(initUserAns)
        if(mchoiceUserAns.length==0)
        { 
            setMchoiceUserAns(initUserAns)
        }
        options=prac.questions[id].options.map((v,i)=>
            <p><button key={i} className="option"  score={ans.includes(i) ? 1 : 0} style={{backgroundColor:mchoiceUserAns[i]==true || sheet[id]=="Correct" && ans.includes(i) ? "lightskyblue" : "transparent"}} dangerouslySetInnerHTML={{__html:parseMeta(v,prac.meta)}} onClick={(e)=>{
                let userAns=mchoiceUserAns;
                //console.log(userAns)
                if(userAns[i]==false){
                   // e.target.style.backgroundColor="lightskyblue";
                    userAns[i]=true;
                }else{
                   // e.target.style.backgroundColor="transparent";
                    userAns[i]=false;
                }
                setMchoiceUserAns([...userAns]);
                
            }}></button></p>
        );



        options.push(<p><button onClick={()=>{
            let is_correct=true;
            const seled=mchoiceUserAns.filter(v=>v==true);
            if(seled==null || seled.length!=ans.length){
                is_correct=false;
            }

            if(is_correct!=false){
                for(let i=0;i<ans.length;i++){
                    if(mchoiceUserAns[ans[i]]==false){
                        is_correct=false;
                    }
                }
            }

            //let before_sheet=sheet;
            if(is_correct==true){
                
                showResult("Correct",id,sheet,setSheet);
            }else{
                
                showResult("Error",id,sheet,setSheet);
            }

            //setSheet(before_sheet);
            

            setMchoiceUserAns([...initUserAns]);
        }}>检查</button></p>)
    }else if(prac.questions[id].type=="blank"){
        options=(<div>
            <p style={{color:"grey"}}>（回答区域请不要使用latex，多个空白处请换行）</p>
            <textarea onChange={(e)=>setBlankUserAns(e.target.value)} style={{width:"90vw",height:"20vh"}}></textarea>
            <button onClick={()=>{
                const ans=prac.questions[id].answer; // 标准答案，可能是字符串或者字符串数组
                //let before_sheet=sheet;
                if(ans instanceof Array){
                    // 字符串数组
                    const userAns=blankUserAns.split("\n"); // 用户回答，必须每个一一对应才对
                    let result=true;
                    if(userAns.length!=ans.length){
                        result=false;
                    }

                    if(result!=false){
                        for(let i=0;i<ans.length;i++){
                            if(userAns[i]!=ans[i]){
                                result=false;
                                break;
                            }
                        }
                    }

                    if(result==true){
                        
                        showResult("Correct",id,sheet,setSheet);
                    }else{
                        
                        showResult("Error",id,sheet,setSheet);
                    }
                }else{
                    // 单字符串
                    if(blankUserAns==ans){
                        
                        showResult("Correct",id,sheet,setSheet);
                    }else{
                        
                        showResult("Error",id,sheet,setSheet);
                    }
                }
            }}>确定</button>
        </div>)
    }else{}

    let result_feed=null;
    console.log("Update")
    if(sheet[id]=="Correct"){
        result_feed=<Alert severity="success">回答正确</Alert>
    }else if(sheet[id]=="Error"){
        result_feed=<Alert severity="error">回答错误</Alert>
    }else{}

    const show_knows=prac.questions[id].knows==undefined ? null :
        <div style={{textAlign:"left"}}>
            {
                prac.questions[id].knows.map((kn,kn_key)=>
                    <Chip style={{margin:"2px",padding:"0 2px"}} label={prac.knows[kn].title} key={kn_key} onClick={()=>{
                        setKnDialog(kn);
                    }} />
                )
            }
        </div>

    let explain_button=null;
    if(sheet[id]!="Unanswer" || prac.questions[id].type=="answer" || prac.questions[id].type=="solution"){
    explain_button=(<div>
        <p><Button variant="contained" style={{width:"95vw"}} onClick={()=>explainVisible==false ? setExplainVisible(true) : setExplainVisible(false)}>查看解析</Button></p>
        {
        explainVisible==true ? 
            <div>
                {prac.questions[id].knows!=undefined ? show_knows : null}
                <div dangerouslySetInnerHTML={{__html:prac.questions[id].explain!=undefined ? parseMeta(prac.questions[id].explain,prac.meta):`<p>暂无解析</p>`}}>
                </div>
            </div>
            : null
        }
        </div>)
    }

    return (
        <div>

            <p style={{color:"grey",marginTop:"2px",textAlign:props.PracConfig.qid_center?"center":"left",paddingLeft:props.PracConfig.qid_center?0:"5px",paddingTop:"2px"}}>第{id+1}题</p>
            <div>
                <div style={{marginBottom:"5vh",padding:"5px",textAlign:props.PracConfig.q_center==true?"center":"left"}} dangerouslySetInnerHTML={{__html:parseMeta(prac.questions[id].title ?? prac.questions[id].question,prac.meta)}}></div>
                {options}
            </div>

            {result_feed}

            {prac.questions[id].tips!=undefined ? <Tips tips={prac.questions[id].tips} /> : null}

            {explain_button}

            <p style={{marginTop:"5vh"}}>
                <Button style={{backgroundColor:"#fdedec",width:"46vw",marginRight:"0.5vw"}} onClick={()=>{
                    if(id!=0){
                        setExplainVisible(false);
                        
                        setBlankUserAns("");
                        setMchoiceUserAns([]);

                        setId(id-1);
                    }
                }}>上一题</Button>
                <GridIcon onClick={()=>{setAllSheet(true)}} style={{color:"grey"}} />
                <Button style={{backgroundColor:"lightskyblue",width:"46vw",marginLeft:"0.5vw"}} onClick={()=>{
                    if(id!=MAX-1){
                        setExplainVisible(false);

                        setBlankUserAns("");
                        setMchoiceUserAns([]);
                        
                        setId(id+1);
                    }else{
                        // 跳转到完成页面
                        props.ChangePage("finish")
                    }
                }}>下一题</Button>
            </p>

            <Dialog open={kn_dialog!=-1?true:false} onClose={()=>{setKnDialog(-1)}}>
                <DialogTitle>
                    <p>知识点：{kn_dialog!=-1 ? prac.knows[kn_dialog].title :null}</p>
                </DialogTitle>
                <DialogContent>
                    {
                        kn_dialog!=-1 ?
                        prac.knows[kn_dialog].content.map((dlg_v,dlg_v_key)=>
                        <div key={dlg_v_key} dangerouslySetInnerHTML={{__html:parseMeta(dlg_v,prac.meta)}}>

                        </div>)
                        : null
                    }
                </DialogContent>
            </Dialog>
            <Drawer open={all_sheet} onClose={()=>{setAllSheet(false)}} anchor={'bottom'}>
                    <Grid container spacing={2}>
                    {
                        sheet.map((q,q_key)=>
                            <Grid key={q_key} size={2} style={{padding:"2px"}}>
                                <Avatar style={{backgroundColor:q=="Correct" ? "green" : (q=="Error" ? "red" : "grey")}} onClick={()=>{
                                    setExplainVisible(false);

                                    setBlankUserAns("");
                                    setMchoiceUserAns([]);
                                    
                                    setId(q_key);

                                    setAllSheet(false);
                                }}>{q_key+1}</Avatar>
                            </Grid>
                        )
                    }
                    </Grid>
            </Drawer>
        </div>
    )
}