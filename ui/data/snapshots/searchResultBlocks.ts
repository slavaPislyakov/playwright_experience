export type SearchResultBlockName = "emptySearchBlock";

export const searchResultBlocks: Record<SearchResultBlockName, string> = {
  emptySearchBlock: `
    - img
    - heading "Ничего не нашлось" [level=2]
    - text: Попробуйте изменить запрос или фильтры
  `,
};
