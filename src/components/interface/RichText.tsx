import React from 'react';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { useEffect } from 'react';
interface RichTextProps { data: any; }

const RichText: React.FC<RichTextProps> = ({ data }) => {
  const content: BlocksContent = data;

    useEffect(() => {

      let paragraph = document.querySelectorAll(".rich-text-block p");

      let container = document.createElement("div")
      container.setAttribute("class","text-container")

      Array.from(document.querySelectorAll(".rich-text-block + p")).map(elt => elt.innerHTML = "")

      Array.from(paragraph).map(p => { return container.appendChild(p)})

      document.getElementById("rich-container")?.appendChild(container)
      
      let button = document.getElementById("bouton-flag")
      if(button){ container.appendChild(button) }

      let textContainer = document.querySelectorAll(".text-container")
      let filtered = Array.from(textContainer).filter(c => c.children.length === 0)
      filtered.map(f => f.remove())

    }, [])



  return (
    <div className='rich-text-block' id="rich-container">
      <BlocksRenderer content={content} />
      
    </div>
  );
};

export default RichText;