import React from "react";

export default function SeniorTemplate({ data }) {
  return (
    <div className="p-6 font-sans">

      <h1 className="text-3xl font-bold">{data.personal.name}</h1>

      <p>{data.personal.email} • {data.personal.phone}</p>

      <h2 className="text-xl mt-2">Executive Summary</h2>
      <p>{data.summary}</p>

      <h2 className="text-xl mt-2">Leadership Roles</h2>
      {data.leadership?.map((l,i)=>(
        <p key={i}><b>{l.title}</b> — {l.desc}</p>
      ))}

      <h2 className="text-xl mt-2">Experience</h2>
      {data.experience?.map((e,i)=>(
        <p key={i}><b>{e.title}</b> — {e.desc}</p>
      ))}
    </div>
  );
}
