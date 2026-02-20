import React from "react";

export default function MinimalTemplate({ data }) {

  const contacts = [
    data.personal.email,
    data.personal.phone
  ].filter(Boolean).join(" | ");

  return (
    <div className="p-6 font-serif">
      {data.personal.name && (
        <h1 className="text-4xl">{data.personal.name}</h1>
      )}

      {contacts && (
        <p>
          {contacts}
        </p>
      )}

      <p>{data.personal.location}</p>

      <hr className="my-2" />

      <h2 className="font-bold">Summary</h2>
      <p>{data.summary}</p>

      <h2 className="font-bold mt-2">Experience</h2>
      {data.experience.map((ex, i) => (
        <p key={i}>
          <b>{ex.title}</b> - {ex.desc}
        </p>
      ))}

      <h2 className="font-bold mt-2">Skills</h2>
      {data.skills.map((s, i) => (
        <p key={i}>{s.title}: {s.desc}</p>
      ))}
    </div>
  );
}
