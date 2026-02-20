import React, { useState } from "react";
import { Trash2, Plus, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";

export default function ResumeForm({ formData, setFormData }) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updatePersonal = (key, value) => {
    setFormData({
      ...formData,
      hasData: true,
      personalInformation: { ...formData.personalInformation, [key]: value }
    });
  };

  const addEntry = (section, defaultObj) => {
    setFormData({
      ...formData,
      hasData: true,
      [section]: [...formData[section], defaultObj]
    });
  };

  const updateEntry = (section, index, key, value) => {
    const updated = [...formData[section]];
    updated[index][key] = value;
    setFormData({ ...formData, hasData: true, [section]: updated });
  };

  const removeEntry = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const updateListField = (section, entryIndex, listKey, itemIndex, value) => {
    const updated = [...formData[section]];
    updated[entryIndex][listKey][itemIndex] = value;
    setFormData({ ...formData, hasData: true, [section]: updated });
  };

  const addListItem = (section, entryIndex, listKey) => {
    const updated = [...formData[section]];
    updated[entryIndex][listKey].push("");
    setFormData({ ...formData, hasData: true, [section]: updated });
  };

  const removeListItem = (section, entryIndex, listKey, itemIndex) => {
    const updated = [...formData[section]];
    updated[entryIndex][listKey].splice(itemIndex, 1);
    setFormData({ ...formData, [section]: updated });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20 text-gray-800">
      {/* Personal Info */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50" onClick={() => toggleSection('personal')}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Personal Information</h2>
          {expandedSections.personal ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {expandedSections.personal && (
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Location</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.location || ""} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="City, Country" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Website</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.portfolio || ""} onChange={(e) => updatePersonal("portfolio", e.target.value)} placeholder="yourdomain.dev" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.linkedin || ""} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="linkedin.com/in/username" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">GitHub</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.github || ""} onChange={(e) => updatePersonal("github", e.target.value)} placeholder="github.com/username" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Professional Summary</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[100px] focus:ring-2 focus:ring-red-500/20 outline-none" value={formData.personalInformation.professionalSummary} onChange={(e) => updatePersonal("professionalSummary", e.target.value)} placeholder="Briefly describe your background and goals..." />
            </div>
          </div>
        )}
      </section>

      {/* Experience */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50" onClick={() => toggleSection('experience')}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Experience</h2>
          {expandedSections.experience ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {expandedSections.experience && (
          <div className="p-4 space-y-4">
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="relative p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3">
                <button onClick={() => removeEntry("experience", idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                <div className="grid grid-cols-2 gap-3">
                  <input className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold" placeholder="Job Title" value={exp.title} onChange={(e) => updateEntry("experience", idx, "title", e.target.value)} />
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Company" value={exp.company} onChange={(e) => updateEntry("experience", idx, "company", e.target.value)} />
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Location" value={exp.location} onChange={(e) => updateEntry("experience", idx, "location", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Responsibilities</label>
                  {exp.description.map((desc, dIdx) => (
                    <div key={dIdx} className="flex gap-2">
                      <input className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" value={desc} onChange={(e) => updateListField("experience", idx, "description", dIdx, e.target.value)} placeholder="Describe a responsibility or achievement..." />
                      <button onClick={() => removeListItem("experience", idx, "description", dIdx)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => addListItem("experience", idx, "description")} className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"><PlusCircle size={14} /> Add Bullet Point</button>
                </div>
              </div>
            ))}
            <button onClick={() => addEntry("experience", { title: "", company: "", location: "", startDate: "", endDate: "", description: [""] })} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50/30 transition-all">+ Add Experience Entry</button>
          </div>
        )}
      </section>

      {/* Education */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50" onClick={() => toggleSection('education')}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Education</h2>
          {expandedSections.education ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {expandedSections.education && (
          <div className="p-4 space-y-4">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="relative p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3">
                <button onClick={() => removeEntry("education", idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold" placeholder="Degree / Field of Study" value={edu.degree} onChange={(e) => updateEntry("education", idx, "degree", e.target.value)} />
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="University / School" value={edu.university} onChange={(e) => updateEntry("education", idx, "university", e.target.value)} />
              </div>
            ))}
            <button onClick={() => addEntry("education", { university: "", degree: "", location: "", startDate: "", endDate: "", description: [] })} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50/30 transition-all">+ Add Education Entry</button>
          </div>
        )}
      </section>

      {/* Skills */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50" onClick={() => toggleSection('skills')}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Skills</h2>
          {expandedSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {expandedSections.skills && (
          <div className="p-4 space-y-4">
            {formData.skills.map((skill, idx) => (
              <div key={idx} className="relative p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3">
                <button onClick={() => removeEntry("skills", idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold" placeholder="Category (e.g. Languages)" value={skill.category} onChange={(e) => updateEntry("skills", idx, "category", e.target.value)} />
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-md">
                      <input className="text-xs outline-none w-20" value={item} onChange={(e) => updateListField("skills", idx, "items", sIdx, e.target.value)} />
                      <button onClick={() => removeListItem("skills", idx, "items", sIdx)} className="text-gray-300 hover:text-red-500"><Trash2 size={10} /></button>
                    </div>
                  ))}
                  <button onClick={() => addListItem("skills", idx, "items")} className="text-[10px] font-bold text-red-600">+ Add Skill</button>
                </div>
              </div>
            ))}
            <button onClick={() => addEntry("skills", { category: "", items: [""] })} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50/30 transition-all">+ Add Skill Category</button>
          </div>
        )}
      </section>
    </div>
  );
}
