import React, { ReactElement } from 'react';
import { useMutation } from '@apollo/client';
import Modal from '@atlaskit/modal-dialog';
import { ModalInterfaceProps } from '../../types';
import { DELETE_RESOURCE, GET_RESOURCES } from '../../lib/useResources';

const DeleteResourceModal = ({
  selection,
  setIsOpen,
}: ModalInterfaceProps): ReactElement => {
  const [deleteResource] = useMutation(DELETE_RESOURCE, {
    variables: { id: selection },
    refetchQueries: [{ query: GET_RESOURCES }],
  });

  const close = (): void => setIsOpen(false);

  const actions: Array<any> = [
    {
      text: 'Delete',
      onClick: (): any => {
        deleteResource();
        close();
      },
    },
    { text: 'Close', onClick: close },
  ];

  return (
    <Modal
      actions={actions}
      onClose={(): void => setIsOpen(false)}
      heading="Delete"
      appearance="danger"
    >
      <p>{`Are you sure want to delete ${selection}?`}</p>
    </Modal>
  );
};

export default DeleteResourceModal;
