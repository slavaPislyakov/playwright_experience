# UI: тестовые данные и aria-снапшоты

Тестовые данные UI — в `ui/data/`: снапшоты контентных блоков в `ui/data/snapshots/blocks.ts`, остальное (ожидаемые тексты, значения форм) — константы спека или файлы рядом по той же схеме.

## Aria-снапшоты

Для проверки контентных блоков вместо перечисления элементов используется yaml-снапшот в `Record<BlockName, string>`. Ключ совпадает с ключом в `PageBlocks` PO ([pages.md](pages.md)):

```typescript
import type { BlockName } from "@@/ui/pages/mainPage";

export const blocks: Record<BlockName, string> = {
  jobInOtherCitiesBlock: `
    - heading "Работа в других городах" [level=3]
      - link "Работа в Борисове":
        - /url: https://borisov.rabota.by/
  `,
};
```

Проверка — степом страницы через `toMatchAriaSnapshot`:

```typescript
async checkBlockOnPage(blockName: BlockName): Promise<void> {
  await test.step(`Check block ${blockName} using snapshots`, async () => {
    const block = this.mainPage.getBlock(blockName);

    await expect(block).toMatchAriaSnapshot(blocks[blockName]);
  });
}
```

## Как получить актуальный yaml

- `console.log(await locator.ariaSnapshot())` — снять yaml с живого элемента;
- или Playwright codegen (Test Inspector).

## Хрупкость

Полный список городов с абсолютными URL в снапшоте сломается при любом изменении выдачи сайта (известно из `ANALYSIS.md`). При падении снапшота сначала посмотри, что реально изменилось на сайте, и правь `blocks.ts` осознанно, а не вслепую копируя новую выдачу.

## Инструменты против хрупкости (1.59–1.63) — когда применять

Проверено на 1.65: у ассерта `toMatchAriaSnapshot` опции `depth` **нет** (только `timeout`/`signal`); `depth`, `mode: "ai"` и `boxes` — только на capture-стороне: `locator.ariaSnapshot({ depth, mode, boxes })`.

- Снапшот разросся и падает от волатильного содержимого: сначала пробуй **сузить локатор** до стабильного подблока. Если нельзя — depth-срез через `expect.poll(() => locator.ariaSnapshot({ depth: 2 })).toBe(...)` (теряется web-first семантика `toMatchAriaSnapshot` — последнее средство).
- `boxes` (координаты элементов) и `mode: "ai"` (refs + iframe) — для AI-проверок вёрстки; в обычных ассертах не нужны.
- Текущие снапшоты сознательно не урезаются: список городов — тестируемый контент («контракт каталога», P4-3 в `ANALYSIS_V2.md`), `emptySearchBlock` уже минимален.
