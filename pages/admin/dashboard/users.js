import Layout from "@/components/admin/layout"
import UserTable from "@/components/admin/users/table"
import User from "@/models/User"
import db from "@/utils/db"

export default function users({users}) {
  console.log(users)
  return (
    <Layout>
      <UserTable rows={users} />
    </Layout>
  )
}


export  async function getServerSideProps(ctx) {
  await db.connectDb();
  const users = await User.find({}).sort({createdAt: -1}).lean()
return {
  props: {
    users: JSON.parse(JSON.stringify(users))
  }
}
}