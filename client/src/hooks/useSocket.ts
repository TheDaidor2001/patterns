import { useEffect, useContext, useState } from 'react';
import { CardEvent, ListEvent } from '../common/enums/enums';
import { SocketContext } from '../context/socket';
import { List, Card } from '../common/types/types';

export const useSocket = () => {
  const [lists, setLists] = useState<List[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit(ListEvent.GET);
    socket.on(ListEvent.UPDATE, (lists: List[]) => {
      setLists(
        lists.map((list) => ({
          ...list,
          setCards: (cards: Card[]) => {
            list.cards = cards;
            return list;
          },
        }))
      );
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        socket.emit(CardEvent.UNDO);
      } else if (event.ctrlKey && event.key === 'y') {
        socket.emit(CardEvent.REDO);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.removeAllListeners(ListEvent.UPDATE);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [socket]);

  return { lists, setLists, socket };
};
