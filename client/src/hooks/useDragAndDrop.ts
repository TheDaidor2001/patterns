import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import { List } from '../common/types/types';
import { reorderLists, reorderCards } from '../services/reorder.service';
import { CardEvent, ListEvent } from '../common/enums/enums';

export const useDragAndDrop = (
  lists: List[],
  setLists: (lists: List[]) => void,
  socket: any
) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    const isNotMoved =
      source.droppableId === destination.droppableId &&
      source.index === destination?.index;

    if (isNotMoved) {
      return;
    }

    const isReorderLists = result.type === 'COLUMN';

    if (isReorderLists) {
      setLists(reorderLists(lists, source.index, destination.index));
      socket.emit(ListEvent.REORDER, source.index, destination.index);
      return;
    }

    setLists(reorderCards(lists, source, destination));
    socket.emit(CardEvent.REORDER, {
      sourceListId: source.droppableId,
      destinationListId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  return { onDragEnd };
};
