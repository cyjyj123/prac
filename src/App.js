import logo from './logo.svg';
import './App.css';
import "mathjax/es5/tex-svg-full"
//import "mathjax/es5/tex-chtml-full"
import { useRef, useState } from 'react';
import Home from './pages/Home';
import Prac from './pages/Prac';
import { AppBar, Toolbar,BottomNavigation,BottomNavigationAction, Box, Button, Dialog, DialogContent} from '@material-ui/core';
import About from './pages/About';
import Menu from "./pages/Menu"
import Knows from './pages/Knows';
import jsQR from "jsqr"
import { translate } from './utils/translate';
import Finish from './pages/Finish';
import { Maker } from './pages/Maker';

import HomeIcon from "@mui/icons-material/Home"
import MenuIcon from "@mui/icons-material/List"
import AboutIcon from "@mui/icons-material/Settings"

import BoardIcon from "@mui/icons-material/FilterFrames"
import { Board } from './pages/Board';

function App() {
  const [page,setPage]=useState("home");
  const [prac,setPrac]=useState({});
  const scanVideoRef=useRef(null);
  const scanCanvasRef=useRef(null)

  const [board,setBoard]=useState(false)

  const [prac_config,setPracConfig]=useState({q_center:false})
  const [scan_open,setScanOpen]=useState(false);




  let middle="";
  if(page=="home"){
    middle=<Home ChangePage={(page_name)=>{setPage(page_name)}} prac={prac} PracConfig={prac_config} ChangePracConfig={s=>{setPracConfig(s)}} />    
  }else if(page=="prac"){
    middle=<Prac ChangePage={(page_name)=>{setPage(page_name)}} prac={prac} PracConfig={prac_config} />
  }else if(page=="menu"){
    middle=<Menu ChangePage={(page_name)=>{setPage(page_name)}} ChangePrac={v=>setPrac(v)} />
  }else if(page=="about"){
    middle=<About />
  }else if(page=="knows"){
    middle=<Knows prac={prac} />
  }else if(page=="finish"){
    middle=<Finish ChangePage={(page_name)=>setPage(page_name)} prac={prac} />
  }else if(page=="maker"){
    middle=<Maker />
  }else{}

  return (
    <div className="App">
      <div style={{display:"flex",justifyContent:"center",padding:0,background:"#48c9b0",boxShadow:"1px 1px grey",height:"5vh"}}>
        <p style={{padding:0,margin:0,color:"white"}}>
            <span style={{color:"lightgrey",padding:"1px"}}>
              <BoardIcon onClick={e=>{
                setBoard(true)
              }} />
            </span>
            <span style={{padding:0,margin:0}}>{prac.title!=undefined ? `练习 - ${prac.title}` : translate("title")}</span>
            {page=="home" ? <Button onClick={async ()=>{
              setScanOpen(true)
              const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
              scanCanvasRef.current.style.display="block";
              scanVideoRef.current.srcObject=s;
              scanVideoRef.current.onloadedmetadata=()=>{
                //test=1
                scanVideoRef.current.play()
                  const scanW=scanCanvasRef.current.width;
                  const scanH=scanCanvasRef.current.height;
                  //alert(scanW+","+scanH)
                const scanTimer=setInterval(async ()=>{
                  const scanCtx=scanCanvasRef.current.getContext("2d");
                  scanCtx.drawImage(scanVideoRef.current,0,0);

                  // 识别
                  
                  const scanData=scanCtx.getImageData(0,0,scanW,scanH);
                  //alert(scanData.width+" "+scanData.height)
                  const code=jsQR(scanData.data,scanData.width,scanData.height,{
                    inversionAttempts:"dontInvert"
                  });
                  //test=code;
                  if(code){
                    alert(code.data)
                    scanVideoRef.current.pause()
                    s.getTracks().map(v=>v.stop())
                    scanCanvasRef.current.style.display="none";
                    clearInterval(scanTimer);

                    if(code.data.startsWith("http://") || code.data.startsWith("https://") || code.data.startsWith("data:")){
                      // 获取网址内容后解析
                      try{
                        
                        const scanUrlResult=await fetch(code.data,{method:"GET"});
                        //alert(await scanUrlResult.text())
                        setPrac(await scanUrlResult.json())
                        setScanOpen(false);
                      }catch(e){
                        alert(e)
                      }
                    }else{
                      // 当作JSON字符串处理解析
                      try{
                        setPrac(JSON.parse(code.data));
                        setScanOpen(false);
                      }catch(e){
                        alert("JSON解析错误")
                      }
                    }
                  }else{
                    //alert("No")
                  }
                },200)
              }
              //alert(stream)
            }}>{translate("scan")}</Button> : null}
        </p>
      </div>

      

      <div style={{overflow:"scroll"}}>
        {middle}
        {scan_open ?
        <div>
          <video id="scan_v" ref={scanVideoRef} style={{display:"none",width:"300px",height:"300px"}}></video>
          <canvas id="scan_i" ref={scanCanvasRef} style={{width:"300px",height:"300px"}}></canvas>
        </div>
        :null}

        {prac.knows!=undefined && prac.knows.length!=0 && page=="home" ? <p style={{color:"blue"}} onClick={()=>setPage("knows")}>查看知识点</p> : null}
        {page=="knows" ? <p style={{color:"blue"}} onClick={()=>setPage("home")}>返回首页</p> :null}
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </div>
      

        <BottomNavigation showLabels value={page} onChange={(e,nv)=>setPage(nv)} style={{position:"fixed",left:"0",bottom:"0",width:"100vw",borderTop:"1px solid grey"}}>
          <BottomNavigationAction label={translate("menu_home")} value="home" icon={<HomeIcon  />} />
          <BottomNavigationAction label={translate("menu_menu")} value="menu" icon={<MenuIcon />} />
          <BottomNavigationAction label={translate("menu_about")} value="about" icon={<AboutIcon />} />
        </BottomNavigation>
        
        <Dialog open={board} onClose={()=>{setBoard(false)}} fullScreen={true}>
          <DialogContent>
            <Board Close={()=>setBoard(false)} />
          </DialogContent>
        </Dialog>
    </div>
  );
}

export default App;
