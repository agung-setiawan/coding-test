import { marked } from 'marked';

export const parseMarkdown = (markdownText) => {
    return marked(markdownText);
};