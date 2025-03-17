import { useState, useEffect } from "react";

const Dropdown = ({ data, onSelect }: { data: any; onSelect: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(data[0].texte);
  const [buttonWidth, setButtonWidth] = useState(0);

  const toggleMenu = (e:any) => {
    e.preventDefault();
    setIsOpen(!isOpen)};

  const selectOption = (e: any) => {
    e.preventDefault();
    const selectedLabel = e.currentTarget.getAttribute("data-label");
    setButtonLabel(selectedLabel);
    onSelect(selectedLabel); // Envoie la valeur sélectionnée au parent
    setIsOpen(false);
  };

  const updateButtonWidth = () => {
    const buttonElement = document.getElementById(data.type);
    if (buttonElement) {
      setButtonWidth(buttonElement.offsetWidth);
    }
  };

  useEffect(() => {
    updateButtonWidth();
    window.addEventListener("resize", updateButtonWidth);
    return () => {
      window.removeEventListener("resize", updateButtonWidth);
    };
  }, [data.type]);

  return (
    <div className="dropdown-container">
      <button
        id={data.type}
        role="combobox"
        className={`dropdown ${isOpen ? "toggle" : ""}`}
        onClick={(e) => toggleMenu(e)}
        aria-controls="listbox"
        aria-haspopup="listbox"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        {buttonLabel}
      </button>

      <ul role="listbox" className={`listbox ${isOpen ? "toggle" : ""}`}>
        {data.map((option: any, index: number) => (
          <li key={index} role="option">
            <button
              data-label={option.texte}
              onClick={selectOption}
            >
              {option.texte}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
