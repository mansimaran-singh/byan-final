import React from "react";

export default function AcademicTemplate({ data }) {
  return (
    <div className="p-8 font-serif">

      <h1 className="text-3xl font-bold">{data.personal.name}</h1>

      <p>{data.personal.email} | {data.personal.location}</p>

      <h2 className="text-xl mt-3">Research Work</h2>
      {data.research?.map((r,i)=>(
        <p key={i}><b>{r.title}</b> — {r.desc}</p>
      ))}

      <h2 className="text-xl mt-3">Publications</h2>
      <p>Upload later</p>

      <h2 className="text-xl mt-3">Education</h2>
      {data.education?.map((e,i)=>(
        <p key={i}><b>{e.title}</b> — {e.desc}</p>
      ))}
    </div>
  );
}
