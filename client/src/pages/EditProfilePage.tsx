import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
import userProPic from '../assets/User.png';
import CustomInput from '../components/CustomInput';
import { useForm } from 'react-hook-form';
import { profileInputFields } from '../constant/profile';
import { useGetSelfProfileQuery, useUpdateProfileMutation } from '../redux/features/authApi';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/config';
import { useState } from 'react';

const EditProfilePage = () => {
  const { data, isLoading, refetch } = useGetSelfProfileQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, GIF or WEBP files are allowed');
      return;
    }
  
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }
  
    const toastId = toast.loading('Uploading image...');
    setIsUploading(true);
  
    try {
      if (!config.VITE_CLOUDINARY_CLOUD_NAME || !config.VITE_CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
      }
    
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', config.VITE_CLOUDINARY_CLOUD_NAME);
      formData.append('folder', 'inventory');
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      // Get the full response for debugging
      const responseText = await response.text();
  
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
  
      const result = JSON.parse(responseText);
      
      if (!result.secure_url) {
        throw new Error('No secure URL returned from Cloudinary');
      }
  
      const updateResponse = await updateProfile({ avatar: result.secure_url }).unwrap();
      
      if (!updateResponse.success) {
        throw new Error(updateResponse.message || 'Profile update failed');
      }
  
      toast.success('Profile image updated successfully', { id: toastId });
      refetch();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
      
      // Additional debug information
      if (error.message.includes('Upload preset')) {
        toast.info('Please verify your Cloudinary upload preset is properly configured');
      }
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
  <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <Flex align="center" vertical style={{ margin: '1rem 0' }}>
          <Flex
            justify="center"
            style={{
              width: '250px',
              height: '250px',
              border: '2px solid gray',
              padding: '.5rem',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            {isUploading && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1
              }}>
                <Loader size="small" />
              </div>
            )}
            <img
              src={data?.data?.avatar || userProPic}
              alt="user"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '50%',
                opacity: isUploading ? 0.7 : 1
              }}
            />
          </Flex>
          <Flex style={{ padding: '1rem' }}>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/jpeg, image/png, image/gif, image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label
              htmlFor="avatar"
              style={{
                background: isUploading ? '#999' : '#164863',
                color: '#fff',
                padding: '.5rem 1rem',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
            >
              <UploadOutlined />
              {isUploading ? 'Uploading...' : 'Change Profile Picture'}
            </label>
          </Flex>
        </Flex>
      </Col>
      <Col xs={24} lg={16}>
        <Flex justify="end" style={{ margin: '1rem 0' }}>
          <Button type="default" onClick={() => navigate('/profile')}>
            <ArrowLeftOutlined /> Go Back
          </Button>
        </Flex>
        <EditProfileForm data={data?.data} />
      </Col>
    </Row>
  );
};

const EditProfileForm = ({ data }: { data: any }) => {
  const navigate = useNavigate();
  const [updateProfile] = useUpdateProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: data });

  const onSubmit = async (formData: any) => {
    const payload = { ...formData };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.avatar; 

    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] == null) {
        delete payload[key];
      }
    });

    const toastId = toast.loading('Updating profile...');
    try {
      const res = await updateProfile(payload).unwrap();

      if (res.success) {
        toast.success('Profile updated successfully', { id: toastId });
        navigate('/profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile', { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {profileInputFields.map((input) => (
        <CustomInput
          key={input.id}
          name={input.name}
          errors={errors}
          label={input.label}
          register={register}
          required={false}
          disabled={isSubmitting}
        />
      ))}

      <Flex justify="end" style={{ marginTop: '1rem' }}>
        <Button
          htmlType="submit"
          type="primary"
          loading={isSubmitting}
          style={{ 
            textTransform: 'uppercase', 
            fontWeight: 'bold',
            padding: '0 2rem',
            height: '40px'
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </Flex>
    </form>
  );
};

export default EditProfilePage;