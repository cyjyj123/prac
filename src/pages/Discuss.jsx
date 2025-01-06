import { TextField } from "@material-ui/core"
import { useEffect, useState } from "react";

export default function Discuss(props){
    // 若练习文件有discuss字段，则会显示此组件
    // discuss字段为全局的URL
    // 此组件将会对discuss指向的链接进行GET和POST等请求
    // GET请求后跟题目编号，从1开始计算，返回内容应为一个包含每个评论的数组
    // POST请求会发送评论，若评论成功应返回{status:true}，否则返回{status:false}，均可携带message字段
    // 每个评论应包含name,content,date，名称是否可以重复随服务器，date应以时间戳字符串表示，统一为毫秒，可以携带小数点，但建议忽略
    // POST时，会携带本地时间戳，实际采用何种时间戳由服务器决定
    // 以上内容均应以JSON字符串表示

    const server=props.prac.discuss;
    const [dises,setDises]=useState([])

    useEffect(()=>{
        (async ()=>{
            const server_fetch=await fetch(server);
            const server_data=await server_fetch.json();
            setDises(server_data);
        })()
    },[]);

    const discuss_area=
        <div>
            <TextField label="昵称" />
            <TextField multiline minRows={5} label="内容" />
            <Button>提交</Button>
        </div>
    
    const discuss_list=dises.map((dis,dis_key)=><div key={dis_key}>
        <p>{dis.name}</p>
        <p>{dis.content}</p>
    </div>)

    return (
        <div>
            <p>讨论</p>
        </div>
    )
}