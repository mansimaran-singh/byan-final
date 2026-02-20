import React from "react";

export default function CompactTemplate({ data }) {
  return (
    <div className="p-4 text-sm font-sans leading-tight">

      {data.personal.name && (
        <h1 className="text-2xl font-bold">{data.personal.name}</h1>
      )}

      <p>
        {data.personal.email} • {data.personal.phone} • {data.personal.location}
      </p>

      {data.summary && (
        <>
          <h2 className="font-bold mt-2">Summary</h2>
          <p>{data.summary}</p>
        </>
      )}

      <h2 className="font-bold mt-2">Experience</h2>
      {data.experience?.map((e,i)=>(
        <p key={i}><b>{e.title}</b> — {e.desc}</p>
      ))}

      <h2 className="font-bold mt-2">Education</h2>
      {data.education?.map((e,i)=>(
        <p key={i}><b>{e.title}</b> — {e.desc}</p>
      ))}
    </div>
  );
}
