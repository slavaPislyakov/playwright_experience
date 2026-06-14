type Primitive = string | number | boolean | null | undefined;
type JSONValue = Primitive | JSONObject | JSONArray;

export type JSONObject = { [key: string]: JSONValue };

type JSONArray = JSONValue[];

function isObject(value: unknown): value is JSONObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function printValue(path: string, value: JSONValue): string {
  return `${path} - ${JSON.stringify(value)}`;
}

function compareArraysPretty(
  expected: JSONArray,
  actual: JSONArray,
  path: string,
  lines: string[],
): void {
  if (expected.length !== actual.length) {
    lines.push(`Массивы по пути "${path}" имеют разную длину:`);
    lines.push(`В ожидаемом объекте: ${printValue(path, expected)}`);
    lines.push(`В фактическом объекте: ${printValue(path, actual)}`);
    lines.push("");
  }

  const maxLen = Math.max(expected.length, actual.length);

  for (let i = 0; i < maxLen; i++) {
    const expVal = expected[i];
    const actVal = actual[i];
    const itemPath = `${path}[${i}]`;

    if (i >= expected.length) {
      lines.push(`В ожидаемом объекте нет элемента массива по пути: ${itemPath}`);
      lines.push(`В фактическом объекте: ${printValue(itemPath, actVal as JSONValue)}`);
      lines.push("");
      continue;
    }

    if (i >= actual.length) {
      lines.push(`В фактическом объекте нет элемента массива по пути: ${itemPath}`);
      lines.push(`В ожидаемом объекте: ${printValue(itemPath, expVal as JSONValue)}`);
      lines.push("");
      continue;
    }

    compareValuesPretty(expVal, actVal, itemPath, lines);
  }
}

function compareValuesPretty(
  expected: JSONValue,
  actual: JSONValue,
  path: string,
  lines: string[],
): void {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    compareArraysPretty(expected, actual, path, lines);
    return;
  }

  if (Array.isArray(expected) || Array.isArray(actual)) {
    lines.push(`Тип значения отличается по пути: ${path}`);
    lines.push(`В ожидаемом объекте: ${printValue(path, expected)}`);
    lines.push(`В фактическом объекте: ${printValue(path, actual)}`);
    lines.push("");
    return;
  }

  if (isObject(expected) && isObject(actual)) {
    compareObjectsPretty(expected, actual, path, lines);
    return;
  }

  if (expected !== actual) {
    lines.push("Отличается значение:");
    lines.push(`В ожидаемом объекте: ${printValue(path, expected)}`);
    lines.push(`В фактическом объекте: ${printValue(path, actual)}`);
    lines.push("");
  }
}

function compareObjectsPretty(
  expected: JSONObject,
  actual: JSONObject,
  basePath: string,
  lines: string[],
): void {
  const allKeys = new Set([...Object.keys(expected), ...Object.keys(actual)]);

  for (const key of allKeys) {
    const expHas = Object.prototype.hasOwnProperty.call(expected, key);
    const actHas = Object.prototype.hasOwnProperty.call(actual, key);
    const path = basePath ? `${basePath}.${key}` : key;

    if (!expHas && actHas) {
      lines.push(`В ожидаемом объекте нет поля по пути: ${path}`);
      lines.push(`В фактическом объекте: ${printValue(path, actual[key] as JSONValue)}`);
      lines.push("");
      continue;
    }

    if (expHas && !actHas) {
      lines.push(`В фактическом объекте нет поля по пути: ${path}`);
      lines.push(`В ожидаемом объекте: ${printValue(path, expected[key] as JSONValue)}`);
      lines.push("");
      continue;
    }

    const expVal = expected[key] as JSONValue;
    const actVal = actual[key] as JSONValue;

    compareValuesPretty(expVal, actVal, path, lines);
  }
}

export function formatObjectsDiff(expected: JSONObject, actual: JSONObject): string {
  const lines: string[] = [];
  compareObjectsPretty(expected, actual, "", lines);

  if (lines.length === 0) {
    return "Объекты совпадают.";
  }

  return lines.join("\n");
}

/* eslint-disable no-console */
export function diffObjectsPretty(expected: JSONObject, actual: JSONObject): void {
  console.log(formatObjectsDiff(expected, actual));

  console.log("--- Ожидаемый объект ---");
  console.dir(expected, { depth: null });

  console.log("--- Фактический объект ---");
  console.dir(actual, { depth: null });
}

export function isJsonObject(value: unknown): value is JSONObject {
  return isObject(value);
}
