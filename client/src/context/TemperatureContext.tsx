import React, { useState, createContext, useContext } from 'react';

interface Props {
  children: React.ReactNode
}

interface UnitContextProps {
    isCelsius: boolean;
    toggleUnit: () => void;
  }

const TemperatureContext = createContext<UnitContextProps | undefined>(undefined);

export function TempProvider({ children }: Props) {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleUnit = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  return (
    <TemperatureContext.Provider value={{ isCelsius, toggleUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw Error();
  }
  return context;
};
