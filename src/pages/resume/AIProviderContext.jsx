import React, { createContext, useContext, useState } from "react";

const AIProviderContext = createContext();

export function AIProviderWrapper({ children }) {
  const [provider, setProvider] = useState("openai"); // openai | gemini

  return (
    <AIProviderContext.Provider value={{ provider, setProvider }}>
      {children}
    </AIProviderContext.Provider>
  );
}

export function useAIProvider() {
  return useContext(AIProviderContext);
}
