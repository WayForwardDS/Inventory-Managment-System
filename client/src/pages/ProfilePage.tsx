import { EditFilled, EditOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
import userProPic from '../assets/User.png';
import Loader from '../components/Loader';
import { useGetSelfProfileQuery } from '../redux/features/authApi';
import { profileKeys } from '../constant/profile';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { data, isLoading } = useGetSelfProfileQuery(undefined);

  if (isLoading) return <Loader />;

  return (
    <div className="relative min-h-screen p-6 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute bg-blue-500 rounded-full w-80 h-80 opacity-40 blur-3xl top-10 left-20 animate-pulse"></div>
      <div className="absolute bg-purple-500 rounded-full w-72 h-72 opacity-40 blur-3xl bottom-10 right-20 animate-bounce"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl p-10 mx-auto bg-white border shadow-2xl bg-opacity-10 backdrop-blur-lg border-white/20 rounded-3xl"
      >
        <Flex vertical style={{ minHeight: 'calc(100vh - 10rem)' }}>
          {/* Profile Picture */}
          <Flex justify="center" style={{ width: '100%' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: '250px',
                height: '250px',
                border: '2px solid gray',
                padding: '.5rem',
                borderRadius: '50%',
              }}
            >
              <img
                src={data?.data?.avatar || userProPic}
                alt="user"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </motion.div>
          </Flex>

          {/* Edit Buttons */}
          <Flex justify="center" style={{ margin: '1rem' }}>
            <Flex gap={16} wrap="wrap" justify="center">
              <Link to="/edit-profile">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="primary"
                    className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
                  >
                    <EditOutlined />
                    Edit Profile
                  </Button>
                </motion.div>
              </Link>
              <Link to="/change-password">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="primary"
                    className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
                  >
                    <EditFilled />
                    Change Password
                  </Button>
                </motion.div>
              </Link>
            </Flex>
          </Flex>

          {/* Profile Information */}
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 4 }}></Col>
            <Col
              xs={{ span: 24 }}
              lg={{ span: 16 }}
              style={{
                maxWidth: '700px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem 2rem',
                borderRadius: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {profileKeys.map((key) => (
                <motion.div
                  key={key.keyName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * profileKeys.indexOf(key) }}
                >
                  <ProfileInfoItems keyName={key.keyName} value={data?.data[key.keyName]} />
                </motion.div>
              ))}
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 4 }}></Col>
          </Row>
        </Flex>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

const ProfileInfoItems = ({ keyName, value }: { keyName: string; value: string }) => {
  return (
    <Flex style={{ width: '100%', marginBottom: '1rem' }} gap={24}>
      <h2 style={{ flex: 1, fontWeight: '700', textTransform: 'capitalize', color: 'white' }}>
        {keyName}
      </h2>
      <h3 style={{ flex: 4, fontWeight: '500', color: 'white' }}>{value}</h3>
    </Flex>
  );
};