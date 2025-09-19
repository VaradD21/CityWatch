const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });
    
    console.log('Users in database:', users.length);
    console.log('\nUser details:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.isVerified}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('You need to create a user first.');
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();