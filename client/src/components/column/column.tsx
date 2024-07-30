import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { Draggable } from '@hello-pangea/dnd';
import { CardsList } from '../card-list/card-list';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Title } from '../primitives/title';
import { Footer } from './components/footer';
import { Container } from './styled/container';
import { Header } from './styled/header';
import { Card } from '../../common/types/types';
import { useEventHandlers } from '../../context/EventHandlersContext';

type Props = {
  listId: string;
  listName: string;
  cards: Card[];
  index: number;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, name: string) => void;
};

const Column = ({ listId, listName, cards, index }: Props) => {
  const { handleRenameList, handleDeleteList } = useEventHandlers();

  const onRenameList = (listId: string, name: string) => {
    handleRenameList(listId, name);
  };

  const onDeleteList = (listId: string) => {
    handleDeleteList(listId);
  };

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          className="column-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Header
            className="column-header"
            isDragging={snapshot.isDragging}
            {...provided.dragHandleProps}
          >
            <Title
              aria-label={listName}
              title={listName}
              onChange={(name) => onRenameList(listId, name)}
              fontSize="large"
              width={200}
              isBold
            />
            <Splitter />
            <DeleteButton color="#FFF0" onClick={() => onDeleteList(listId)} />
          </Header>
          <CardsList listId={listId} listType="CARD" cards={cards} />
          <Footer listId={listId} />
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
