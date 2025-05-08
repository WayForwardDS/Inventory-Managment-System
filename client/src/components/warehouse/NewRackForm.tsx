// import React, { useState } from 'react';
// import { Modal, Form, Input, Slider, Progress, Tag, Space } from 'antd';
// import { PercentageOutlined } from '@ant-design/icons';

// interface NewRackFormProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (values: { name: string; barcode: string; capacity: number }) => void;
// }

// export const NewRackForm = ({ open, onClose, onSubmit }: NewRackFormProps) => {
//   const [form] = Form.useForm();
//   const [capacityPercentage, setCapacityPercentage] = useState(0);

//   const handleFinish = (values: any) => {
  
//     const capacityUnits = Math.round((capacityPercentage / 100) * 100);
//     onSubmit({ 
//       ...values, 
//       capacity: capacityUnits,
//       used: 0 // Initialize as empty
//     });
//     form.resetFields();
//     setCapacityPercentage(0);
//   };
//   // Color logic matching RackCard
//   const getStatusColor = (percent: number) => {
//     if (percent >= 100) return '#ff4d4f';
//     if (percent >= 90) return '#faad14';
//     if (percent === 0) return '#52c41a';
//     return '#1890ff';
//   };

//   return (
//     <Modal
//       title="Add New Rack"
//       open={open}
//       onCancel={onClose}
//       onOk={() => form.submit()}
//       okText="Create Rack"
//       width={600}
//     >
//       <Form layout="vertical" form={form} onFinish={handleFinish}>
//         {/* Circular Percentage Display (like RackCard) */}
//         <div className="flex justify-center mb-6">
//           <Progress
//             type="dashboard"
//             percent={capacityPercentage}
//             strokeColor={getStatusColor(capacityPercentage)}
//             strokeWidth={10}
//             width={150}
//             format={() => (
//               <div className="text-center">
//                 <span className="text-2xl font-bold">{capacityPercentage}%</span>
//                 <div className="text-xs text-gray-500">Capacity</div>
//               </div>
//             )}
//           />
//         </div>

//         <Form.Item
//           label="Rack No"
//           name="name"
//           rules={[{ required: true, message: 'Please enter the Rack number!' }]}
//         >
//           <Input placeholder="e.g., Rack A1" />
//         </Form.Item>

//         <Form.Item
//           label="Rack Barcode"
//           name="barcode"
//           rules={[{ required: true, message: 'Please enter the barcode!' }]}
//         >
//           <Input placeholder="Numeric barcode" />
//         </Form.Item>

//         <Form.Item label="Rack Space (Capacity)">
//           <Slider
//             min={0}
//             max={100}
//             value={capacityPercentage}
//             onChange={setCapacityPercentage}
//             tooltip={{ formatter: val => `${val}%` }}
//             trackStyle={{ backgroundColor: getStatusColor(capacityPercentage) }}
//             handleStyle={{ 
//               borderColor: getStatusColor(capacityPercentage),
//               backgroundColor: getStatusColor(capacityPercentage)
//             }}
//           />
//           <div className="flex justify-between mt-2">
//             <Tag icon={<PercentageOutlined />} color="blue">
//               Set Capacity: {capacityPercentage}%
//             </Tag>
//           </div>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// components/warehouse/NewRackForm.tsx
import React, { useState } from 'react';
import { Modal, Form, Input, Slider, Progress, Tag, Space } from 'antd';
import { PercentageOutlined } from '@ant-design/icons';

interface NewRackFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; barcode: string; capacity: number, used: number }) => void;
}

export const NewRackForm = ({ open, onClose, onSubmit }: NewRackFormProps) => {
  const [form] = Form.useForm();
  const [capacityPercentage, setCapacityPercentage] = useState(0);

  const handleFinish = (values: any) => {
    const capacityUnits = 100; // Fixed capacity of 100 units
    const usedUnits = Math.round((capacityPercentage / 100) * capacityUnits);
    
    onSubmit({ 
      ...values, 
      capacity: capacityUnits,
      used: usedUnits // Set initial used units based on slider
    });
    form.resetFields();
    setCapacityPercentage(0);
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 100) return '#ff4d4f';
    if (percent >= 90) return '#faad14';
    if (percent === 0) return '#52c41a';
    return '#1890ff';
  };

  return (
    <Modal
      title="Add New Rack"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create Rack"
      width={600}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <div className="flex justify-center mb-6">
          <Progress
            type="dashboard"
            percent={capacityPercentage}
            strokeColor={getStatusColor(capacityPercentage)}
            strokeWidth={10}
            width={150}
            format={() => (
              <div className="text-center">
                <span className="text-2xl font-bold">{capacityPercentage}%</span>
                <div className="text-xs text-gray-500">
                  {capacityPercentage === 0 ? 'Empty' : 'Capacity'}
                </div>
              </div>
            )}
          />
        </div>

        <Form.Item
          label="Rack No"
          name="name"
          rules={[{ required: true, message: 'Please enter the Rack number!' }]}
        >
          <Input placeholder="e.g., Rack A1" />
        </Form.Item>

        <Form.Item
          label="Rack Barcode"
          name="barcode"
          rules={[{ required: true, message: 'Please enter the barcode!' }]}
        >
          <Input placeholder="Numeric barcode" />
        </Form.Item>

        <Form.Item label="Initial Space Usage">
          <Slider
            min={0}
            max={100}
            value={capacityPercentage}
            onChange={setCapacityPercentage}
            tooltip={{ formatter: val => `${val}%` }}
            trackStyle={{ backgroundColor: getStatusColor(capacityPercentage) }}
            handleStyle={{ 
              borderColor: getStatusColor(capacityPercentage),
              backgroundColor: getStatusColor(capacityPercentage)
            }}
          />
          <div className="flex justify-between mt-2">
            <Tag icon={<PercentageOutlined />} color="blue">
              Usage: {capacityPercentage}%
            </Tag>
            <Tag color="green">
              Capacity: 100 units
            </Tag>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};