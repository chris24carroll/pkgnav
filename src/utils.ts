// Return a Promise that resolves the results of all the specified thenables in an array
export function composeThenables<A>(
  thenables: Array<Thenable<A>>
) {
  return new Promise<Array<A>>((resolve, reject) => {
    if (thenables.length === 0) {
      resolve([]);
    } else {
      const as: Array<A> = [];
      thenables.forEach(t => t.then(a => {
        as.push(a);
        if (as.length === thenables.length) {
          resolve(as);
        }
      }));
    }
  });
}

export function flatten<A>(arys: Array<Array<A>>): Array<A> {
  const as: Array<A> = [];
  arys.forEach(ary => ary.forEach(a => as.push(a)));
  return as;
}


export function replaceAll(str: string, substr: string, replacement: string): string {
  const elems: Array<string> = [];
  let s = str;
  let i = str.indexOf(substr);
  while (i >= 0) {
    elems.push(s.substring(0, i));
    s = s.substring(i + substr.length);
    i = s.indexOf(substr);
  }
  let result = '';
  elems.forEach(s => {
    result += s;
    result += replacement;
  });
  result += s;
  return result;
}