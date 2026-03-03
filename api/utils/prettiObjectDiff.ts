/* eslint-disable no-console*/
type Primitive = string | number | boolean | null | undefined;
type JSONValue = Primitive | JSONObject | JSONArray;

type JSONObject = { [key: string]: JSONValue };

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
): void {
  if (expected.length !== actual.length) {
    console.log(`Массивы по пути "${path}" имеют разную длину:`);
    console.log(`В ожидаемом объекте: ${printValue(path, expected)}`);
    console.log(`В фактическом объекте: ${printValue(path, actual)}\n`);
  }

  const maxLen = Math.max(expected.length, actual.length);

  for (let i = 0; i < maxLen; i++) {
    const expVal = expected[i];
    const actVal = actual[i];
    const itemPath = `${path}[${i}]`;

    if (i >= expected.length) {
      console.log(`В ожидаемом объекте нет элемента массива по пути: ${itemPath}`);
      console.log(`В фактическом объекте: ${printValue(itemPath, actVal as JSONValue)}\n`);
      continue;
    }

    if (i >= actual.length) {
      console.log(`В фактическом объекте нет элемента массива по пути: ${itemPath}`);
      console.log(`В ожидаемом объекте: ${printValue(itemPath, expVal as JSONValue)}\n`);
      continue;
    }

    compareValuesPretty(expVal, actVal, itemPath);
  }
}

function compareValuesPretty(
  expected: JSONValue,
  actual: JSONValue,
  path: string,
): void {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    compareArraysPretty(expected, actual, path);
    return;
  }

  if (Array.isArray(expected) || Array.isArray(actual)) {
    console.log(`Тип значения отличается по пути: ${path}`);
    console.log(`В ожидаемом объекте: ${printValue(path, expected)}`);
    console.log(`В фактическом объекте: ${printValue(path, actual)}\n`);
    return;
  }

  if (isObject(expected) && isObject(actual)) {
    compareObjectsPretty(expected, actual, path);
    return;
  }

  if (expected !== actual) {
    console.log("Отличается значение:");
    console.log(`В ожидаемом объекте: ${printValue(path, expected)}`);
    console.log(`В фактическом объекте: ${printValue(path, actual)}\n`);
  }
}

function compareObjectsPretty(
  expected: JSONObject,
  actual: JSONObject,
  basePath: string,
): void {
  const allKeys = new Set([...Object.keys(expected), ...Object.keys(actual)]);

  for (const key of allKeys) {
    const expHas = Object.prototype.hasOwnProperty.call(expected, key);
    const actHas = Object.prototype.hasOwnProperty.call(actual, key);
    const path = basePath ? `${basePath}.${key}` : key;

    if (!expHas && actHas) {
      console.log(`В ожидаемом объекте нет поля по пути: ${path}`);
      console.log(`В фактическом объекте: ${printValue(path, actual[key] as JSONValue)}\n`);
      continue;
    }

    if (expHas && !actHas) {
      console.log(`В фактическом объекте нет поля по пути: ${path}`);
      console.log(`В ожидаемом объекте: ${printValue(path, expected[key] as JSONValue)}\n`);
      continue;
    }

    const expVal = expected[key] as JSONValue;
    const actVal = actual[key] as JSONValue;

    compareValuesPretty(expVal, actVal, path);
  }
}

export function diffObjectsPretty(expected: JSONObject, actual: JSONObject): void {
  compareObjectsPretty(expected, actual, "");

  console.log("--- Ожидаемый объект ---");
  console.dir(expected, { depth: null });

  console.log("--- Фактический объект ---");
  console.dir(actual, { depth: null });
}
