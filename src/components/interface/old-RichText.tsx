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

        
        let paragraph = Array.from(elt.querySelectorAll("*:not(img):not(strong):not(pre):not(a):not(br)")).filter(p => p.innerHTML.length != 0);

        let container = document.createElement("div")
        container.setAttribute("class","text-container")
        if (elt.querySelectorAll("img").length != 0){
          elt.setAttribute("class","rich-text-block col-2")
          let imageContainer = document.createElement("div")
          imageContainer.setAttribute("class", "image-container")

          Array.from(elt.querySelectorAll("img")).map(img => {
            
            img.setAttribute("class","col-2")
            imageContainer.appendChild(img)

          } )


          elt?.appendChild(imageContainer)

        }
        // Remove old paragraph
        Array.from(elt.querySelectorAll("p")).map(elt => elt.remove())
  
        // Append paragraph in container
        Array.from(paragraph).map(p => { return container.appendChild(p)})
  
        elt?.appendChild(container)
  
        // Displace button element
        let button = document.getElementById("bouton-flag")
        if(button){ container.appendChild(button) }
  
        // Remove empty elements
        let textContainer = document.querySelectorAll(".text-container")
        removeEmptyElement(textContainer)

        let imageContainer = document.querySelectorAll(".image-container")
        removeEmptyElement(imageContainer)

        let br = document.querySelectorAll("br")
        removeEmptyElement(br)

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