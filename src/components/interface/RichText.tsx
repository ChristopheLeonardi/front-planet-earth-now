import React from 'react';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import "./richtext.css"
//import { useEffect } from 'react';
interface RichTextProps { data: any; }

const RichText: React.FC<RichTextProps> = ({ data }) => {
  const content: BlocksContent = data;

    /* const setElementsAttributes = (nodeArray:any, attribute:string, value:string) => {
      if (nodeArray.length) {
        Array.from(nodeArray).map( (elt:any) => {
          if( !elt.getAttribute(attribute) ) { elt.setAttribute(attribute, value)}
        })
      }
    }

    const removeEmptyElement = (eltArray:any) => {
      let filtered = Array.from(eltArray).filter((c:any) => c.children.length === 0)
      filtered.map((f:any) => f.remove())
    } */

    /* useEffect(() => {

      let paragraph = document.querySelectorAll(".rich-text-block p");

      let container = document.createElement("div")
      container.setAttribute("class","text-container")

      // Remove old paragraph
      Array.from(document.querySelectorAll(".rich-text-block + p")).map(elt => elt.remove())

      // Append paragraph in container
      Array.from(paragraph).map(p => { return container.appendChild(p)})

      document.getElementById("rich-container")?.appendChild(container)

      // Displace button element
      let button = document.getElementById("bouton-flag")
      if(button){ container.appendChild(button) }

      // Remove empty elements
      let textContainer = document.querySelectorAll(".text-container")
      removeEmptyElement(textContainer)

      // set target blank on links
      let links = document.querySelectorAll(".text-container a")
      setElementsAttributes(links, "target", "_blank")

    }, []) */



  return (
    <div className='rich-text-block' /* id="rich-container" */>
      <BlocksRenderer content={content} />
    </div>
  );
};

export default RichText;