import logo from './logo.svg';
import './App.css';
import "mathjax/es5/tex-svg-full"
//import "mathjax/es5/tex-chtml-full"
import { useState } from 'react';
import Home from './pages/Home';
import Prac from './pages/Prac';
import { AppBar, Toolbar,BottomNavigation,BottomNavigationAction, Box} from '@material-ui/core';
import About from './pages/About';
import Menu from "./pages/Menu"

function App() {
  const [page,setPage]=useState("home");
  const [prac,setPrac]=useState({});

  let middle="";
  if(page=="home"){
    middle=<Home ChangePage={(page_name)=>{setPage(page_name)}} prac={prac} />    
  }else if(page=="prac"){
    middle=<Prac ChangePage={(page_name)=>{setPage(page_name)}} prac={prac} />
  }else if(page=="menu"){
    middle=<Menu ChangePage={(page_name)=>{setPage(page_name)}} ChangePrac={v=>setPrac(v)} />
  }else if(page=="about"){
    middle=<About />
  }else{}

  return (
    <div className="App">
      <div>
        <AppBar position='sticky' style={{height:"8vh"}}>
          <Toolbar style={{display:"flex",justifyContent:"center"}}>
            <h5>{prac.title!=undefined ? `练习 - ${prac.title}` : `Prac`}</h5>
          </Toolbar>
        </AppBar>
      </div>

      <div style={{overflow:"scroll"}}>
        {middle}
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </div>

        <BottomNavigation showLabels value={page} onChange={(e,nv)=>setPage(nv)} style={{position:"fixed",left:"0",bottom:"0",width:"100vw"}}>
          <BottomNavigationAction label="首页" value="home" />
          <BottomNavigationAction label="目录" value="menu" />
          <BottomNavigationAction label="关于" value="about" />
        </BottomNavigation>
    </div>
  );
}

export default App;
