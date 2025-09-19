const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // First, let's check if we have any cities
    const cities = await prisma.city.findMany();
    console.log('Available cities:', cities.length);
    
    if (cities.length === 0) {
      console.log('❌ No cities found! Creating a test city first...');
      
      const testCity = await prisma.city.create({
        data: {
          name: 'Test City',
          slug: 'test-city',
        }
      });
      
      console.log('✅ Created test city:', testCity.name);
    }
    
    // Get the first city (or the one we just created)
    const city = await prisma.city.findFirst();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create test users
    const testUsers = [
      {
        email: 'admin@test.com',
        password: hashedPassword,
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
        cityId: city.id,
        agreedTos: true,
      },
      {
        email: 'citizen@test.com',
        password: hashedPassword,
        username: 'citizen',
        firstName: 'John',
        lastName: 'Doe',
        role: 'citizen',
        isVerified: true,
        cityId: city.id,
        agreedTos: true,
      },
      {
        email: 'authority@test.com',
        password: hashedPassword,
        username: 'authority',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'authority',
        isVerified: true,
        cityId: city.id,
        agreedTos: true,
      }
    ];
    
    console.log('\nCreating test users...');
    
    for (const userData of testUsers) {
      try {
        const user = await prisma.user.create({
          data: userData
        });
        console.log(`✅ Created ${user.role}: ${user.email}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  User ${userData.email} already exists`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Test users created successfully!');
    console.log('\nYou can now login with:');
    console.log('Admin: admin@test.com / password123');
    console.log('Citizen: citizen@test.com / password123');
    console.log('Authority: authority@test.com / password123');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
