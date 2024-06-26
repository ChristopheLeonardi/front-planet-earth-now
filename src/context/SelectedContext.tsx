import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedContextType {
  textsSAved: any[];
  selectedText: number;
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  img: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  data: any;
  setSelected: (selected: Partial<SelectedContextType>) => void;
}

const initialSelectedContext: SelectedContextType = {
  textsSAved: [],
  selectedText: -1,
  ctx: null,
  canvas: null,
  img: null,
  canvasRef: null,
  data: null,
  setSelected: () => {},
};

const SelectedContext = createContext<SelectedContextType | undefined>(undefined);

export const SelectedProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<SelectedContextType>(initialSelectedContext);

  const setSelectedValues = (newValues: Partial<SelectedContextType>) => {
    setSelected(prev => ({
      ...prev,
      ...newValues,
    }));
  };

  return (
    <SelectedContext.Provider value={{ ...selected, setSelected: setSelectedValues }}>
      {children}
    </SelectedContext.Provider>
  );
};

export const useSelected = () => {
  const context = useContext(SelectedContext);
  if (context === undefined) {
    throw new Error('useSelected must be used within a SelectedProvider');
  }
  return context;
};
