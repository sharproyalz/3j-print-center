export function titleToSlug(title: string) {
  return title.replace(/ /g, '-').replace(/&/g, 'and').toLowerCase();
}
