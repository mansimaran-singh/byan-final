import React from "react";

export default function CorporateTemplate({ data }) {
  return (
    <div className="p-8 font-medium tracking-wide">

      <h1 className="text-3xl">{data.personal.name}</h1>

      <p className="italic">
        {data.personal.email} | {data.personal.phone}
      </p>

      <hr className="my-2" />

      <h2 className="text-xl">Professional Experience</h2>
      {data.experience?.map((e,i)=>(
        <p key={i}>
          <b>{e.title}</b><br />{e.desc}
        </p>
      ))}

      <h2 className="text-xl mt-2">Skills</h2>
      {data.skills?.map((s,i)=>(
        <p key={i}>{s.title}: {s.desc}</p>
      ))}
    </div>
  );
}
