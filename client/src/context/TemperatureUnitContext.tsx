import React, { useState, createContext } from 'react';

interface Props {
  children: React.ReactNode
}

interface TempContextType {
    isCelsius: boolean;
    toggleTemp: () => void;
  }

const TemperatureContext = createContext<TempContextType | undefined>(undefined);

function TempProvider({ children }: Props) {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemp = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  return (
    <TemperatureContext.Provider value={{ isCelsius, toggleTemp }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export { TempProvider };
