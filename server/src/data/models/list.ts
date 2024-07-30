import { randomUUID } from 'crypto';
import { Card } from './card';

class List {
  public id: string;
  public name: string;
  public cards: Card[] = [];

  public constructor(name: string, id?: string, cards?: Card[]) {
    this.name = name;
    this.id = id ?? randomUUID();
    if (cards) {
      this.cards = cards;
    }
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setCards(cards: Card[]): this {
    this.cards = cards;
    return this;
  }
}

export { List };
