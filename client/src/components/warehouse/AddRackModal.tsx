import React, { useState } from 'react';
import { Modal, Input, Slider, Form, Button } from 'antd';
import { motion } from 'framer-motion';

interface AddRackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rack: { name: string; barcode: string; capacity: number }) => void;
}

const AddRackModal = ({ open, onClose, onSubmit }: AddRackModalProps) => {
  const [form] = Form.useForm();
  const [capacity, setCapacity] = useState(0);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit({ ...values, capacity });
      form.resetFields();
      setCapacity(0);
    });
  };

  return (
    <Modal
      open={open}
      title="Add New Rack"
      onCancel={onClose}
      onOk={handleOk}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Create Rack
        </Button>,
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Rack No" rules={[{ required: true }]}>
            <Input placeholder="Rack No (e.g. A1)" />
          </Form.Item>
          <Form.Item name="barcode" label="Rack Barcode" rules={[{ required: true }]}>
            <Input placeholder="Rack Barcode (numeric)" />
          </Form.Item>
          <Form.Item label="Rack Space Usage">
            <Slider
              min={0}
              max={100}
              value={capacity}
              onChange={setCapacity}
              tooltip={{ formatter: value => `${value}%` }}
            />
          </Form.Item>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default AddRackModal;
