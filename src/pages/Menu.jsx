import { useEffect, useState,useRef } from "react";
import JSZip from "jszip"
import "./menu.css"
import {Button, Card, CardContent, CardHeader} from "@material-ui/core"

function readAndGoto(file,props){
    const fr=new FileReader();
    fr.readAsText(file);
    fr.onloadend=()=>{
        const prac=JSON.parse(fr.result);
        props.ChangePrac(prac);
        props.ChangePage("home");
    }
}

export default function Menu(props){
    const platform="unknown";
    //const platform=navigator.userAgent.includes("Android") ? "android" : "web";
    const [menu,setMenu]=useState(null);
    const [courses,setCourses]=useState([]);
    const [chapters,setChapters]=useState([]);
    const [selCouId,setSelCouId]=useState(-1);
    const [pracWithChapter,setPracWithChapter]=useState([]);

    // 默认存储方式，localStorage，位于key=courses的，格式数组，每个元素为包括name和data
    useEffect(()=>{const data=localStorage.getItem("courses");
    if(data!=null){
        setCourses(JSON.parse(data));
    }
},[])
    
    //console.log(props)
    const storage_menu=(
        <div>
            <p><button onClick={async ()=>{
                if(platform=="web"){
                    const menu_root=await window.showDirectoryPicker();
                    setMenu(menu_root);

                    const courses_menu=await menu_root.getDirectoryHandle("courses");
                    let cou=[];
                    for await (let [k,v] of courses_menu.entries()){
                        cou.push({name:k,entry:v});
                    }
                    setCourses(cou);
                }
            }}>选择存储目录</button></p>
        </div>
    )
    
    //const course_json=chapters.filter(v=>v.name=="course.json");
    //console.log(course_json)
    const list=courses.map((v,i)=>{
        const course_json=v.data.filter(v=>v.name=="course.json");
        console.log(v.data,course_json)

        const v_real_name_split_idx=v.name.match(/-[^-]*$/);
        const v_real_name=v.name.substring(0,v_real_name_split_idx.index);
        const create_time_str=v.name.substring(v_real_name_split_idx.index+1);
        console.log(create_time_str)
        const create_time=new Date(parseInt(create_time_str))

        return <Card key={i} variant="outlined"  className="course" onClick={()=>{
            if(platform=="web") {setSelCouId(i) }else{setChapters(v.data);}
        }}>
            <CardContent>
                <Button>{v_real_name}</Button>
                <p style={{color:"grey"}}>添加时间：{create_time.toLocaleString()}</p>
                {course_json.length!=0 ? <p>{course_json[0].data.introduction}</p>:null}
            </CardContent>
        </Card>
        })
    
    // 课程章节，虽然不一定分章节
    if(selCouId!=-1){
        (async()=>{
       
            const now_cou=courses[selCouId]; // 当前课程，类型：{name:课程名，entry:处理文件}
            const chapter_files=[] // 课程里面的练习文件
            
            
            if(platform=="web"){
                for await (const [k,v] of now_cou.entry.entries()){
                    chapter_files.push({name:k,entry:v});
                }

                setChapters(chapter_files);
            }else{
                setChapters(now_cou.data);
            }
        })()
    }

    const fileChooseRef=useRef(null);

    return (<div>
        {platform=="web" ? storage_menu : null}
        <p style={{color:"grey"}}>当前的存储目录为{menu!=null ? menu.name : "localStorage"}</p>
        <p style={{color:"red"}}>进行单个练习，请从下面的文件选择框中选择一个JSON文件，如果选择ZIP文件，将会加载并存储课程到下面的列表中。</p>
        <Button style={{backgroundColor:"lightskyblue",color:"white",fontSize:"32px",width:"80vw"}} onClick={()=>{
            fileChooseRef.current.click();
        }}>选择文件</Button>
        <p>
            <button onClick={async ()=>{
                const prac_json_url=window.prompt().trim();
                if(prac_json_url!=""){
                    const url_fetch=await fetch(prac_json_url);
                    const url_json=await url_fetch.json();
                    props.ChangePrac(url_json);
                    props.ChangePage("home");
                }
            }}>从网址导入</button>
            <button onClick={()=>{props.ChangePage("maker")}}>制作题目</button>
        </p>
        <p><input style={{display:"none"}} ref={fileChooseRef} type="file" onChange={async (e)=>{
            const file=e.target.files[0];
            console.log(file.name)
            if(file.name.endsWith(".json")){
                // 单练习文件直接加载
                readAndGoto(file,props)
            }else if(file.name.endsWith(".zip")){
                // 单个课程多练习文件，解压，存储，不跳转
                const zip=new JSZip();
                const zipfile=await zip.loadAsync(file);
                let course_this={data:[],name:file.name.replace(/\.zip$/,"")+"-"+Date.now()} // 默认课程名为不包括后缀名的文件名加上连词符加上毫秒时间戳
                
                window.test=zipfile

                for(let p in zipfile.files){
                    const p_name=zipfile.files[p].name;
                    console.log("p_name",p_name)

                    if(p_name.endsWith("/")){
                        continue;
                    }

                    const p_data=JSON.parse(await zipfile.files[p].async("string"));
                    
                    if(!p_name.includes("/")){
                        course_this.data.push({name:p_name,data:p_data});
                    }else{
                        const folder_file=p_name.split("/");
                        if(course_this.data.filter(v=>v.name==folder_file[0]).length!=0){
                            let idx=-1;
                            for(let i=0;i<course_this.data.length;i++){
                                if(course_this[i].name==folder_file[0]){
                                    idx=i;
                                    break;
                                }
                            }

                            if(idx!=-1){
                                course_this.data[idx].data.push({name:folder_file[1],data:p_data});
                            }
                        }else{
                            course_this.data.push({name:folder_file[0],data:[{name:folder_file[1],data:p_data}]})
                        }
                    }

                    
                }

                courses.push(course_this);
                localStorage.setItem("courses",JSON.stringify(courses));
                setCourses([...courses]);
            }else{
                alert("暂不支持该文件！")
            }
        }}></input></p>
        <hr style={{margin:"25px 0"}}/>
        <div><h3>{chapters.length==0 ? "课程列表" : "章节或练习列表"}</h3></div>

        <div>
            {chapters.length==0 ? list : null}
        </div>
        <div className="chapter">
            {chapters.length!=0 ? <Button variant="outlined" onClick={()=>setChapters([])}>返回</Button> : null}
        </div>
        <div className="chapter">
            {chapters.map((v,i)=>
                <p key={i}>
                    { v.data instanceof Array ? <Button style={{width:"100vw"}} variant="contained" onClick={async ()=>setPracWithChapter(v.data)}>{v.name}</Button>
                    :<span style={{display:v.name=="course.json"?"none":"inline"}} onClick={async ()=>{
                        if(platform=="web"){
                            const pracfile=await v.entry.getFile();
                            readAndGoto(pracfile,props);
                        }else{
                            props.ChangePrac(v.data);
                            props.ChangePage("home");
                        }
                    }}>{`${v.name} 进入练习`}</span>
            }  
            </p>
        )}
        </div>

        <div>
            { 
                pracWithChapter.length!=0 ? pracWithChapter.map(v=><p onClick={()=>{
                    props.ChangePrac(v.data);
                        props.ChangePage("home");
                }}><span style={{color:"grey"}}>({v.name})</span> {v.data.title}</p>) : null
            }
        </div>

        <div style={{marginTop:"5vh"}}>
            <p><button onClick={()=>{
                const okq=window.confirm("Are you sure clear the storage?");
                if(okq){
                    localStorage.clear();
                    setCourses([])
                }
            }}>清空存储</button></p>
        </div>
    </div>)
}