import Layout from '@/components/admin/layout'
import OrdersTable from '@/components/admin/orders/table'
import Order from '@/models/Order'
import User from '@/models/User'
import db from '@/utils/db'

export default function orders({orders}) {
  return (
    <Layout>
      <OrdersTable rows={orders} />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
    await db.connectDb()
    const orders = await Order.find({}).populate({path: 'user', model: User, select: "name email image"}).sort({createdAt: -1}).lean();
    db.disconnectDb()
    return {
        props: {
            orders: JSON.parse(JSON.stringify(orders))
        }
    }
}