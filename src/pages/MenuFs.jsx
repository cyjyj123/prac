import { useState } from "react";

export default function MenuFs(props){
    let root=null;
    const [courses,setCourses]=useState([]);
    const [nowCourse,setNowCourse]=useState([]);
    const [finalPrac,setFinalPrac]=useState([]);

    const CoursesList=courses.map((course,course_i)=>{
        return <div key={course_i} onClick={async ()=>{
            const _chapters=[];
            for await (const [name,entry] of course.entry.entries()){
                if(!name.startsWith(".")){
                    _chapters.push({name,entry});
                }
            }
            setNowCourse(_chapters);
        }}>{course.name}</div>
    })

    const ChaptersList=nowCourse.map(chapter=>
        <div onClick={async ()=>{
            if(chapter.name.endsWith(".json")){

            }else{
                const _finalprac=[];
                for await (const [name,entry] of chapter.entry.entries()){
                    _finalprac.push({name,entry});
                }
                setFinalPrac(_finalprac);
            }
        }}>{chapter.name}</div>
    )

    const FinalList=finalPrac.map(f=>{
        return <div>{f.name}</div>
    })

    let listContent=CoursesList;
    if(finalPrac.length!=0){
        listContent=FinalList;
    }
    else if(nowCourse.length!=0){
        listContent=ChaptersList
    }else{}

    return (
        <div>
            <p><button onClick={async()=>{
                root=await window.showDirectoryPicker();
                window.t=root
                const courses_it=await (await root.getDirectoryHandle("courses")).entries();
                let _courses=[];
                for await (const [name,entry] of courses_it){
                    if(!name.startsWith(".")){
                        _courses.push({name,entry})
                    }
                }
                console.log(courses)
                setCourses(_courses)
            }}>点击</button></p>
            <div>
                <h1>显示</h1>
                {listContent}
            </div>
        </div>
    )
}