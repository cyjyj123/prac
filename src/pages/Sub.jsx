import { Button } from "@material-ui/core";
import { useState } from "react";
import { parseMeta } from "../utils/parseMeta";

const getNumbers=(idx)=>{
    const type_nums=["零","一","二","三","四","五","六","七","八","九","十"];
    return `（${type_nums[idx]}）`;
}
function convertPracToPrint(prac){
    // 转换prac为方便打印的格式，但不进行打印，返回字符串
    // 默认为HTML，按单选、多选、填空

   

    let ret="";
    ret+=`<h1 style="text-align:center">${prac.title}</h1>`;

    let type_id=0;
    let qid=0; // 题号

    const q_choices=prac.questions.filter(q=>q.type=="choice"); // 单选
    const q_mchoices=prac.questions.filter(q=>q.type=="mchoice"); // 多选
    const q_blanks=prac.questions.filter(q=>q.type=="blank"); // 填空

    const q_answers=prac.questions.filter(q=>q.type=="answer"); // 简答
    const q_solutions=prac.questions.filter(q=>q.type=="solution"); // 解答

    if(q_choices.length!=0){
        type_id+=1;
        ret+=`<p style="text-align:left">${getNumbers(type_id)}单项选择</p>`;
        q_choices.map(q=>{
            // 对于每个单选题
            qid+=1;
            ret+=`<p style="text-align:left"> ${qid}. ${parseMeta(q.title ?? q.question,q.meta)}</p>`;
            
            // 设置选项
            const opts=q.options.map((opt,opt_i)=>{
                return ` (${String.fromCharCode(opt_i+65)}) ${parseMeta(opt,q.meta)}`;
            })
            let opt_length=0;
            q.options.map(opt=>opt_length+=opt.length+5);

            const wrap_need=opt_length>=(595/20)?true:false;

            if(wrap_need==false){
                ret+=`<pstyle="text-align:left">`
            }

            ret+=opts.map(opt=>wrap_need?`<p style="text-align:left">${opt}</p>`:`<span>${opt}</span>`).join("");
        
            if(wrap_need==false){
                ret+=`<pstyle="text-align:left">`
            }

            ret+=`<p>&nbsp;</p>`;
        })
    }

    return ret;
}
export default function Sub(props){
    const [preview,setPreview]=useState("");
    return (
        <div>
            <p>子题库</p>
            <Button onClick={()=>{
                const out=convertPracToPrint(props.prac);
                setPreview(out)
                window.page_raw=document.body.innerHTML;
                document.body.innerHTML=out;
                window.print();
                document.body.innerHTML=window.page_raw;
            }}>全部打印</Button>
            <div style={{width:"100vw"}} dangerouslySetInnerHTML={{__html:preview}}></div>
        </div>
    )
}