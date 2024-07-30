import { useEventHandlers } from '../../../context/EventHandlersContext';
import { CreatorInput } from '../../primitives/creator-input';
import { FooterContainer } from '../styled/footer-container';

type Props = {
  listId: string;
};

const Footer = ({ listId }: Props) => {
  const { handleCreateCard } = useEventHandlers();

  const onCreateCard = (cardName: string) => {
    handleCreateCard(listId, cardName);
  };
  return (
    <FooterContainer className="column-footer-container">
      <CreatorInput onSubmit={onCreateCard} />
    </FooterContainer>
  );
};

export { Footer };
