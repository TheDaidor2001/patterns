// server/src/originator.ts
import { Memento } from './memento';

class Originator {
  private state: any;

  setState(state: any): void {
    this.state = state;
  }

  getState(): any {
    return this.state;
  }

  saveToMemento(): Memento {
    return new Memento(this.state);
  }

  restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
  }
}

export { Originator };
