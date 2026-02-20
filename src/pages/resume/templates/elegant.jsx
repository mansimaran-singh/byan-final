import React from "react";

export default function ElegantTemplate({ data }) {
  return (
    <div className="p-8 font-light tracking-wide">
      <h1 className="text-3xl font-bold uppercase">{data.personal.name}</h1>

      <p className="text-gray-700">
        {data.personal.email} | {data.personal.phone}
      </p>

      <p>{data.personal.linkedin}</p>

      <h2 className="text-xl mt-3">Profile</h2>
      <p>{data.summary}</p>

      <h2 className="text-xl mt-3">Projects</h2>
      {data.projects.map((p, i) => (
        <p key={i}>
          <b>{p.title}</b> — {p.desc}
        </p>
      ))}
    </div>
  );
}
