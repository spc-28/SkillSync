import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

type Props = {
  markdown: string;
};

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {
    //@ts-ignore
  const html = DOMPurify.sanitize(marked.parse(markdown));

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
