import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiShoppingCart,
  FiPackage,
  FiCalendar,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data
  const statsCards = [
    {
      id: 1,
      title: 'Tổng doanh thu',
      value: '1.234.567.000',
      unit: '₫',
      change: 12.5,
      isPositive: true,
      icon: FiDollarSign,
      color: 'success',
      description: 'So với tháng trước'
    },
    {
      id: 2,
      title: 'Đơn hàng mới',
      value: '1,247',
      unit: '',
      change: 8.2,
      isPositive: true,
      icon: FiShoppingCart,
      color: 'primary',
      description: 'Trong 7 ngày qua'
    },
    {
      id: 3,
      title: 'Khách hàng',
      value: '12,847',
      unit: '',
      change: -2.1,
      isPositive: false,
      icon: FiUsers,
      color: 'warning',
      description: 'Người dùng hoạt động'
    },
    {
      id: 4,
      title: 'Sản phẩm',
      value: '847',
      unit: '',
      change: 15.3,
      isPositive: true,
      icon: FiPackage,
      color: 'info',
      description: 'Sản phẩm có sẵn'
    }
  ];

  const revenueData = [
    { name: 'T1', revenue: 4000, orders: 240, customers: 400 },
    { name: 'T2', revenue: 3000, orders: 139, customers: 221 },
    { name: 'T3', revenue: 2000, orders: 980, customers: 229 },
    { name: 'T4', revenue: 2780, orders: 390, customers: 200 },
    { name: 'T5', revenue: 1890, orders: 480, customers: 218 },
    { name: 'T6', revenue: 2390, orders: 380, customers: 250 },
    { name: 'T7', revenue: 3490, orders: 430, customers: 210 },
    { name: 'T8', revenue: 4000, orders: 240, customers: 400 },
    { name: 'T9', revenue: 3000, orders: 139, customers: 221 },
    { name: 'T10', revenue: 5000, orders: 980, customers: 229 },
    { name: 'T11', revenue: 4500, orders: 390, customers: 200 },
    { name: 'T12', revenue: 6000, orders: 480, customers: 300 }
  ];

  const categoryData = [
    { name: 'Điện thoại', value: 35, color: '#667eea' },
    { name: 'Laptop', value: 25, color: '#764ba2' },
    { name: 'Phụ kiện', value: 20, color: '#f093fb' },
    { name: 'Tablet', value: 15, color: '#4facfe' },
    { name: 'Khác', value: 5, color: '#43e97b' }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      image: 'https://via.placeholder.com/60x60/667eea/ffffff?text=IP15',
      sales: 1234,
      revenue: '1.234.567.000',
      trend: 12.5
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      image: 'https://via.placeholder.com/60x60/764ba2/ffffff?text=MBP',
      sales: 856,
      revenue: '856.789.000',
      trend: 8.3
    },
    {
      id: 3,
      name: 'AirPods Pro',
      image: 'https://via.placeholder.com/60x60/f093fb/ffffff?text=APP',
      sales: 2341,
      revenue: '468.200.000',
      trend: -2.1
    },
    {
      id: 4,
      name: 'iPad Air',
      image: 'https://via.placeholder.com/60x60/4facfe/ffffff?text=IPA',
      sales: 743,
      revenue: '371.500.000',
      trend: 15.7
    }
  ];

  const recentOrders = [
    {
      id: '#12847',
      customer: 'Nguyễn Văn A',
      product: 'iPhone 15 Pro',
      amount: '29.990.000',
      status: 'completed',
      time: '2 phút trước'
    },
    {
      id: '#12846',
      customer: 'Trần Thị B',
      product: 'MacBook Air',
      amount: '24.990.000',
      status: 'processing',
      time: '5 phút trước'
    },
    {
      id: '#12845',
      customer: 'Lê Văn C',
      product: 'AirPods Pro',
      amount: '5.990.000',
      status: 'pending',
      time: '10 phút trước'
    },
    {
      id: '#12844',
      customer: 'Phạm Thị D',
      product: 'iPad Pro',
      amount: '19.990.000',
      status: 'completed',
      time: '15 phút trước'
    }
  ];

  const activityData = [
    { hour: '00:00', visitors: 120 },
    { hour: '04:00', visitors: 80 },
    { hour: '08:00', visitors: 250 },
    { hour: '12:00', visitors: 400 },
    { hour: '16:00', visitors: 350 },
    { hour: '20:00', visitors: 200 }
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { text: 'Hoàn thành', class: 'success' },
      processing: { text: 'Đang xử lý', class: 'warning' },
      pending: { text: 'Chờ xử lý', class: 'info' },
      cancelled: { text: 'Đã hủy', class: 'danger' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`${styles.statusBadge} ${styles[config.class]}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <p className={styles.dashboardSubtitle}>
            Tổng quan hoạt động kinh doanh của bạn
          </p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.timeRangeSelector}>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.timeSelect}
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
            </select>
          </div>
          
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? styles.spinning : ''} />
            Làm mới
          </button>
          
          <div className={styles.lastUpdated}>
            <FiClock />
            <span>Cập nhật lúc {lastUpdated.toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {statsCards.map((card) => (
          <div key={card.id} className={`${styles.statsCard} ${styles[card.color]}`}>
            <div className={styles.statsCardHeader}>
              <div className={styles.statsIcon}>
                <card.icon />
              </div>
              <div className={styles.statsMenu}>
                <FiMoreVertical />
              </div>
            </div>
            
            <div className={styles.statsCardBody}>
              <h3 className={styles.statsValue}>
                {card.value}
                <span className={styles.statsUnit}>{card.unit}</span>
              </h3>
              <p className={styles.statsTitle}>{card.title}</p>
            </div>
            
            <div className={styles.statsCardFooter}>
              <div className={`${styles.statsChange} ${card.isPositive ? styles.positive : styles.negative}`}>
                {card.isPositive ? <FiArrowUp /> : <FiArrowDown />}
                <span>{Math.abs(card.change)}%</span>
              </div>
              <span className={styles.statsDescription}>{card.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Doanh thu theo tháng</h3>
              <p className={styles.chartSubtitle}>Biểu đồ doanh thu 12 tháng gần nhất</p>
            </div>
            <div className={styles.chartActions}>
              <button className={styles.chartAction}>
                <FiDownload />
              </button>
              <button className={styles.chartAction}>
                <FiFilter />
              </button>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Phân bố danh mục</h3>
              <p className={styles.chartSubtitle}>Tỷ lệ bán hàng theo danh mục</p>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className={styles.contentRow}>
        {/* Top Products */}
        <div className={styles.contentCard}>
          <div className={styles.contentHeader}>
            <h3 className={styles.contentTitle}>
              <FiTrendingUp className={styles.contentIcon} />
              Sản phẩm bán chạy
            </h3>
            <button className={styles.viewAllButton}>Xem tất cả</button>
          </div>
          
          <div className={styles.productsList}>
            {topProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <h4 className={styles.productName}>{product.name}</h4>
                    <p className={styles.productSales}>
                      {formatNumber(product.sales)} đã bán
                    </p>
                  </div>
                </div>
                
                <div className={styles.productRevenue}>
                  <span className={styles.revenueAmount}>{product.revenue}₫</span>
                  <div className={`${styles.trendIndicator} ${product.trend > 0 ? styles.positive : styles.negative}`}>
                    {product.trend > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    {Math.abs(product.trend)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.contentCard}>
          <div className={styles.contentHeader}>
            <h3 className={styles.contentTitle}>
              <FiShoppingBag className={styles.contentIcon} />
              Đơn hàng gần đây
            </h3>
            <button className={styles.viewAllButton}>Xem tất cả</button>
          </div>
          
          <div className={styles.ordersList}>
            {recentOrders.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderInfo}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>{order.id}</span>
                    <span className={styles.orderTime}>{order.time}</span>
                  </div>
                  <p className={styles.orderCustomer}>{order.customer}</p>
                  <p className={styles.orderProduct}>{order.product}</p>
                </div>
                
                <div className={styles.orderDetails}>
                  <span className={styles.orderAmount}>{order.amount}₫</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className={styles.activityCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Hoạt động trong ngày</h3>
            <p className={styles.chartSubtitle}>Số lượng khách truy cập theo giờ</p>
          </div>
        </div>
        
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="visitors" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;