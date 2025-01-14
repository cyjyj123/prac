import { Button, ButtonGroup } from "@material-ui/core";
import { useRef,useEffect, useState } from "react"

export function Board(props){
    const canvas=useRef(null);
    const [boardColor,setBoardColor]=useState("#006650")
    const [penColor,setPenColor]=useState("#ffffff")

    let start=false

    const convert_pos=(x,y)=>{
        if(canvas.current!=null){
        const canvas_rect=canvas.current.getBoundingClientRect();
        return {x:x-canvas_rect.left,y:y-canvas_rect.top};
        }else{
            return {x:0,y:0}
        }
    }

    const p_start=(ctx,x,y)=>{
        start=true
        const newpos=convert_pos(x,y)
        ctx.moveTo(newpos.x,newpos.y)
    }

    const p_move=(ctx,x,y)=>{
        const newpos=convert_pos(x,y)
        if(start){
            ctx.lineTo(newpos.x,newpos.y)
            ctx.stroke()
        }
    }

    const p_end=()=>{
        start=false;
    }

    return (
        <div style={{position:"absolute",top:0,left:0}}>
            <p>
                <ButtonGroup variant="text">
                <Button onClick={()=>props.Close()}>关闭黑板</Button>
                <Button
                onClick={e=>{

                    if(canvas.current!=null){
                        const canvas_r=canvas.current.getBoundingClientRect();
                        const canvas_ctx=canvas.current.getContext("2d");

                        canvas_ctx.beginPath();
                        canvas_ctx.clearRect(0,0,canvas_r.width,canvas_r.height)
                    }
                }}
                >清空画布</Button>
                </ButtonGroup>
                <span>黑板颜色 <input type="color" value={boardColor} onChange={e=>{setBoardColor(e.target.value)}} /></span>
                <span>画笔颜色 <input type="color" value={penColor} onChange={e=>{setPenColor(e.target.value)}} /></span>
                <Button onClick={e=>{
                    const bcolor=parseInt(boardColor.replace("#","0x"));
                    setPenColor("#"+(0xffffff-bcolor).toString(16));
                }}>计算画笔颜色</Button>
            </p>
            <canvas width={window.innerWidth} height={window.innerHeight} style={{background:boardColor,padding:0,margin:0,overflow:"hidden"}} ref={canvas} onPointerDown={e=>{
                const ctx=e.target.getContext("2d")
                ctx.strokeStyle="white";
                window.ctx=ctx
                ctx.strokeStyle=penColor;
                p_start(ctx,e.clientX,e.clientY);                
            }}
            onPointerMove={e=>{
                const ctx=e.target.getContext("2d")
                p_move(ctx,e.clientX,e.clientY);
                

            }}
            onPointerUp={e=>{
                p_end();
            }}

            onTouchStart={e=>{
                p_start(e.target.getContext("2d"),e.touches[0].clientX,e.touches[0].clientY)
            }}
            onTouchMove={e=>{
                p_move(e.target.getContext("2d"),e.touches[0].clientX,e.touches[0].clientY)
            }}
            onTouchEnd={e=>{
                p_end()
            }}
            ></canvas>
        </div>
    )
}