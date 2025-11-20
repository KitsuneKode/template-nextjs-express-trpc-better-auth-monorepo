// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prisma } from '../'

// prisma
//   .$connect()
//   .then(() => {
//     console.log('Connected to database')
//   })
//   .catch((e) => {
//     console.error(e)
//   })
//   .finally(() => {
//     prisma.$disconnect()
//   })

// prisma.user
//   .createMany({
//     data: [
//       {
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         // password_hash: 'password_hash',
//         emailVerified: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Jane Doe',
//         email: 'jane.doe@example.com',
//         password_hash: 'password_hash',
//         emailVerified: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ],
//   })
//   .then(() => {
//     console.log('Seeding completed')
//   })
//   .catch((e) => {
//     console.error(e)
//   })
// //   .finally(() => {
// //     prisma.$disconnect()
// //   })
