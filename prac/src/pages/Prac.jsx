import { useState } from "react";
import "./prac.css"
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert"

// 标准库，文件中不自带，格式类似，key为以std开头的名字，内容为至少包括type和content的结构
const meta_std={
    "std/basic/image/test":{
        "type":"image",
        "content":""
    }
}

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

function parseMeta(str,meta){
    // 替换latex和元数据，str为传入的字符串，包括普通文本、latex和元数据，meta为传入的元数据的结构，其中包括若干个key作为其名
    
    // 先替换latex
    
    const latexes=str.match(/\$[^\$]+\$/g);
    if(latexes!=null){
    latexes.map(latex=>{
        // 对每一个匹配的latex进行替换，传入的latex例如$x^2$
        const lt=latex.substring(1,latex.length-1); // 获取中间的内容
        const svg=window.MathJax.tex2svg(lt).innerHTML;
        str=str.replace(latex,svg);
    })
}

    // 再替换元数据，之后再说
    const metas=str.match(/#\{.+\}/g);
    if(metas!=null){
    metas.map(m=>{
        // 每个m为一个调用变量的地方，格式#{变量名}
        const m_name=m.substring(2,m.length-1) // 中间的内容
        let m_meta=null;
        if(m_name.startsWith("std/")){
            m_meta=meta_std[m_name];
        }else{
            m_meta=meta[m_name];
        }
        const m_type=m_meta.type;
        const m_content=m_meta.content;

        // 根据其类型进行替换
        if(m_type=="image"){
            str=str.replace(m,`<img src=${m_content} />`);
        }
    })
}

    return str;
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

    let options=null;
    if(prac.questions[id].type=="choice"){
        // 单选
        const ans=prac.questions[id].answer;
        options=prac.questions[id].options.map((v,i)=>
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

        if(sheet[id]=="Unanswer"){
            options.sort((a,b)=>Math.random()-0.5);
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
            <p>（回答区域请不要使用latex，多个空白处请换行）</p>
            <textarea onChange={(e)=>setBlankUserAns(e.target.value)}></textarea>
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

    let explain_button=null;
    if(sheet[id]!="Unanswer"){
    explain_button=(<div>
        <p><button onClick={()=>explainVisible==false ? setExplainVisible(true) : setExplainVisible(false)}>查看解析</button></p>
        {
        explainVisible==true ? <div dangerouslySetInnerHTML={{__html:parseMeta(prac.questions[id].explain,prac.meta)}}>
        </div> : null
        }
        </div>)
    }

    return (
        <div>

            <p>第{id+1}题</p>
            <div>
                <div dangerouslySetInnerHTML={{__html:parseMeta(prac.questions[id].question,prac.meta)}}></div>
                {options}
            </div>

            {explain_button}

            <p>
                <button onClick={()=>{
                    if(id!=0){
                        setExplainVisible(false);
                        
                        setBlankUserAns("");
                        setMchoiceUserAns([]);

                        setId(id-1);
                    }
                }}>上一题</button>
                <button onClick={()=>{
                    if(id!=MAX-1){
                        setExplainVisible(false);

                        setBlankUserAns("");
                        setMchoiceUserAns([]);
                        
                        setId(id+1);
                    }
                }}>下一题</button>
            </p>

                {result_feed}
        </div>
    )
}