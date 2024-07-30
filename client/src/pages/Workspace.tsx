import { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type {
  DraggableLocation,
  DropResult,
  DroppableProvided,
} from '@hello-pangea/dnd';
import { CardEvent, ListEvent } from '../common/enums/enums';
import { Card, type List } from '../common/types/types';
import Column from '../components/column/column';
import { ColumnCreator } from '../components/column-creator/column-creator';
import { SocketContext } from '../context/socket';
import {
  EventHandlersProvider,
  useEventHandlers,
} from '../context/EventHandlersContext';
import { reorderLists, reorderCards } from '../services/reorder.service';
import { Container } from './styled/container';

const WorkspaceComponent = () => {
  const [lists, setLists] = useState<List[]>([]);
  const socket = useContext(SocketContext);

  const {
    handleCreateList,
    handleDeleteList,
    handleRenameList,
    handleRedo,
    handleUndo,
  } = useEventHandlers();

  useEffect(() => {
    socket.emit(ListEvent.GET); // Emit the event to request the lists
    socket.on(ListEvent.UPDATE, (lists: List[]) => {
      setLists(
        lists.map((list) => {
          const updatedList = {
            ...list,
            setCards: (cards: Card[]) => {
              updatedList.cards = cards;
              return updatedList;
            },
          };
          return updatedList;
        })
      );
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        console.log('click');
        handleUndo();
      } else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socket.removeAllListeners(ListEvent.UPDATE);
    };
  }, [socket]);

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided: DroppableProvided) => (
          <Container
            className="workspace-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {lists.map((list: List, index: number) => (
              <Column
                key={list.id}
                index={index}
                listName={list.name}
                cards={list.cards}
                listId={list.id}
                onDeleteList={handleDeleteList}
                onRenameList={handleRenameList}
              />
            ))}
            {provided.placeholder}
            <ColumnCreator onCreateList={handleCreateList} />
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export const Workspace = () => {
  const socket = useContext(SocketContext);
  return (
    <EventHandlersProvider socket={socket}>
      <WorkspaceComponent />
    </EventHandlersProvider>
  );
};
