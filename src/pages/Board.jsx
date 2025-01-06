import { Button } from "@material-ui/core";
import { useRef,useEffect } from "react"

export function Board(props){
    const canvas=useRef(null);

    let start=false

    const convert_pos=(x,y)=>{
        if(canvas.current!=null){
        const canvas_rect=canvas.current.getBoundingClientRect();
        return {x:x-canvas_rect.left,y:y-canvas_rect.top};
        }else{
            return {x:0,y:0}
        }
    }

    /*useEffect(()=>{
        const ctx=canvas!=null ? canvas.current.getContext("2d"):null;
        const convert_pos=(x,y)=>{
            if(canvas.current!=null){
            const canvas_rect=canvas.current.getBoundingClientRect();
            return {x:x-canvas_rect.left,y:y-canvas_rect.top};
            }else{
                return {x:0,y:0}
            }
        }
    
        document.addEventListener("pointerdown",(e)=>{
            e.preventDefault();
            document.body.style.overflow="hidden"
            start=true;
            //lastpoint={x:e.clientX,y:e.clientY};

            if(start){
                const new_pos=convert_pos(e.clientX,e.clientY);
                ctx.moveTo(new_pos.x,new_pos.y);
            }
           // ctx.fillRect(0,0,300,300)
        });

        document.addEventListener("pointermove",(e)=>{
            e.preventDefault()
           
            if(start){
                const new_pos=convert_pos(e.clientX,e.clientY)
                ctx.lineTo(new_pos.x,new_pos.y);
                ctx.stroke();
            }
        });

        document.addEventListener("pointerup",(e)=>{
            e.preventDefault()
            //document.body.style.overflow="scroll"
            
            start=false;
        });
    },[]);*/

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
        <div>
            <p>黑板</p>
            <p>
                <Button variant="outlined" color="primary" onClick={()=>props.Close()}>关闭</Button>
                <Button
                onClick={e=>{

                    if(canvas.current!=null){
                        const canvas_r=canvas.current.getBoundingClientRect();
                        const canvas_ctx=canvas.current.getContext("2d");

                        canvas_ctx.clearRect(0,0,canvas_r.width,canvas_r.height)
                    }
                }}
                >清空画布</Button>
            </p>
            <canvas style={{background:"grey"}} ref={canvas} onPointerDown={e=>{
                const ctx=e.target.getContext("2d")
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