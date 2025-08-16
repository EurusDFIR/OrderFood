import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AdminDashboard.css';

interface DashboardStats {
  users: {
    total: number;
    newToday: number;
    shippers: number;
  };
  orders: {
    total: number;
    today: number;
    pending: number;
    delivering: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    dailyRevenue: number;
  };
  products: {
    total: number;
    active: number;
    topSelling: Array<{
      _id: string;
      totalSold: number;
      revenue: number;
      product: { name: string };
    }>;
  };
}

interface RecentActivities {
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: { name: string };
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  recentActivities: RecentActivities | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      const [statsRes, activitiesRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/dashboard/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok && activitiesRes.ok) {
        const statsData = await statsRes.json();
        const activitiesData = await activitiesRes.json();
        
        setStats(statsData.data);
        setRecentActivities(activitiesData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAutomation = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/orders/automation/run-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Automation completed!\nOrders moved to ready: ${result.data.prepareToReady}\nShippers assigned: ${result.data.assignShippers}`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error running automation:', error);
      alert('Lỗi khi chạy automation');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Truy cập bị từ chối</h2>
          <p>Bạn không có quyền truy cập trang admin.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Trang Quản Trị</h1>
        <div className="admin-actions">
          <button 
            className="automation-btn"
            onClick={runAutomation}
          >
            🤖 Chạy Automation
          </button>
        </div>
      </div>

      <div className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          📦 Quản lý Đơn hàng
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Quản lý Người dùng
        </button>
        <button 
          className={activeTab === 'shippers' ? 'active' : ''}
          onClick={() => setActiveTab('shippers')}
        >
          🚚 Quản lý Shipper
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          🍕 Quản lý Sản phẩm
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <DashboardOverview stats={stats} recentActivities={recentActivities} />
        )}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'shippers' && <ShippersManagement />}
        {activeTab === 'products' && <ProductsManagement />}
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, recentActivities }) => {
  if (!stats) return <div>Không có dữ liệu</div>;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Khách hàng</h3>
            <div className="stat-number">{stats.users?.total || 0}</div>
            <div className="stat-change">+{stats.users?.newToday || 0} hôm nay</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Đơn hàng</h3>
            <div className="stat-number">{stats.orders?.total || 0}</div>
            <div className="stat-change">+{stats.orders?.today || 0} hôm nay</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Doanh thu tháng</h3>
            <div className="stat-number">{formatCurrency(stats.revenue?.monthlyRevenue || 0)}</div>
            <div className="stat-change">{formatCurrency(stats.revenue?.dailyRevenue || 0)} hôm nay</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>Shipper</h3>
            <div className="stat-number">{stats.users?.shippers || 0}</div>
            <div className="stat-change">Đang hoạt động</div>
          </div>
        </div>
      </div>

      {/* Order Status Chart */}
      <div className="dashboard-section">
        <h3>Trạng thái đơn hàng</h3>
        <div className="order-status-grid">
          <div className="status-item">
            <span className="status-label">Chờ xử lý</span>
            <span className="status-count">{stats.orders?.pending || 0}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Đang giao</span>
            <span className="status-count">{stats.orders?.delivering || 0}</span>
          </div>
          {stats.orders?.byStatus?.map((status: any) => (
            <div key={status._id} className="status-item">
              <span className="status-label">{status._id}</span>
              <span className="status-count">{status.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      {recentActivities && (
        <div className="dashboard-section">
          <h3>Hoạt động gần đây</h3>
          <div className="activities-list">
            <div className="activity-group">
              <h4>Đơn hàng mới</h4>
              {recentActivities.recentOrders?.slice(0, 5).map((order: any) => (
                <div key={order._id} className="activity-item">
                  <span className="activity-time">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <span className="activity-content">
                    #{order.orderNumber} - {order.user?.name} - {formatCurrency(order.totalAmount)}
                  </span>
                  <span className={`activity-status status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="activity-group">
              <h4>Người dùng mới</h4>
              {recentActivities.recentUsers?.slice(0, 5).map((user: any) => (
                <div key={user._id} className="activity-item">
                  <span className="activity-time">
                    {new Date(user.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <span className="activity-content">
                    {user.name} - {user.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Products */}
      {stats.products?.topSelling && (
        <div className="dashboard-section">
          <h3>Sản phẩm bán chạy</h3>
          <div className="top-products">
            {stats.products.topSelling.map((item: any, index: number) => (
              <div key={item._id} className="product-item">
                <span className="product-rank">#{index + 1}</span>
                <span className="product-name">{item.product?.name}</span>
                <span className="product-sold">{item.totalSold} đã bán</span>
                <span className="product-revenue">{formatCurrency(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder components for other tabs
const OrdersManagement = () => {
  return (
    <div className="management-section">
      <h2>Quản lý Đơn hàng</h2>
      <p>Tính năng này sẽ được phát triển trong phiên bản tiếp theo.</p>
      <p>Hiện tại bạn có thể sử dụng trang "Đơn hàng Admin" để quản lý đơn hàng.</p>
    </div>
  );
};

const UsersManagement = () => {
  return (
    <div className="management-section">
      <h2>Quản lý Người dùng</h2>
      <p>Tính năng quản lý người dùng đang được phát triển.</p>
    </div>
  );
};

const ShippersManagement = () => {
  return (
    <div className="management-section">
      <h2>Quản lý Shipper</h2>
      <p>Tính năng quản lý shipper đang được phát triển.</p>
    </div>
  );
};

const ProductsManagement = () => {
  return (
    <div className="management-section">
      <h2>Quản lý Sản phẩm</h2>
      <p>Tính năng quản lý sản phẩm đang được phát triển.</p>
    </div>
  );
};

export default AdminDashboard;
