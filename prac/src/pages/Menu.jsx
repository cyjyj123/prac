import { useEffect, useState } from "react";

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
    const platform=navigator.userAgent.includes("Android") ? "android" : "web";
    const [menu,setMenu]=useState(null);
    const [courses,setCourses]=useState([]);
    const [chapters,setChapters]=useState([]);
    const [selCouId,setSelCouId]=useState(-1);

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
    
    const list=courses.map((v,i)=><p key={i}><button onClick={()=>platform=="web" ? setSelCouId(i) : setChapters(v.data)}>{v.name}</button></p>)
    
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
        <p><input type="file" onChange={(e)=>{
            const file=e.target.files[0];
           readAndGoto(file,props)
        }}></input></p>
        <div>
            {list}
        </div>
        <div>
            {chapters.map((v,i)=><p key={i}>
                <button onClick={async ()=>{
                if(platform=="web"){
                    const pracfile=await v.entry.getFile();
                    readAndGoto(pracfile,props);
                }else{
                    props.ChangePrac(v.data);
                    props.ChangePage("home");
                }
            }}>{v.name}</button></p>)}
        </div>
    </div>)
}