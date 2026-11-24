// ВНИМАНИЕ: массив из 2+ RegExp в test.use({ jsErrorAllowlist: [...] }) в Playwright 1.65 НЕ работает:
// эвристика кортежа фикстуры (isFixtureTuple) трактует массив из 2+ объектов (RegExp — object)
// как кортеж [value, options] и молча берёт из него только первый элемент.
// Поэтому в спеках всегда передаётся ОДИН объединённый RegExp в массиве из одного элемента:
// test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] })

// Шум фингерпринт-скриптов сайта: попытки загрузить chrome-extension://-ресурсы
// для детекта установленных расширений браузера, а не ошибка самого сайта
const extensionProbePattern = /Fetch API cannot load chrome-extension:/;

// Шум сторонних рекламных скриптов живого сайта: document.write из асинхронно
// загруженного рекламного скрипта, а не ошибка самого сайта
const adDocumentWritePattern = /Failed to execute 'write' on 'Document'/;

// Шум сторонних рекламных ресурсов: сетевые ошибки их доменов (битый сертификат,
// ERR_FAILED и т.п.) — покрываем всё семейство net::ERR_*; продуктовые сбои всё равно
// ловят локаторы тестов и HTTP-мониторинг (pageWithMonitoring, статус >= 400)
const adNetworkErrorPattern = /net::ERR_/;

// CSP-отчёты трекеров и аналитики (mail.ru фингерпринт, mc.yandex/hhcdn framing, в т.ч.
// report-only — «logged, but no further action»): сайт сам их блокирует/репортит — не ошибка продукта
const cspReportPattern = /violates the following (report-only )?Content Security Policy directive/;

const consoleNoisePatterns: readonly RegExp[] = [
  extensionProbePattern,
  adDocumentWritePattern,
  adNetworkErrorPattern,
  cspReportPattern,
];

export const liveSiteConsoleNoise: Readonly<RegExp> = new RegExp(consoleNoisePatterns.map((p) => p.source).join("|"));
