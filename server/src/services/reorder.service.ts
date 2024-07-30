import { logger, LogLevel } from './logger/logger';
import { Card } from '../data/models/card';
import { List } from '../data/models/list';

class ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    // PATTERN: Proxy (logging input parameters)
    logger.log(
      LogLevel.INFO,
      `Reorder items from index ${startIndex} to ${endIndex}`
    );

    const card = items[startIndex];
    const listWithRemoved = this.remove(items, startIndex);
    const result = this.insert(listWithRemoved, endIndex, card);

    return result;
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    // PATTERN: Proxy (logging input parameters)
    logger.log(
      LogLevel.INFO,
      `Reorder cards from list ${sourceListId} index ${sourceIndex} to list ${destinationListId} index ${destinationIndex}`
    );

    const target: Card = lists.find((list) => list.id === sourceListId)
      ?.cards?.[sourceIndex];

    if (!target) {
      return lists;
    }

    const newLists = lists.map((list) => {
      if (list.id === sourceListId) {
        list.setCards(this.remove(list.cards, sourceIndex));
      }

      if (list.id === destinationListId) {
        list.setCards(this.insert(list.cards, destinationIndex, target));
      }

      return list;
    });

    return newLists;
  }

  private remove<T>(items: T[], index: number): T[] {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  private insert<T>(items: T[], index: number, value: T): T[] {
    return [...items.slice(0, index), value, ...items.slice(index)];
  }
}

export { ReorderService };
