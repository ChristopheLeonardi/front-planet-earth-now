import React, { useState, useEffect } from 'react';
import "./richtext.css";

interface RichTextProps { 
  ck5_data: any; 
  data: any; 
}

// Fonction pour transformer une chaîne de style CSS en objet React.CSSProperties
const parseStyleString = (styleString: string): React.CSSProperties => {
  const styleObj: React.CSSProperties = {};
  styleString.split(';').forEach((item) => {
    const [property, value] = item.split(':');
    if (property && value) {
      // Convertir la propriété en camelCase
      const prop = property.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      (styleObj as any)[prop]  = value.trim();
    }
  });
  return styleObj; 
};

const RichText: React.FC<RichTextProps> = ({ ck5_data }) => {
  const [editorContent, setEditorContent] = useState<JSX.Element[] | null>(null);

  // Fonction de conversion du HTML brut en JSX
  const parseHTMLToJSX = (htmlString: string): JSX.Element[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
  
    const convertNodeToJSX = (node: ChildNode): JSX.Element | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        // Encapsule le texte dans une balise <span>
        return textContent ? <span>{textContent}</span> : null;
      }
  
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }
  
      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();
  
      // Gestion des attributs
      const attributes: Record<string, any> = {};
      for (const attr of element.attributes) {
        if (attr.name === "style") {
          attributes["style"] = parseStyleString(attr.value);
        } else {
          // Convertit "class" en "className" pour React
          attributes[attr.name === "class" ? "className" : attr.name] = attr.value;
        }
      }
  
      // Supprimer l'attribut indésirable
      delete attributes["data-slate-fragment"];
  
      if (tag === "colgroup" || (element.draggable && element.parentElement?.draggable)) {
        return null;
      }
  
      if (tag === "img") {
        // Corrige srcset -> srcSet
        attributes["srcSet"] = attributes["srcset"];
        delete attributes["srcset"];
      }
  
      // Conversion récursive des enfants
      const children = Array.from(element.childNodes)
        .map(convertNodeToJSX)
        .filter(Boolean) as JSX.Element[];
  
      return React.createElement(tag, attributes, ...children);
    };
  
    return Array.from(doc.body.childNodes)
      .map(convertNodeToJSX)
      .filter(Boolean) as JSX.Element[];
  };

  // Premier useEffect pour ajouter une classe "columns" aux rich-text-block contenant des images
  useEffect(() => {
    const timeout = setTimeout(() => {
      let richTextBlock = document.querySelectorAll(".rich-text-block");
      Array.from(richTextBlock).forEach((elt) => {
        if (elt.querySelectorAll("img").length !== 0) {
          elt.setAttribute("class", "rich-text-block columns");
        }
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // Second useEffect pour parser le ck5_data
  useEffect(() => {
    if (!ck5_data) return;
    const parsedContent = parseHTMLToJSX(ck5_data);
    setEditorContent(parsedContent.length > 0 ? parsedContent : null);
  }, [ck5_data]);

  return (
    <div className="rich-text-block">
      {ck5_data && (
        <section className={`ck5 ${editorContent?.some(el => el?.type === 'img') ? 'columns' : ''}`}>
          {editorContent?.map((el, index) => (
            <React.Fragment key={index}>{el}</React.Fragment>
          ))}
        </section>
      )}
    </div>
  );
};

export default RichText;
