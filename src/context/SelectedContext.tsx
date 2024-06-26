/* import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedContextType {
  textsSaved: any[];
  selectedText: number;
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  img: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  data: any;
  setSelected: (selected: Partial<SelectedContextType>) => void;
}

const initialSelectedContext: SelectedContextType = {
  textsSaved: [],
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
}; */
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Line {
  height: number;
  width: any;
  text: string;
  x: number;
  y: number;
  size: number;
  fontFamily: string;
}

interface SelectedContextType {
  textsSaved: Line[];
  selectedText: number;
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  img: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  data: any;
  setSelected: React.Dispatch<React.SetStateAction<SelectedContextType>>;
}

const SelectedContext = createContext<SelectedContextType | undefined>(undefined);

export const SelectedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<SelectedContextType>({
    textsSaved: [],
    selectedText: -1,
    ctx: null,
    canvas: null,
    img: null,
    canvasRef: React.createRef<HTMLCanvasElement>(),
    data: null,
    setSelected: () => {},
  });

  return (
    <SelectedContext.Provider value={{ ...selected, setSelected }}>
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
