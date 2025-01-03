// 标准库，文件中不自带，格式类似，key为以std开头的名字，内容为至少包括type和content的结构
const meta_std={
    "std/icon":{
        "type":"svg",
        "content":`<svg version="1.1" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop stop-color="gold" offset="0%" />
                <stop stop-color="white" offset="100%" />
            </linearGradient>
        </defs>
        <rect fill="url(#g1)" width="100%" height="100%"></rect>
        <rect x="75" y="50" width="150" height="150" fill-opacity="0" stroke-width="5" stroke="black"></rect>
        <rect x="140" y="75" width="20" height="20"></rect>
        <path d="M150 215 L75 250 L225 250 L150 215 Z" />
        </svg>`
    }
}
export function parseMeta(str,meta){
    // 替换latex和元数据，str为传入的字符串，包括普通文本、latex和元数据，meta为传入的元数据的结构，其中包括若干个key作为其名
    
    // 先替换换行符
    str=str.replace(/\n/g,"<br/>");

    // 再替换latex
    
    const latexes=str.match(/\$[^\$]+\$/g);
    if(latexes!=null){
    latexes.map(latex=>{
        // 对每一个匹配的latex进行替换，传入的latex例如$x^2$
        const lt=latex.substring(1,latex.length-1); // 获取中间的内容
        const svg=window.MathJax.tex2svg(lt).innerHTML;
        str=str.replace(latex,svg);
    })
}

    // 最后替换元数据
    const metas=str.match(/#\{.+\}/g);
    if(metas!=null){
    metas.map(m=>{
        // 每个m为一个调用变量的地方，格式#{变量名}
        const m_name=m.substring(2,m.length-1) // 中间的内容
        let m_meta=null;
        if(m_name.startsWith("std/")){
            m_meta=meta_std[m_name];
        }else{
            m_meta=meta[m_name];
        }
        const m_type=m_meta.type;
        const m_content=m_meta.content;

        // 根据其类型进行替换
        if(m_type=="image"){
            str=str.replace(m,`<img src=${m_content} />`);
        }else{
            // 其它类型，直接替换
            str=str.replace(m,m_content)
        }
    })
}



    return str;
}