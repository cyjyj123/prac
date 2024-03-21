import { useEffect, useState } from "react";
import JSZip from "jszip"
import "./menu.css"

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
    
    const list=courses.map((v,i)=><p key={i}><button onClick={()=>{
        if(platform=="web") {setSelCouId(i) }else{setChapters(v.data);}
    }}>{v.name}</button></p>)
    
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

    return (<div>
        {platform=="web" ? storage_menu : null}
        <p>当前的存储目录为{menu!=null ? menu.name : "localStorage"}</p>
        <p><input type="file" onChange={async (e)=>{
            const file=e.target.files[0];
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
        <hr/>
        <div><h3>{chapters.length==0 ? "课程列表" : "章节或练习列表"}</h3></div>
        <hr/>
        <div class="course">
            {chapters.length==0 ? list : null}
        </div>
        <div class="chapter">
            {chapters.length!=0 ? <button onClick={()=>setChapters([])}>返回</button> : null}
        </div>
        <div class="chapter">
            {chapters.map((v,i)=><p key={i}>
                <button onClick={async ()=>{
                if(platform=="web"){
                    const pracfile=await v.entry.getFile();
                    readAndGoto(pracfile,props);
                }else{
                    if(!v.data instanceof Array){
                        props.ChangePrac(v.data);
                        props.ChangePage("home");
                    }else{
                        setPracWithChapter(v.data);
                    }
                }
            }}>{v.name}</button></p>)}
        </div>

        <div>
            { 
                pracWithChapter.length!=0 ? pracWithChapter.map(v=><p onClick={()=>{
                    props.ChangePrac(v.data);
                        props.ChangePage("home");
                }}>{v.name}</p>) : null
            }
        </div>

        <div>
            <p><button onClick={()=>{localStorage.clear();setCourses([])}}>清空存储</button></p>
        </div>
    </div>)
}