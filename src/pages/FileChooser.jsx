import { useEffect, useState,useRef } from "react";
import JSZip from "jszip"
import "./menu.css"
import {Button, ButtonGroup, Card, CardContent, CardHeader} from "@material-ui/core"
import { ConvertCSV,readAndGoto } from "../utils/ConvertCSV";
import { CapacitorHttp } from "@capacitor/core";
import { urlGet } from "../utils/url";
import {get} from "idb-keyval";

export default function FileChooser(props){
    const [msg,setMsg]=useState("");
 
    const fileChooseRef=useRef(null);

    return (<div>
        <p style={{color:"red"}}>进行单个练习，请从下面的文件选择框中选择一个JSON文件，如果选择ZIP文件，将会加载并存储课程到下面的列表中。</p>
        <Button style={{backgroundColor:"lightskyblue",color:"white",fontSize:"32px",width:"80vw"}} onClick={()=>{
            fileChooseRef.current.click();
        }}>选择文件</Button>
        <ButtonGroup variant="text" style={{marginTop:"2vh"}}>
            <Button style={{padding:"0 10vw"}} onClick={async ()=>{
                const prac_json_url=window.prompt().trim();
                if(prac_json_url!=""){
                    urlGet(prac_json_url,props.ChangePrac,props.ChangePage)
                }
            }}>从网址导入</Button>
            <Button style={{padding:"0 10vw"}} onClick={()=>{props.ChangePage("maker")}}>制作题目</Button>
            {
                window.NDEFReader!=undefined 
                ? <Button onClick={async()=>{
                    const nr=new window.NDEFReader();
                    try{
                        const url=prompt("请输入URL");
                        if(url!=undefined && url.trim()!=""){
                            await nr.write(url.trim());
                            alert("写入成功");
                        }else{
                            alert("URL为空，未写入")
                        }
                    }catch(e){
                        alert("写入失败，原因："+e);
                    }
                }}>向NFC标签写入</Button> 
                : null
            }
        </ButtonGroup>
        <p><input style={{display:"none"}} ref={fileChooseRef} type="file" multiple onChange={async (e)=>{
            const file=e.target.files[0];
            console.log(file.name)
            if(file.name.endsWith(".json") || file.name.endsWith(".csv")){
                // 单练习文件直接加载
                readAndGoto(file,props,e.target.files.length>1?e.target.files[1]:null)
            }else if(file.name.endsWith(".zip")){
                // 单个课程多练习文件，解压，存储，不跳转
                setMsg("解压中...")
                const zip=new JSZip();
                const zipfile=await zip.loadAsync(file);
                
                const courses_root=await (await get("fs")).getDirectoryHandle("courses",{create:true}); // 存储课程的根目录
                const course_fn=Date.now().toString()+"-"+file.name.replace(".zip",""); // 课程目录名
                const course_dir=await courses_root.getDirectoryHandle(course_fn,{create:true}); // 创建存储当前课程的目录
                
                window.test=zipfile
                let streams=[];
                for(let key in zipfile.files){
                    const file_name=zipfile.files[key].name;
                    
                    let parent_dir=course_dir;
                    if(file_name.includes("/")){
                        // 如果没有此目录创建该目录
                        parent_dir=await course_dir.getDirectoryHandle(file_name.split("/")[0],{create:true});
                    }

                    if(file_name.endsWith("/")){
                        continue;
                    }

                    const file_data=await zipfile.files[key].async("string");
                    //console.log(file_name)
                    const outfile=await parent_dir.getFileHandle(file_name.includes("/")?file_name.split("/")[1]:file_name,{create:true});
                    const outfilew=await outfile.createWritable();

                    streams.push({file:outfilew,data:file_data});
                    /*await outfilew.write(file_data);
                    await outfilew.close();*/
                    

                    
                }

                    let writeCount=0;
                    for await (const stream of streams){
                        stream.file.write(stream.data).then(()=>{writeCount++});
                    }
                    await new Promise((Ok,Err)=>{
                        const writeTimer=setInterval(()=>{
                            if(writeCount==streams.length){
                                clearInterval(writeTimer);
                                Ok();
                            }
                        },200);
                    })

                    let closeCount=0;
                    for (const stream of streams){
                        stream.file.close().then(()=>{closeCount++});
                    }

                    const timer=setInterval(()=>{
                        if(closeCount==streams.length){
                            clearInterval(timer);

                            setMsg("解压完成")
                            props.CourseUpdate();
                        }
                    },200)


            }else{
                alert("暂不支持该文件！")
            }
        }}></input></p>
        <p style={{color:"red"}}>{msg}</p>
        <hr style={{margin:"25px 0"}}/>
    </div>)
}