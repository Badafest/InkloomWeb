export function countHtmlCharacters(html: string | HTMLElement) {
  const node =
    typeof html === 'string'
      ? new DOMParser().parseFromString(html, 'text/html').body
      : html;
  let length = 0;
  if (node.nodeType === Node.TEXT_NODE) {
    length += node.nodeValue?.length ?? 0;
  }
  node.childNodes.forEach((child) => {
    length += countHtmlCharacters(child as HTMLElement);
  });
  return length;
}
