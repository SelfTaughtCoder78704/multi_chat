import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  return (
    <>
      {children}
    </>
  )
}

export default ConversationsLayout