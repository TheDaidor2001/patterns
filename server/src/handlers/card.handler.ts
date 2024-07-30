import type { Socket } from 'socket.io';
import { CardEvent } from '../common/enums/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { logger, LogLevel } from '../services/logger/logger';
import { List } from '../data/models/list';
import { FileLogger } from '../services/logger/file-logger';
import { ConsoleLogger } from '../services/logger/console-logger';
import { Originator } from '../services/memento/originator';
import { Caretaker } from '../services/memento/caretaker';

// Configuration of loggers
logger.subscribe(new FileLogger());
logger.subscribe(new ConsoleLogger());

class CardHandler extends SocketHandler {
  private originator: Originator = new Originator();
  private caretaker: Caretaker = new Caretaker();

  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.UNDO, this.undo.bind(this));
    socket.on(CardEvent.REDO, this.redo.bind(this));
  }

  private saveState(): void {
    this.originator.setState(this.db.getData());
    this.caretaker.addMemento(this.originator.saveToMemento());
  }

  private undo(): void {
    const memento = this.caretaker.undo();
    if (memento) {
      this.originator.restoreFromMemento(memento);
      this.db.setData(this.originator.getState());
      this.updateLists();
    }
  }

  private redo(): void {
    const memento = this.caretaker.redo();
    if (memento) {
      this.originator.restoreFromMemento(memento);
      this.db.setData(this.originator.getState());
      this.updateLists();
    }
  }

  public createCard({
    listId,
    cardName,
  }: {
    listId: string;
    cardName: string;
  }): void {
    this.saveState();
    const newCard = new Card(cardName, '');
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
    logger.log(LogLevel.INFO, `Card created: ${newCard.id}`); // PATTERN: Observer
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    this.saveState();
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
    logger.log(
      LogLevel.INFO,
      `Cards reordered from ${sourceListId} to ${destinationListId}`
    );
  }

  public deleteCard({
    listId,
    cardId,
  }: {
    listId: string;
    cardId: string;
  }): void {
    this.saveState();
    const lists = this.db
      .getData()
      .map((listData) => new List(listData.name, listData.id, listData.cards));

    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return list.setCards(list.cards.filter((card) => card.id !== cardId));
      }
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
    logger.log(LogLevel.INFO, `Card deleted: ${cardId}`); // PATTERN: Observer
  }

  public renameCard({
    listId,
    cardId,
    name,
  }: {
    listId: string;
    cardId: string;
    name: string;
  }): void {
    this.saveState();
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.setCards(
          list.cards.map((card) => {
            if (card.id === cardId) {
              const newCard = new Card(name, card.description);
              newCard.id = card.id;
              newCard.createdAt = card.createdAt;
              return newCard;
            }
            return card;
          })
        );
      }
      return list;
    });
    this.db.setData(updatedLists);
    this.updateLists();
    logger.log(LogLevel.INFO, `Card renamed: ${cardId} to ${name}`); // PATTERN: Observer
  }

  public changeDescription({
    listId,
    cardId,
    newDescription,
  }: {
    listId: string;
    cardId: string;
    newDescription: string;
  }): void {
    this.saveState();
    console.log(
      `changeDescription called with listId: ${listId}, cardId: ${cardId}, newDescription: ${newDescription}`
    ); // Debugging line

    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.setCards(
          list.cards.map((card) => {
            if (card.id === cardId) {
              const newCard = new Card(card.name, newDescription);
              newCard.id = card.id;
              newCard.createdAt = card.createdAt;
              return newCard;
            }
            return card;
          })
        );
      }
      return list;
    });

    this.db.setData(updatedLists);

    this.updateLists();

    logger.log(LogLevel.INFO, `Card description changed: ${cardId}`); // PATTERN: Observer
  }

  public duplicateCard({
    listId,
    cardId,
  }: {
    listId: string;
    cardId: string;
  }): void {
    this.saveState();
    const lists = this.db.getData();
    const targetList = lists.find((list) => list.id === listId);

    if (targetList) {
      const targetCard = targetList.cards.find((card) => card.id === cardId);

      if (targetCard) {
        const duplicatedCard = targetCard.clone(); // PATTERN: Prototype
        targetList.setCards(targetList.cards.concat(duplicatedCard));

        this.db.setData(lists);
        this.updateLists();
        logger.log(LogLevel.INFO, `Card duplicated: ${duplicatedCard.id}`); // PATTERN: Observer
      }
    }
  }
}

export { CardHandler };
