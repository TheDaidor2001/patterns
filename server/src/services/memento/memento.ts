// server/src/memento.ts
class Memento {
  private state: any;

  constructor(state: any) {
    this.state = state;
  }

  getState(): any {
    return this.state;
  }
}

export { Memento };
