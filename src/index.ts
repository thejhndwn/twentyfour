import 'dotenv-expand/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { problems } from './db/schema';
import { promises as fs } from 'fs';

const filePath = './nsolutions5.txt';
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const fileContent = await fs.readFile(filePath, 'utf8');
  const rows = fileContent.split('\n');

  for (const row of rows) {
    // Skip empty lines
    if (row.trim() === '') continue;

    const user: typeof problems.$inferInsert = {
      id: row,
      nums: [],
      solution: [],
    };

    try {
      // Attempt to insert, catch duplicate key error
      await db.insert(problems).values(user);
    } catch (error) {
      if (error.code === '23505') { // Duplicate key error code
        console.log(`Duplicate key found: ${row}`);
      } else {
        // Re-throw other errors
        throw error;
      }
    }
  }
}

main();

// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { eq } from 'drizzle-orm';
// import { usersTable } from './db/schema';
  
// const db = drizzle(process.env.DATABASE_URL!);

// async function main() {
//   const user: typeof usersTable.$inferInsert = {
//     name: 'John',
//     age: 30,
//     email: 'john@example.com',
//   };

//   await db.insert(usersTable).values(user);
//   console.log('New user created!')

//   const users = await db.select().from(usersTable);
//   console.log('Getting all users from the database: ', users)
//   /*
//   const users: {
//     id: number;
//     name: string;
//     age: number;
//     email: string;
//   }[]
//   */

//   await db
//     .update(usersTable)
//     .set({
//       age: 31,
//     })
//     .where(eq(usersTable.email, user.email));
//   console.log('User info updated!')

//   await db.delete(usersTable).where(eq(usersTable.email, user.email));
//   console.log('User deleted!')
// }

// main();