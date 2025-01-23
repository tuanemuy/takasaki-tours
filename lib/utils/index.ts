export function nl2br(str: string) {
  return str.replace(/\r?\n/g, "<br />");
}

export function extractDescription(str: string) {
  return str.replace(/\r?\n/g, "").slice(0, 150);
}
