export type Option<A> = Some<A> | None<A>;

export class Some<A> {
  get: A;
  constructor(a: A) {
    this.get = a;
  }
  map<B>(f: (a: A) => B): Option<B> {
    return new Some(f(this.get));
  }
  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.get);
  }
  filter(f: (a: A) => boolean): Option<A> {
    if (f(this.get)) {
      return this;
    } else {
      return new None<A>();
    }
  }
  isEmpty(): boolean {
    return false;
  }
  forEach(f: (a: A) => void): void {
    f(this.get);
  }
  orElse(o: Option<A>): Option<A> {
    return this;
  }
  getOrElse(a: A): A {
    return this.get;
  }
  fold<B>(onEmpty: () => B, onDefined: (a: A) => B): B {
    return onDefined(this.get);
  }
}

export class None<A> {
  map<B>(f: (a: A) => B): Option<B> {
    return new None<B>();
  }
  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return new None<B>();
  }
  filter(f: (a: A) => boolean): Option<A> {
    return this;
  }
  isEmpty(): boolean {
    return true;
  }
  forEach(f: (a: A) => void): void {
  }
  orElse(o: Option<A>): Option<A> {
    return o;
  }
  getOrElse(a: A): A {
    return a;
  }
  fold<B>(onEmpty: () => B, onDefined: (a: A) => B): B {
    return onEmpty();
  }
}

export function option<A>(a: A | undefined) {
  if (a) {
    return new Some(a);
  } else {
    return new None<A>();
  }
}

export function none<A>(): Option<A> {
  return option<A>(undefined);
}

export function some<A>(a: A): Option<A> {
  return option(a);
}