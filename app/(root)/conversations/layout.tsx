import React from 'react'
import ItemList from '@/components/shared/items-list/ItemList'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  return (
    <>
      <ItemList title="Conversations">
        ConversationsLayout
      </ItemList>
      {children}
    </>
  )
}

export default ConversationsLayout