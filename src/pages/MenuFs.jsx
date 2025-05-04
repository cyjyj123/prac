import { useEffect, useState } from "react";
import {get,set} from "idb-keyval";
import { Button, CardContent,Card } from "@material-ui/core";
import { ConvertCSV,readAndGoto } from "../utils/ConvertCSV";
import FileChooser from "./FileChooser";

async function getCourses(courses_root){
    let l=[];
    for await (const entry of courses_root.entries()){
        let course_json=null;
        if(entry[1].name.startsWith(".")){
            continue;
        }
        for await (const filename of entry[1].keys()){
            if(filename=="course.json"){
                const f=await entry[1].getFileHandle("course.json");
                const file=await f.getFile();
                
                const file_content=await new Promise((Ok,Err)=>{
                    const fr=new FileReader();
                    fr.readAsText(file);
                    fr.onloadend=e=>{
                        Ok(fr.result);
                    }
                })
                course_json=JSON.parse(file_content);
                break;
            }
        }
        l.push(course_json==null?{fn:entry[0],title:entry[0]}:{...course_json,fn:entry[0]});
    }
    return l;
}

export default function MenuFs(props){
    let [courses_root,setCoursesRoot]=useState(null);
    const [list,setList]=useState([]);
    const [path,setPath]=useState(["/"]);

    useEffect(()=>{
        (async()=>{
            try{
            const fs=await get("fs");
            if(fs!=undefined){
                courses_root=await fs.getDirectoryHandle("courses");
                setCoursesRoot(courses_root);

                setList(await getCourses(courses_root));
            }
        }catch(e){
        }
        })()
    },[])

   

    return (
        <div>
            <FileChooser ChangePage={(page_name)=>{props.ChangePage(page_name)}} ChangePrac={v=>props.ChangePrac(v)} CourseUpdate={async ()=>{
                setList([...await getCourses(courses_root)]);
            }} />
            <p>
                <Button onClick={async ()=>{
                    const handle=await window.showDirectoryPicker();
                    await set("fs",handle);
                    setCoursesRoot(await handle.getDirectoryHandle("courses",{create:true}));
                }}>选择根目录</Button>
            </p>
            <div>
            {path.length==1?
                
                    list.map((course,i)=>{
                        // /const f=
                        return( 
                            <Card key={i} onClick={async ()=>{
                                setPath([...path,course.fn]);
                                const c=await courses_root.getDirectoryHandle(course.fn);
                                let l=[];
                                for await (const entry of c.entries()){
                                    if(!entry[0].startsWith("."))
                                        l.push(entry);
                                }
                                console.log("cc",l)
                                setList(l.filter(v=>v[0]!="course.json"));
                            }}>
                                <CardContent>
                                    <h1>{course.title?.split("-").slice(1).join("-")}</h1>
                                    <p style={{color:"grey"}}>添加时间：{new Date(parseInt(course.title?.split("-")[0])).toLocaleString()}</p>
                                    {course.introduction!=null?<p style={{textAlign:"left",color:"grey"}}>{course.introduction}</p>:null}
                                </CardContent>
                            </Card>
                        )
                    })   
                
                :
                <div>
                    <p><Button onClick={async()=>{
                        if(path.length!=1){
                        path.pop();
                        setPath(path);
                        }
                        if(path.length==1){
                            setList(await getCourses(courses_root));
                        }else{
                            let p=courses_root;
                            for(let i=1;i<path.length;i++){
                                console.log("p",path[i])
                                p=await p.getDirectoryHandle(path[i]);
                            }
                            
                            let l=[];
                            for await (const entry of p.entries()){
                                l.push(entry);
                            }
                            setList(l);
                        }
                    }}>返回</Button></p>
                    {
                list.map((entry,entry_i)=>{
                    console.log("ci",entry)
                    if(entry instanceof Array){
                        if(entry[1].kind!=undefined && entry[1].kind=="directory"){
                            const fn=entry[0].split("-");
                            return <p key={entry_i}><Button onClick={async()=>{
                                setPath([...path,entry[0]]);
                                const files=await entry[1].entries();
                                let l=[];
                                for await (const entry of files){
                                    if(!entry[0].startsWith("."))
                                        l.push(entry);
                                }
                                l.sort((a,b)=>parseInt(a[0].split("-")[0])-parseInt(b[0].split("-")[0]));
                                setList(l);
                            }}>第{parseInt(fn[0])}章 {fn.slice(1)}</Button></p>
                        }else{
                            return <p key={entry_i} style={{color:"grey"}} onClick={async()=>{
                                const file=await entry[1].getFile();
                                readAndGoto(file,props)
                            }}>练习: {entry[0]}</p>
                        }
                    }
                })
            }</div>
            }
            </div>
        </div>
    )
}