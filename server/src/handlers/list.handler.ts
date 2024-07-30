import { Socket } from 'socket.io';
import { ListEvent } from '../common/enums/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { logger, LogLevel } from '../services/logger/logger';

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
  }

  public getLists(): void {
    const lists = this.db.getData();
    this.io.emit(ListEvent.UPDATE, lists);
  }

  public createList(name: string): void {
    const newList = new List(name);
    const lists = this.db.getData();
    lists.push(newList);
    this.db.setData(lists);
    this.updateLists();
    logger.log(LogLevel.INFO, `List created: ${name}`);
  }

  public deleteList(listId: string): void {
    let lists = this.db.getData();
    lists = lists.filter((list) => list.id !== listId);
    this.db.setData(lists);
    this.updateLists();
    logger.log(LogLevel.INFO, `List deleted: ${listId}`);
  }

  public renameList({ listId, name }: { listId: string; name: string }): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.setCards(list.cards);
        return { ...list, name } as List;
      }
      return list;
    });
    this.db.setData(updatedLists);
    this.updateLists();
    logger.log(LogLevel.INFO, `List renamed: ${listId} to ${name}`);
  }

  public reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const [movedList] = lists.splice(sourceIndex, 1);
    lists.splice(destinationIndex, 0, movedList);
    this.db.setData(lists);
    this.updateLists();
    logger.log(
      LogLevel.INFO,
      `Lists reordered from ${sourceIndex} to ${destinationIndex}`
    );
  }
}

export { ListHandler };
