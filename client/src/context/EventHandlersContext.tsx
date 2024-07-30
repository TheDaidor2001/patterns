import React, { createContext, useContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { CardEvent, ListEvent } from '../common/enums/enums';

interface EventHandlersContextType {
  handleCreateList: (listName: string) => void;
  handleDeleteList: (listId: string) => void;
  handleRenameList: (listId: string, name: string) => void;
  handleCreateCard: (listId: string, cardName: string) => void;
  handleDeleteCard: (listId: string, cardId: string) => void;
  handleRenameCard: (listId: string, cardId: string, name: string) => void;
  handleChangeCardDescription: (
    listId: string,
    cardId: string,
    description: string
  ) => void;
  handleDuplicateCard: (listId: string, cardId: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
}

const EventHandlersContext = createContext<
  EventHandlersContextType | undefined
>(undefined);

export const useEventHandlers = (): EventHandlersContextType => {
  const context = useContext(EventHandlersContext);
  if (!context) {
    throw new Error(
      'useEventHandlers must be used within a EventHandlersProvider'
    );
  }
  return context;
};

export const EventHandlersProvider = ({
  children,
  socket,
}: {
  children: ReactNode;
  socket: Socket;
}) => {
  const handleCreateList = (listName: string) => {
    socket.emit(ListEvent.CREATE, listName);
  };

  const handleDeleteList = (listId: string) => {
    socket.emit(ListEvent.DELETE, listId);
  };

  const handleRenameList = (listId: string, name: string) => {
    socket.emit(ListEvent.RENAME, { listId, name });
  };

  const handleCreateCard = (listId: string, cardName: string) => {
    socket.emit(CardEvent.CREATE, { listId, cardName });
  };

  const handleDeleteCard = (listId: string, cardId: string) => {
    socket.emit(CardEvent.DELETE, { listId, cardId });
  };

  const handleRenameCard = (listId: string, cardId: string, name: string) => {
    socket.emit(CardEvent.RENAME, { listId, cardId, name });
  };

  const handleChangeCardDescription = (
    listId: string,
    cardId: string,
    description: string
  ) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, {
      listId,
      cardId,
      newDescription: description,
    });
  };

  const handleDuplicateCard = (listId: string, cardId: string) => {
    socket.emit(CardEvent.DUPLICATE, { listId, cardId });
  };

  const handleUndo = () => {
    socket.emit(CardEvent.UNDO);
  };

  const handleRedo = () => {
    socket.emit(CardEvent.REDO);
  };

  return (
    <EventHandlersContext.Provider
      value={{
        handleCreateList,
        handleDeleteList,
        handleRenameList,
        handleCreateCard,
        handleDeleteCard,
        handleRenameCard,
        handleChangeCardDescription,
        handleDuplicateCard,
        handleUndo,
        handleRedo,
      }}
    >
      {children}
    </EventHandlersContext.Provider>
  );
};
