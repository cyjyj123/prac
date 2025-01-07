import TipsIcon from "@mui/icons-material/Search"
import { Step, Stepper,StepLabel, StepContent } from "@mui/material"
import { useState } from "react"

export default function Tips(props){

    const [nowtip,setNowTip]=useState(0);

    const tips_list=props.tips!=undefined 
    ? props.tips.filter((v,i)=>i<nowtip).map((tip,tip_key)=>
        <Step key={tip_key}>
            <StepLabel><span style={{color:"grey"}}>提示{tip_key+1}：</span> {tip}</StepLabel>
        </Step>
    )
    : null



    return (
        <div>
            <p style={{textAlign:"left"}}>
                <TipsIcon style={{color:"grey"}} onClick={()=>{
                    if(nowtip<props.tips.length){
                        setNowTip(nowtip+1)
                    }
                }}/>
                </p>
            <Stepper orientation="vertical" activeStep={nowtip-1}>
                {tips_list}
            </Stepper>
        </div>
    )
}