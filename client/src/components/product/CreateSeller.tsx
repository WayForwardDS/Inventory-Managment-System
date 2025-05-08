import { Button, Flex } from 'antd';
import CreateSellerModal from '../modal/CreateSellerModal';
import { useState } from 'react';

const CreateSeller = () => {
  const [createSellerModalOpen, setCreateSellerModalOpen] = useState(false);

  return (
    <>
      <Flex
      >

        <Button
          htmlType='submit'
          type='primary'
          style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          onClick={() => setCreateSellerModalOpen(true)}
        >
          Create Seller
        </Button>
      </Flex>

      <CreateSellerModal
        openModal={createSellerModalOpen}
        setOpenModal={setCreateSellerModalOpen}
      />
    </>
  );
};

export default CreateSeller;
