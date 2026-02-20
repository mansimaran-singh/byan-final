import React from "react";

export default function CreativeTemplate({ data }) {
  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold tracking-wider">{data.personal.name}</h1>

      <p>{data.personal.email} • {data.personal.location}</p>

      <h2 className="text-xl mt-2">Profile</h2>
      <p>{data.summary}</p>

      <h2 className="text-xl mt-2">Portfolio</h2>
      <p>{data.personal.portfolio || "portfolio link here"}</p>

      <h2 className="text-xl mt-2">Projects</h2>
      {data.projects?.map((p,i)=>(
        <p key={i}><b>{p.title}</b> — {p.desc}</p>
      ))}
    </div>
  );
}
