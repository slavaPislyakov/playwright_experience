import type { BlockName } from "@@/ui/pages/mainPage";

export const blocks: Record<BlockName, string> = {
  navigationBlock: `
    - button "Минск"
    - text: Соискателям
    - link "Работодателям":
      - /url: /employer?hhtmFrom=main
    `,
};
