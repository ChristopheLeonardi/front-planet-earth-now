import React from 'react';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

interface RichTextProps { data: any; }

const RichText: React.FC<RichTextProps> = ({ data }) => {
  const content: BlocksContent = data;
  
  return (
    <div className='rich-text-block'>
      <BlocksRenderer content={content} />
    </div>
  );
};

export default RichText;