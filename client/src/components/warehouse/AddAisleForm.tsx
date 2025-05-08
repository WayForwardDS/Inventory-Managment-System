import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Aisle } from '../../types/warehouse.type';

interface AddAisleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; size: string }) => void;
}

export const AddAisleForm: React.FC<AddAisleFormProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Add New Aisle"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Add Aisle
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Aisle Name"
          rules={[{ required: true, message: 'Please enter aisle name' }]}
        >
          <Input placeholder="e.g., Aisle A" />
        </Form.Item>
        <Form.Item
          name="size"
          label="Aisle Size"
          rules={[{ required: true, message: 'Please select aisle size' }]}
        >
          <Select placeholder="Select size">
            <Select.Option value="Small">Small</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="Large">Large</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};


// import { useState } from 'react';

// export const AddAisleForm = ({ onClose, onSubmit }) => {
//   const [name, setName] = useState('');
//   const [date, setDate] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(name, new Date(date));
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="p-6 bg-white rounded-lg">
//         <h3 className="mb-4 text-lg font-semibold">Add New Aisle</h3>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Aisle Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="block w-full p-2 mb-2 border rounded"
//             required
//           />
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="block w-full p-2 mb-4 border rounded"
//             required
//           />
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//             >
//               Add Aisle
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };