// import { useEffect, useRef, useState } from 'react';
// import {
//   Button,
//   Input,
//   Slider,
//   Space,
//   Typography,
//   Card,
//   Form,
//   Divider,
//   notification,
//   Tag,
//   Dropdown,
//   MenuProps,
// } from 'antd';
// import {
//   BarcodeOutlined,
//   TagOutlined,
//   NumberOutlined,
//   DashboardOutlined,
//   CloseOutlined,
//   SaveOutlined,
//   PercentageOutlined,
//   CameraOutlined,
//   KeyOutlined,
// } from '@ant-design/icons';
// import { motion } from 'framer-motion';
// import { Html5Qrcode } from 'html5-qrcode';
// import { useUpdateStockMutation, useGetRacksQuery } from '../../redux/features/management/warehouseApt';
// import { Rack, ProductInRack } from '../../types/warehouse.type';

// interface AddStockFormProps {
//   rack: Rack;
//   product?: ProductInRack | null;
//   onClose: () => void;
//   onProductClear?: () => void;
//   onProductSelect: (product: ProductInRack) => void;
// }

// interface FormValues {
//   productName: string;
//   barcode: string;
//   quantity: number;
//   manualPercentage: number;
// }

// export const AddStockForm = ({
//   rack,
//   product,
//   onClose,
//   onProductClear,
//   onProductSelect,
// }: AddStockFormProps) => {
//   const [form] = Form.useForm();
//   const [updateStock, { isLoading }] = useUpdateStockMutation();
//   const { data: racks = [] } = useGetRacksQuery();
//   const [isScanning, setIsScanning] = useState(false);
//   const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

//   const allProducts = racks.flatMap((rack) =>
//     rack.products.map((product) => ({
//       ...product,
//       rackName: rack.name,
//       rackId: rack.id,
//     }))
//   );

//   useEffect(() => {
//     if (product) {
//       form.setFieldsValue({
//         productName: product.name,
//         barcode: product.barcode,
//         quantity: product.quantity,
//         manualPercentage: Math.round((rack.used / rack.capacity) * 100),
//       });
//     } else {
//       form.resetFields();
//     }
//   }, [product, form, rack]);

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   const handleManualBarcodeInput = () => {
//     const manualBarcode = prompt('Please enter the barcode manually');
//     if (manualBarcode) {
//       checkBarcode(manualBarcode);
//     }
//   };

//   const checkBarcode = (barcode: string) => {
//     const foundProduct = allProducts.find((p) => p.barcode === barcode);
//     if (foundProduct) {
//       onProductSelect(foundProduct);
//       notification.success({
//         message: 'Product Found',
//         description: `${foundProduct.name} loaded from inventory`,
//       });
//     } else {
//       notification.info({
//         message: 'New Product',
//         description: 'This product is not in inventory. Please enter details.',
//       });
//       form.setFieldsValue({ barcode });
//     }
//   };

//   const handleCameraScan = async () => {
//     setIsScanning(true);
//     try {
//       const cameraId = (await Html5Qrcode.getCameras())[0]?.id;
//       if (!cameraId) throw new Error('No camera found');

//       html5QrCodeRef.current = new Html5Qrcode("qr-reader");

//       await html5QrCodeRef.current.start(
//         cameraId,
//         {
//           fps: 10,
//           qrbox: { width: 250, height: 100 },
//         },
//         (decodedText) => {
//           checkBarcode(decodedText);
//           stopCamera();
//         },
//         (error) => {
//           console.warn('Scan error', error);
//         }
//       );
//     } catch (err) {
//       notification.error({
//         message: 'Scan Error',
//         description: 'Failed to access camera for scanning.',
//       });
//       setIsScanning(false);
//     }
//   };

//   const stopCamera = () => {
//     html5QrCodeRef.current?.stop().then(() => {
//       html5QrCodeRef.current?.clear();
//       html5QrCodeRef.current = null;
//       setIsScanning(false);
//     });
//   };

//   const scanMenuItems: MenuProps['items'] = [
//     {
//       key: '1',
//       label: 'Scan with Camera',
//       icon: <CameraOutlined />,
//       onClick: handleCameraScan,
//     },
//     {
//       key: '2',
//       label: 'Enter Barcode Manually',
//       icon: <KeyOutlined />,
//       onClick: handleManualBarcodeInput,
//     },
//   ];

//   const onFinish = async (values: FormValues) => {
//     try {
//       await updateStock({
//         type: product ? 'UPDATE' : 'IN',
//         productBarcode: values.barcode,
//         productName: values.productName,
//         quantity: values.quantity,
//         rackId: rack.id,
//         manualPercentage: values.manualPercentage,
//         timestamp: new Date().toISOString(),
//         originalBarcode: product?.barcode,
//       }).unwrap();

//       notification.success({
//         message: product ? 'Product Updated' : 'Stock Updated',
//         description: product
//           ? `Updated ${product.name} in ${rack.name}`
//           : `Added new product ${values.productName} to ${rack.name}`,
//       });

//       onClose();
//     } catch (error) {
//       notification.error({
//         message: 'Operation Failed',
//         description: product
//           ? 'Failed to update product'
//           : 'Failed to add new stock',
//       });
//       console.error('Operation failed:', error);
//     }
//   };

//   const handleClearProduct = () => {
//     form.resetFields();
//     if (onProductClear) onProductClear();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
//     >
//       {isScanning && (
//         <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
//           <div id="qr-reader" className="h-40 bg-white w-80" />
//           <Button type="primary" danger onClick={stopCamera} className="mt-4">
//             Stop Scanning
//           </Button>
//         </div>
//       )}

//       <motion.div
//         className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
//         animate={{
//           scale: [1, 1.1, 1],
//           rotate: [0, 360, 0],
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//         }}
//       />

//       <motion.div
//         initial={{ y: 60, opacity: 0, scale: 0.98 }}
//         animate={{ y: 0, opacity: 1, scale: 1 }}
//         transition={{ type: 'spring', stiffness: 100, damping: 10 }}
//         className="relative z-10"
//       >
//         <Card
//           className="w-full max-w-xl transition-all border shadow-xl bg-white/20 border-white/30 rounded-3xl backdrop-blur-lg"
//           title={
//             <Space>
//               <DashboardOutlined className="text-cyan-400" />
//               <Typography.Title level={4} className="!m-0 text-white drop-shadow-sm">
//                 {rack.name} Storage
//               </Typography.Title>
//               {product && (
//                 <Tag color="blue" className="ml-2">
//                   Editing: {product.name}
//                 </Tag>
//               )}
//             </Space>
//           }
//           extra={
//             <motion.button
//               whileHover={{ scale: 1.1, rotate: 90 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={onClose}
//               className="text-white transition-all hover:text-red-500"
//             >
//               <CloseOutlined />
//             </motion.button>
//           }
//         >
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//             initialValues={{
//               manualPercentage: Math.round((rack.used / rack.capacity) * 100),
//             }}
//           >
//             <Form.Item
//               label={
//                 <Space>
//                   <TagOutlined />
//                   <span className="text-white/80">Product Name</span>
//                 </Space>
//               }
//               name="productName"
//               rules={[{ required: true, message: 'Please input product name!' }]}
//             >
//               <Input size="large" placeholder="Enter product name" />
//             </Form.Item>

//             <Form.Item
//               label={
//                 <Space>
//                   <BarcodeOutlined />
//                   <span className="text-white/80">Barcode</span>
//                 </Space>
//               }
//               name="barcode"
//               rules={[{ required: true, message: 'Please input barcode!' }]}
//             >
//               <div className="flex items-center gap-2">
//                 <Input size="large" placeholder="Scan or enter barcode" />
//                 <Dropdown menu={{ items: scanMenuItems }} placement="bottomRight" arrow>
//                   <Button type="primary" icon={<CameraOutlined />} loading={isScanning}>
//                     Scan
//                   </Button>
//                 </Dropdown>
//                 {product && (
//                   <Button type="default" onClick={handleClearProduct} danger>
//                     Clear
//                   </Button>
//                 )}
//               </div>
//             </Form.Item>

//             <Form.Item
//               label={
//                 <Space>
//                   <NumberOutlined />
//                   <span className="text-white/80">Quantity</span>
//                 </Space>
//               }
//               name="quantity"
//               rules={[{ required: true, message: 'Please input quantity!' }]}
//             >
//               <Input type="number" size="large" min={1} max={rack.capacity - rack.used} />
//             </Form.Item>

//             <Divider orientation="left">
//               <Space>
//                 <PercentageOutlined />
//                 <span className="text-white/70">Storage Adjustment</span>
//               </Space>
//             </Divider>

//             <Form.Item name="manualPercentage">
//               <Slider
//                 min={0}
//                 max={100}
//                 tooltip={{ formatter: (value: any) => `${value}%` }}
//                 trackStyle={{ backgroundColor: '#00c9ff' }}
//                 handleStyle={{ borderColor: '#00c9ff' }}
//               />
//             </Form.Item>

//             <div className="flex items-center justify-between mt-6">
//               <div className="space-y-1">
//                 <Typography.Text className="text-white/60">
//                   Current: {rack.used}/{rack.capacity} units
//                 </Typography.Text>
//                 <Typography.Text className="text-white/60">
//                   Available: {rack.capacity - rack.used} units
//                 </Typography.Text>
//               </div>
//               <Form.Item className="!mb-0">
//                 <Space>
//                   <Button onClick={onClose}>Cancel</Button>
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       icon={<SaveOutlined />}
//                       loading={isLoading}
//                       className="text-white transition-all shadow-lg bg-gradient-to-br from-blue-500 to-fuchsia-600 hover:from-blue-600 hover:to-fuchsia-700"
//                     >
//                       {product ? 'Update Product' : 'Add Product'}
//                     </Button>
//                   </motion.div>
//                 </Space>
//               </Form.Item>
//             </div>
//           </Form>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// };


import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  Slider,
  Space,
  Typography,
  Card,
  Form,
  Divider,
  notification,
  Tag,
  Dropdown,
  MenuProps,
  Select,
} from 'antd';
import {
  BarcodeOutlined,
  TagOutlined,
  NumberOutlined,
  DashboardOutlined,
  CloseOutlined,
  SaveOutlined,
  PercentageOutlined,
  CameraOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { useUpdateStockMutation, useGetRacksQuery } from '../../redux/features/management/warehouseApt';
import { Rack, ProductInRack } from '../../types/warehouse.type';

interface AddStockFormProps {
  racks?: Rack[];
  rack?: Rack;
  product?: ProductInRack | null;
  onClose: () => void;
  onProductClear?: () => void;
  onProductSelect: (product: ProductInRack) => void;
}

interface FormValues {
  rackId?: string;
  productName: string;
  barcode: string;
  quantity: number;
  manualPercentage: number;
}

export const AddStockForm = ({
  racks,
  rack,
  product,
  onClose,
  onProductClear,
  onProductSelect,
}: AddStockFormProps) => {
  const [form] = Form.useForm();
  const [updateStock, { isLoading }] = useUpdateStockMutation();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedRack, setSelectedRack] = useState<Rack | undefined>(rack);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.name,
        barcode: product.barcode,
        quantity: product.quantity,
        manualPercentage: Math.round((rack?.used / rack?.capacity || 0) * 100),
      });
    } else {
      form.resetFields();
    }
  }, [product, form, rack]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getRackAvailabilityColor = (rack: Rack) => {
    const percentage = (rack.used / rack.capacity) * 100;
    if (percentage >= 90) return 'red';
    if (percentage >= 50) return 'orange';
    return 'green';
  };

  const handleManualBarcodeInput = () => {
    const manualBarcode = prompt('Please enter the barcode manually');
    if (manualBarcode) {
      checkBarcode(manualBarcode);
    }
  };

  const checkBarcode = (barcode: string) => {
    const foundProduct = racks?.flatMap(r => r.products)
      .find((p) => p.barcode === barcode);
    
    if (foundProduct) {
      onProductSelect(foundProduct);
      notification.success({
        message: 'Product Found',
        description: `${foundProduct.name} loaded from inventory`,
      });
    } else {
      notification.info({
        message: 'New Product',
        description: 'This product is not in inventory. Please enter details.',
      });
      form.setFieldsValue({ barcode });
    }
  };

  const handleCameraScan = async () => {
    setIsScanning(true);
    try {
      const cameraId = (await Html5Qrcode.getCameras())[0]?.id;
      if (!cameraId) throw new Error('No camera found');

      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 100 },
        },
        (decodedText) => {
          checkBarcode(decodedText);
          stopCamera();
        },
        (error) => {
          console.warn('Scan error', error);
        }
      );
    } catch (err) {
      notification.error({
        message: 'Scan Error',
        description: 'Failed to access camera for scanning.',
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    html5QrCodeRef.current?.stop().then(() => {
      html5QrCodeRef.current?.clear();
      html5QrCodeRef.current = null;
      setIsScanning(false);
    });
  };

  const scanMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Scan with Camera',
      icon: <CameraOutlined />,
      onClick: handleCameraScan,
    },
    {
      key: '2',
      label: 'Enter Barcode Manually',
      icon: <KeyOutlined />,
      onClick: handleManualBarcodeInput,
    },
  ];

  const onFinish = async (values: FormValues) => {
    try {
      const targetRack = rack || racks?.find(r => r.id === values.rackId);
      if (!targetRack) throw new Error('No rack selected');

      await updateStock({
        type: product ? 'UPDATE' : 'IN',
        productBarcode: values.barcode,
        productName: values.productName,
        quantity: values.quantity,
        rackId: targetRack.id,
        manualPercentage: values.manualPercentage,
        timestamp: new Date().toISOString(),
        originalBarcode: product?.barcode,
      }).unwrap();

      notification.success({
        message: product ? 'Product Updated' : 'Stock Updated',
        description: product
          ? `Updated ${product.name} in ${targetRack.name}`
          : `Added new product ${values.productName} to ${targetRack.name}`,
      });

      onClose();
    } catch (error) {
      notification.error({
        message: 'Operation Failed',
        description: product
          ? 'Failed to update product'
          : 'Failed to add new stock',
      });
      console.error('Operation failed:', error);
    }
  };

  const handleClearProduct = () => {
    form.resetFields();
    if (onProductClear) onProductClear();
  };

  const handleRackChange = (rackId: string) => {
    const selected = racks?.find(r => r.id === rackId);
    setSelectedRack(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
    >
      {isScanning && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <div id="qr-reader" className="h-40 bg-white w-80" />
          <Button type="primary" danger onClick={stopCamera} className="mt-4">
            Stop Scanning
          </Button>
        </div>
      )}

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        className="relative z-10"
      >
        <Card
          className="w-full max-w-xl transition-all border shadow-xl bg-white/20 border-white/30 rounded-3xl backdrop-blur-lg"
          title={
            <Space>
              <DashboardOutlined className="text-cyan-400" />
              <Typography.Title level={4} className="!m-0 text-white drop-shadow-sm">
                {selectedRack?.name || 'Select Rack'} Storage
              </Typography.Title>
              {product && (
                <Tag color="blue" className="ml-2">
                  Editing: {product.name}
                </Tag>
              )}
            </Space>
          }
          extra={
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white transition-all hover:text-red-500"
            >
              <CloseOutlined />
            </motion.button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              manualPercentage: Math.round((selectedRack?.used / selectedRack?.capacity || 0) * 100),
            }}
          >
            {!rack && racks && (
              <Form.Item
                label="Select Rack"
                name="rackId"
                rules={[{ required: true, message: 'Please select a rack!' }]}
              >
                <Select
                  placeholder="Select a rack"
                  onChange={handleRackChange}
                  options={racks.map(r => ({
                    value: r.id,
                    label: (
                      <Space>
                        <span>{r.name}</span>
                        <Tag color={getRackAvailabilityColor(r)}>
                          {Math.round((r.used / r.capacity) * 100)}% used
                        </Tag>
                        <span>({r.capacity - r.used} units available)</span>
                      </Space>
                    ),
                  }))}
                />
              </Form.Item>
            )}

            <Form.Item
              label={
                <Space>
                  <TagOutlined />
                  <span className="text-white/80">Product Name</span>
                </Space>
              }
              name="productName"
              rules={[{ required: true, message: 'Please input product name!' }]}
            >
              <Input size="large" placeholder="Enter product name" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <BarcodeOutlined />
                  <span className="text-white/80">Barcode</span>
                </Space>
              }
              name="barcode"
              rules={[{ required: true, message: 'Please input barcode!' }]}
            >
              <div className="flex items-center gap-2">
                <Input size="large" placeholder="Scan or enter barcode" />
                <Dropdown menu={{ items: scanMenuItems }} placement="bottomRight" arrow>
                  <Button type="primary" icon={<CameraOutlined />} loading={isScanning}>
                    Scan
                  </Button>
                </Dropdown>
                {product && (
                  <Button type="default" onClick={handleClearProduct} danger>
                    Clear
                  </Button>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <NumberOutlined />
                  <span className="text-white/80">Quantity</span>
                </Space>
              }
              name="quantity"
              rules={[{ required: true, message: 'Please input quantity!' }]}
            >
              <Input 
                type="number" 
                size="large" 
                min={1} 
                max={selectedRack ? selectedRack.capacity - selectedRack.used : undefined} 
              />
            </Form.Item>

            {selectedRack && (
              <>
                <Divider orientation="left">
                  <Space>
                    <PercentageOutlined />
                    <span className="text-white/70">Storage Adjustment</span>
                  </Space>
                </Divider>

                <Form.Item name="manualPercentage">
                  <Slider
                    min={0}
                    max={100}
                    tooltip={{ formatter: (value: any) => `${value}%` }}
                    trackStyle={{ backgroundColor: '#00c9ff' }}
                    handleStyle={{ borderColor: '#00c9ff' }}
                  />
                </Form.Item>

                <div className="space-y-1">
                  <Typography.Text className="text-white/60">
                    Current: {selectedRack.used}/{selectedRack.capacity} units
                  </Typography.Text>
                  <Typography.Text className="text-white/60">
                    Available: {selectedRack.capacity - selectedRack.used} units
                  </Typography.Text>
                </div>
              </>
            )}

            <Form.Item className="!mt-6 !mb-0">
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isLoading}
                    disabled={!selectedRack}
                    className="text-white transition-all shadow-lg bg-gradient-to-br from-blue-500 to-fuchsia-600 hover:from-blue-600 hover:to-fuchsia-700"
                  >
                    {product ? 'Update Product' : 'Add Product'}
                  </Button>
                </motion.div>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </motion.div>
  );
};