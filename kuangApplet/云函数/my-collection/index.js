// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'lingshi-user-7gkobalb5f401248'
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
     try {

      let res = await db.collection('collect_goods').aggregate()
          .lookup({
            from: 'goods',
            localField: 'goods_id',
            foreignField: '_id',
            as: 'result',
          })
          .limit(10)
          .skip(event.skip)
          .end()
         
      let coll = res.list.map(item=>item.result).flat()
      console.log(coll)
      return coll
      } catch (error) {
          console.log(error)
      }
      
}