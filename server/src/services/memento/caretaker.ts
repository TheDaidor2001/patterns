// server/src/caretaker.ts
import { Memento } from './memento';

class Caretaker {
  private mementoList: Memento[] = [];
  private currentIndex: number = -1;

  addMemento(memento: Memento): void {
    // Remove all future states if we are adding a new state
    this.mementoList = this.mementoList.slice(0, this.currentIndex + 1);
    this.mementoList.push(memento);
    this.currentIndex++;
  }

  undo(): Memento | null {
    if (this.currentIndex <= 0) {
      return null;
    }
    this.currentIndex--;
    return this.mementoList[this.currentIndex];
  }

  redo(): Memento | null {
    if (this.currentIndex >= this.mementoList.length - 1) {
      return null;
    }
    this.currentIndex++;
    return this.mementoList[this.currentIndex];
  }
}

export { Caretaker };
