import type { DraggableProvided } from '@hello-pangea/dnd';
import React, { useState, useEffect } from 'react';
import { Card } from '../../common/types/types';
import { CopyButton } from '../primitives/copy-button';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Text } from '../primitives/text';
import { Title } from '../primitives/title';
import { Container } from './styled/container';
import { Content } from './styled/content';
import { Footer } from './styled/footer';
import { useEventHandlers } from '../../context/EventHandlersContext';

type Props = {
  card: Card;
  listId: string;
  isDragging: boolean;
  provided: DraggableProvided;
};

const CardItem = ({ card, listId, isDragging, provided }: Props) => {
  const [title, setTitle] = useState(card.name);
  const [description, setDescription] = useState(card.description);

  useEffect(() => {
    setTitle(card.name);
    setDescription(card.description);
  }, [card.name, card.description]);

  const {
    handleDeleteCard,
    handleRenameCard,
    handleChangeCardDescription,
    handleDuplicateCard,
  } = useEventHandlers();

  const handleDelete = () => handleDeleteCard(listId, card.id);
  const handleRename = (newName: string) =>
    handleRenameCard(listId, card.id, newName);
  const handleChangeDescription = (newDescription: string) => {
    handleChangeCardDescription(listId, card.id, newDescription);
  };
  const handleDuplicate = () => handleDuplicateCard(listId, card.id);

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title onChange={handleRename} title={title} fontSize="large" isBold />
        <Text text={description} onChange={handleChangeDescription} />
        <Footer>
          <DeleteButton onClick={handleDelete} />
          <Splitter />
          <CopyButton onClick={handleDuplicate} />
        </Footer>
      </Content>
    </Container>
  );
};

export { CardItem };
