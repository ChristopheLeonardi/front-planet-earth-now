import React from 'react';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import "./richtext.css"
import { useState, useEffect } from 'react';
import useImageHeight from './useImageHeight';

interface RichTextProps { data: any; }

const RichText: React.FC<RichTextProps> = ({ data }) => {
  const content: BlocksContent = data;
    const setElementsAttributes = (nodeArray:any, attribute:string, value:string) => {
      if (nodeArray.length) {
        Array.from(nodeArray).map( (elt:any) => {
          if( !elt.getAttribute(attribute) ) { elt.setAttribute(attribute, value)}
        })
      }
    }

    const removeEmptyElement = (eltArray:any) => {
      let filtered = Array.from(eltArray).filter((c:any) => c.children.length === 0)
      filtered.map((f:any) => f.remove())
    }



    useEffect(() => {
      let richTextBlock = document.querySelectorAll(".rich-text-block");

      Array.from(richTextBlock).map( elt => {

        if (elt.querySelectorAll("img").length != 0){
          // Add Class
          elt.setAttribute("class","rich-text-block float col-2")



          /* let paragraph = Array.from(elt.querySelectorAll("p")).filter(p => p.innerHTML.length != 0);
          console.log(paragraph)
          console.log(elt)
          if (paragraph.length >= 2){ 
                      // Create Container pour les 2 premiers paragraphes
          let textContainer = document.createElement("div")
          textContainer.setAttribute("class","text-container")

            textContainer.appendChild(paragraph[0])
            textContainer.appendChild(paragraph[1])
            elt.appendChild(textContainer)
           } */

        }


      })



      // set target blank on links
      let links = document.querySelectorAll(".text-container a")
      setElementsAttributes(links, "target", "_blank")

    }, [])



  return (
    <div className='rich-text-block' /* id="rich-container" */>
      <BlocksRenderer content={content} />
    </div>
  );
};

export default RichText;