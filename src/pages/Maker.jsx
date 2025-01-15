import { TextField,Button, MenuItem ,Select} from "@material-ui/core";
import { useRef, useState } from "react";

export function Maker(props){
    let _out={title:"",chapter:"",description:"",questions:[],meta:{}};
    const [out,setOut]=useState(_out)
    let [nowedit,setNowEdit]=useState(-1);

    const downbut=useRef(null);

    const [edit_type,setEditType]=useState("choice");
    const [edit_title,setEditTitle]=useState("");
    const [edit_options,setEditOptions]=useState([]);
    const [edit_option,setEditOption]=useState("");
    const [edit_answers,setEditAnswers]=useState([])
    const [edit_blank,setEditBlank]=useState("'")

    const [edit_explain,setEditExplain]=useState("")

    const [meta_name,setMetaName]=useState("");
    const [meta_type,setMetaType]=useState("");
    const [meta_content,setMetaContent]=useState("");

    const show_opts= <div>
    <div>
        <p>选项 请点击选择正确答案</p>
        {
            edit_options.map((opt,opt_key)=><Button style={{width:"100vw",backgroundColor:edit_answers.includes(opt_key)?"green":"transparent"}} key={opt_key} onClick={()=>{
                if(edit_answers.includes(opt_key)){
                    if(edit_type=="choice"){
                        setEditAnswers([])
                    }else{
                        const _arr=[...edit_answers].splice(edit_answers.indexOf(opt_key),1);
                        setEditAnswers([..._arr]);
                    }
                }else{
                    if(edit_type=="choice"){
                        setEditAnswers([opt_key])
                    }else{
                        setEditAnswers([...edit_answers,opt_key])
                    }
                }
            }}>{opt}</Button>)
        }
    </div>
    <div>
        <TextField label="选项" value={edit_option} onChange={e=>{setEditOption(e.target.value)}} />
        <Button variant="outlined" onClick={()=>{
            setEditOptions([...edit_options,edit_option]);
            setEditOption("");
        }}>添加选项</Button>
    </div>
    
</div>

    const show_blank=
        <div>
            <TextField label="正确答案" multiline value={edit_blank} onChange={e=>{
                setEditBlank(e.target.value)
            }} />
        </div> 

    const question_edit= <div>
        <p>{nowedit != -1 ? `第${nowedit+1}题`:"" }</p>
        <div>
        <Select style={{width:"80vw"}} value={edit_type} onChange={(e)=>{
            setEditType(e.target.value)
        }}>
            <MenuItem value={"choice"}>单选</MenuItem>
            <MenuItem value={"mchoice"}>多选</MenuItem>
            <MenuItem value={"blank"}>填空</MenuItem>
        </Select>
        </div>
        <div>
            <TextField style={{width:"80vw"}} minRows={5} label="题目" multiline value={edit_title} onChange={(e)=>{setEditTitle(e.target.value)}} />
        </div>
       {edit_type!="blank"?show_opts:show_blank}
        <div>
            <TextField multiline label="解析" value={edit_explain} onChange={e=>{setEditExplain(e.target.value)}} />
        </div>
        <div>
            <Button onClick={()=>{
                let now={type:edit_type,title:edit_title,explain:edit_explain};

                if(edit_type=="choice"){
                    now.answer=edit_answers[0];
                }else if(edit_type=="mchoice"){
                    now.answer=edit_answers.sort((a,b)=>a-b);
                }else if(edit_type=="blank"){
                    now.answer=edit_blank.split("\n");
                }else{}

                out.questions[nowedit]=now;
                setOut({...out,questions:out.questions})
                console.log(out.questions)
            }}>确定</Button>
        </div>    
    </div>

    const basic_info=
            <div>
                <p style={{color:"grey"}}>基本信息</p>
                    <p>
                        <TextField style={{width:"80vw"}} label="练习标题" value={out.title} onChange={e=>{
                            setOut({...out,title:e.target.value})
                        }} />
                    </p>
                    <p>
                        <TextField label="所属课程" />
                        <TextField label="章节" />
                    </p>
                    
                    
                    <p size={6}>
                        <TextField label="作者" />
                        <TextField label="许可协议" />
                    </p>
                    <p><TextField label="简介" multiline minRows={5} style={{width:"80vw"}} /></p>
            </div>
    
    const middle_meta=(
        <div>
            <p>添加嵌入的数据</p>
            <p><TextField label="名称" value={meta_name} onChange={e=>{setMetaName(e.target.value)}} /></p>
            <p><input type="file" onChange={e=>{
                const file=e.target.files[0];
                const fr=new FileReader();
                fr.readAsDataURL(file);
                fr.onloadend=()=>{
                    console.log(fr.result)
                }
            }} /></p>
        </div>
    )

    let middle=null;
    if(nowedit==-1 ){
        middle=basic_info;
    }else if(nowedit==-2){
        middle=middle_meta;
    }else{middle=question_edit;}

    return (
        <div>
            <p>制作练习题</p>
            <p>
                <Button onClick={()=>{
                    setOut(_out)
                    setNowEdit(-1)
                }}>New File</Button>
                <Button onClick={()=>{
                const _o=out.questions
                _o.push({})
                setOut({...out,questions:_o})
                setNowEdit(out.questions.length-1)

                setEditTitle("")
                setEditOptions([])
                setEditOption("")
                setEditAnswers([])
                setEditBlank("")
                setEditExplain("")
            }}>New Question</Button>
            <Button onClick={()=>{setNowEdit(-2)}}>添加数据</Button>
            <Button onClick={()=>{
                if(out.title.trim()==""){
                    alert("标题不能为空")
                    return;
                }

                console.log("输出",out)

                const out_file=new Blob([JSON.stringify(out)],{type:"text/plain"});
                const out_fr=new FileReader();
                out_fr.readAsDataURL(out_file);
                out_fr.onloadend=(out_fr_evt)=>{
                    if(downbut.current!=null){
                        downbut.current.href=out_fr_evt.target.result;
                        downbut.current.download=`${out.title}.json`
                        downbut.current.click();
                    }
                }
            }}>Save</Button>
        </p>
            {middle}
        <p><a ref={downbut}></a></p>
        </div>
    )
}