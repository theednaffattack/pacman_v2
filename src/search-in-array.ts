// https://stackoverflow.com/a/53807432
// https://stackoverflow.com/a/53807432

export function existsInArray(
  arr: [number, number][],
  searchVal: [number, number]
) {
  const hashedSet = new Set(arr.map((pair) => pair.toString()));
  // looks like ["0,0", "1,1", "1,2", "1,3", etc]
  console.log([...hashedSet]);

  return hashedSet.has(searchVal.toString());
}

export function findArrayInArray(
  arr: [number, number][],
  searchVal: [number, number]
) {
  const getIndex = arr.find(([a, b]) => {
    return a == searchVal[0] && b == searchVal[1];
  });

  return getIndex;
}

export function findIndexOfArrayInArray(
  arr: [number, number][],
  searchVal: [number, number]
) {
  const hashedSet = new Set(arr.map((pair) => pair.toString()));

  return [...hashedSet].indexOf(searchVal.toString());
}
