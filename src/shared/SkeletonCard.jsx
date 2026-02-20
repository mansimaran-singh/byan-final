// src/shared/SkeletonCard.jsx
import React from 'react'

export default function SkeletonCard(){
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 animate-pulse">
      <div className="h-5 bg-gray-700 rounded w-1/2 mb-3" />
      <div className="h-3 bg-gray-700 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-700 rounded w-5/6 mb-2" />
      <div className="h-8 bg-gray-700 rounded w-32 mt-4" />
    </div>
  )
}
