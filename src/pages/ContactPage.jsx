import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage(){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>
        <form onSubmit={(e)=>{ e.preventDefault(); toast.success('Message sent (demo)') }} className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-4">
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" />
          <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" />
          <textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} rows={5} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" />
          <button className="px-4 py-2 bg-red-600 rounded-lg">Send</button>
        </form>
      </div>
    </main>
  )
}
