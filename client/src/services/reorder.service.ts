import * as R from 'ramda';
import type { DraggableLocation } from '@hello-pangea/dnd';
import { type Card, type List } from '../common/types/types';

// Función para reordenar elementos dentro de una lista
const reorderList = <T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Función para mover una tarjeta de una lista a otra
const moveCard = (
  sourceList: Card[],
  destList: Card[],
  sourceIndex: number,
  destIndex: number
): [Card[], Card[]] => {
  const sourceClone = Array.from(sourceList);
  const destClone = Array.from(destList);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  return [sourceClone, destClone];
};

// Reordena las listas
export const reorderLists = R.curry(
  (items: List[], startIndex: number, endIndex: number): List[] => {
    return reorderList(items, startIndex, endIndex);
  }
);

// Reordena las tarjetas entre listas
export const reorderCards = R.curry(
  (
    lists: List[],
    source: DraggableLocation,
    destination: DraggableLocation
  ): List[] => {
    const findListById = (id: string): List | undefined => {
      return R.find((list: List) => list.id === id, lists);
    };

    const currentList = findListById(source.droppableId)?.cards || [];
    const targetList = findListById(destination.droppableId)?.cards || [];

    const isSameList = source.droppableId === destination.droppableId;

    if (isSameList) {
      const reordered = reorderList(
        currentList,
        source.index,
        destination.index
      );
      return R.map(
        (list) =>
          list.id === source.droppableId
            ? R.assoc('cards', reordered, list)
            : list,
        lists
      );
    }

    const [newSourceList, newTargetList] = moveCard(
      currentList,
      targetList,
      source.index,
      destination.index
    );

    return R.map((list) => {
      if (list.id === source.droppableId) {
        return R.assoc('cards', newSourceList, list);
      }
      if (list.id === destination.droppableId) {
        return R.assoc('cards', newTargetList, list);
      }
      return list;
    }, lists);
  }
);
