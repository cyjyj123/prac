export function ConvertCSV(csvtxt,explain=true){
    // 传入CSV格式字符串，并返回JSON
    const lines=csvtxt.split("\n");
    const result={}; 
    
    // basic info
    const n=normal(lines[0].split(","));
    result.title=n[0]; // 标题
    if(n[1]!=undefined){
        // 课程
        result.course=n[1];
    }else{
        result.course="";
    }
    if(n[2]!=undefined){
        // 章节
        result.chapter=n[2];
    }else{
        result.chapter="";
    }
    if(n[3]!=undefined){
        // 作者
        result.authors=n[3].split(";");
    }
    if(n[4]!=undefined){
        // 许可协议
        result.licenses=n[4].split(";");
    }
    if(n[5]!=undefined){
        // 简介
        result.description=n[5];
    }else{
        result.description="";
    }

    // 
    let questions=[];
    let meta={};
    for(let i=1;i<lines.length;i++){
        // 从第二行开始每一行,lines[i]代表一行整体字符串
        const line=normal(lines[i].split(",")); // 一行字段数组
        let question={};

        if(line[0]==""){
            // 空行忽略
            continue;
        }

        if(line[0]=="0" || line[0]=="choice" || line[0]=="单选"){
            // 单选
            question.type="choice";
            question.title=line[1];
            question.answer=parseOptionId(line[2]);
            question.explain=explain?line[3]:"";
            question.options=line.filter((opt,i)=>i>(explain?3:2));
        }else if(line[0]=="1" || line[0]=="mchoice" || line[0]=="多选"){
            // 多选
            question.type="mchoice";
            question.title=line[1];
            question.answer=line[2].split(";").map(opt=>parseOptionId(opt)).sort((a,b)=>a-b);
            question.explain=explain?line[3]:"";
            question.options=line.filter((opt,i)=>i>(explain?3:2));
        }else if(line[0]=="2" || line[0]=="blank" || line[0]=="填空"){
            // 客观填空
            question.type="blank";
            question.title=line[1];
            question.answer=line[2].split(";")
            question.explain=explain?line[3]:"";
        }else{
            // 视为元数据
            meta[line[0]]={}
            meta[line[0]].type=line[1];

            if(line[1]=="table"){
                meta[line[0]].content=JSON.parse(line[2]);
            }else{
                meta[line[0]].content=line[2];
            }
        }

        questions.push(question)
    }

    result.questions=questions;
    result.meta=meta;

    //console.log(JSON.stringify(result));

    return result;
}

function normal(line){
    for(let i=0;i<line.length;i++){
        if(line[i]==undefined){
            continue;
        }
        if(line[i].startsWith('"')){
            let count=1;
            line[i]=line[i].substr(1,line[i].length-1)+",";
            while(!line[i+count].endsWith('"')){
                line[i]+=line[i+count];
                line[i]+=","
                line[i+count]=undefined;
            }
            line[i]+=line[i+count].substr(0,line[i+count].length-1);
            line[i+count]=undefined;
        }
    }

    return line.filter(field=>field!=undefined);
}

function parseOptionId(opt){
    // opt必须为单个选项编号字符串，转换为整数
    if(!isNaN(opt)){
        return parseInt(opt);
    }else{
        return opt.codePointAt(0)-65;
    }
}

export function readAndGoto(file,props,file2=null){
    // 选择多个文件时，还有file2，否则file2为null
    const fr=new FileReader();
    const files=[file,file2];
    // 阅读主文件
    const mainfile=files.filter(f=>f!=null && !f.name.endsWith(".meta.json") && (f.name.endsWith(".json") || f.name.endsWith(".csv")))[0];
    console.log(mainfile)
    fr.readAsText(mainfile);
    fr.onloadend=()=>{
        let prac=undefined;
        if(file.name.endsWith(".json")){
            if(file2==null){
                // 只有一个JSON文件，直接解析
                prac=JSON.parse(fr.result);
            }else{
                // 有两个JSON文件，合并后解析
                prac=JSON.parse(fr.result);
                const fr2=new FileReader();
                fr2.readAsText(files.filter(f=>f!=mainfile)[0]);
                fr2.onloadend=()=>{
                    const other_meta=JSON.parse(fr2.result);
                    const sum_meta={...prac.meta,...other_meta.meta};
                    prac.meta=sum_meta;
                }
            }
        }else if(file.name.endsWith(".csv")){
            const explain=window.confirm("您选择的是CSV文件，请问是否含有解析字段？");
            prac=ConvertCSV(fr.result,explain)
            console.log(prac)
        }else{}

        if(prac!=undefined){
            props.ChangePrac(prac);
            props.ChangePage("home");
        }
    }
}
