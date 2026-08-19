import type { BlockName } from "@@/ui/pages/mainPage";

export const blocks: Record<BlockName, string> = {
  jobInOtherCitiesBlock: `
    - heading "Работа в других городах" [level=3]
    - link "Работа в Борисове":
      - /url: https://borisov.rabota.by/
    - link "Работа в Орше":
      - /url: https://orsha.rabota.by/
    - link "Работа в Гомеле":
      - /url: https://gomel.rabota.by/
    - link "Работа в Жодино":
      - /url: https://jodino.rabota.by/
    - link "Работа в Могилеве":
      - /url: https://mogilev.rabota.by/
    - link "Работа в Витебске":
      - /url: https://vitebsk.rabota.by/
    - link "Работа в Гродно":
      - /url: https://grodno.rabota.by/
    - link "Работа в Бобруйске":
      - /url: https://bobruysk.rabota.by/
    - link "Работа в Бресте":
      - /url: https://brest.rabota.by/
    - link "Работа в Барановичах":
      - /url: https://baranovichi.rabota.by/
    `,
};
