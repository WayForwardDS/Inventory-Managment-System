import { Col, Row } from 'antd';
import Loader from '../components/Loader';
import { useCountProductsQuery } from '../redux/features/management/productApi';
import { useYearlySaleQuery } from '../redux/features/management/saleApi';
import DailyChart from '../components/Charts/DailyChart';

const Dashboard = () => {
  const { data: products, isLoading } = useCountProductsQuery(undefined);
  const { data: yearlyData, isLoading: isLoading1 } = useYearlySaleQuery(undefined);

  if (isLoading && isLoading1) return <Loader />;
  else
    return (
      <>
        <Row style={{ paddingRight: '1rem' }}>
          <Col xs={{ span: 24 }} lg={{ span: 6 }} style={{ padding: '.5rem' }}>
            <div className='number-card'>
              <h3 style={{fontFamily:'sans-serif', color:'white'}}>Total Orders</h3>
              <h1 style={{fontFamily:'sans-serif',color:'red'}}>{products?.data?.totalQuantity || 0}</h1>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 6 }} style={{ padding: '.5rem' }}>
            <div className='number-card'>
              <h3 style={{fontFamily:'sans-serif', color:'white'}}>Total Completed Orders </h3>
              <h1 style={{fontFamily:'sans-serif',color:'red'}}>
                {yearlyData?.data.reduce(
                  (acc: number, cur: { totalQuantity: number }) => (acc += cur.totalQuantity),
                  0
                )}
              </h1>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 6 }} style={{ padding: '.5rem' }}>
            <div className='number-card'>
              <h3 style={{fontFamily:'sans-serif', color:'white'}}>Total Pending Orders </h3>
              <h1 style={{fontFamily:'sans-serif',color:'red'}}>
                {yearlyData?.data.reduce(
                  (acc: number, cur: { totalQuantity: number }) => (acc += cur.totalQuantity),
                  0
                )}
              </h1>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 6 }} style={{ padding: '.5rem' }}>
            <div className='number-card'>
              <h3 style={{fontFamily:'sans-serif', color:'white'}}>Total Revenue</h3>
              <h1 style={{fontFamily:'sans-serif',color:'#00AEEE'}}>
                $
                {yearlyData?.data.reduce(
                  (acc: number, cur: { totalRevenue: number }) => (acc += cur.totalRevenue),
                  0
                )}
              </h1>
            </div>
          </Col>
        </Row>
        <div
          style={{
            border: '1px solid gray',
            margin: '1rem',
            padding: '1rem',
            borderRadius: '10px',
          }}
        >
          <h1 style={{ textAlign: 'center', marginBottom: '.5rem',fontFamily:'sans-serif', color:'#00AEEE' }}>Daily Sale and Revenue</h1>
          <DailyChart />
        </div>
       
      </>
    );
};

export default Dashboard;



