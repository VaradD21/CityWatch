const prisma = require('../services/database');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    console.log('🏙️ Adding realistic data to existing database...');
    
    // Get existing cities or create new ones
    let cities = await prisma.city.findMany();
    
    if (cities.length === 0) {
      console.log('Creating cities...');
      const cityData = [
        {
          name: 'Mumbai',
          slug: 'mumbai',
          latitude: 19.0760,
          longitude: 72.8777,
          state: 'Maharashtra',
          country: 'India'
        },
        {
          name: 'Nanded',
          slug: 'nanded',
          latitude: 19.1539,
          longitude: 77.3156,
          state: 'Maharashtra',
          country: 'India'
        },
        {
          name: 'Nagpur',
          slug: 'nagpur',
          latitude: 21.1458,
          longitude: 79.0882,
          state: 'Maharashtra',
          country: 'India'
        },
        {
          name: 'Pune',
          slug: 'pune',
          latitude: 18.5204,
          longitude: 73.8567,
          state: 'Maharashtra',
          country: 'India'
        },
        {
          name: 'Nashik',
          slug: 'nashik',
          latitude: 19.9975,
          longitude: 73.7898,
          state: 'Maharashtra',
          country: 'India'
        }
      ];
      
      for (const city of cityData) {
        const createdCity = await prisma.city.create({
          data: city
        });
        cities.push(createdCity);
        console.log(`✅ Created city: ${createdCity.name}`);
      }
    } else {
      console.log(`✅ Found ${cities.length} existing cities`);
    }
    
    // Get existing users
    let users = await prisma.user.findMany();
    console.log(`✅ Found ${users.length} existing users`);
    
    // Create more users if we have less than 50
    if (users.length < 50) {
      console.log('Creating additional users...');
      const userNames = [
        'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Singh', 'Vikram Joshi',
        'Anita Desai', 'Rohit Gupta', 'Kavita Reddy', 'Suresh Iyer', 'Meera Nair',
        'Arjun Malhotra', 'Deepa Agarwal', 'Manoj Tiwari', 'Sunita Verma', 'Kiran Rao',
        'Pradeep Jain', 'Rekha Mehta', 'Sanjay Shah', 'Lata Pandey', 'Vijay Kumar',
        'Geeta Singh', 'Ramesh Yadav', 'Usha Agarwal', 'Nitin Sharma', 'Sarita Gupta',
        'Ashok Patel', 'Kamala Reddy', 'Suresh Kumar', 'Indira Iyer', 'Ravi Nair'
      ];
      
      const roles = ['citizen', 'authority'];
      let userIndex = 0;
      
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        
        // Create 5-8 users per city
        const userCount = Math.floor(Math.random() * 4) + 5;
        
        for (let j = 0; j < userCount; j++) {
          const role = roles[Math.floor(Math.random() * roles.length)];
          const password = await bcrypt.hash('password123', 10);
          const username = userNames[userIndex % userNames.length].toLowerCase().replace(' ', '_') + '_' + city.slug + '_' + (j + 1);
          const email = `${userNames[userIndex % userNames.length].toLowerCase().replace(' ', '.')}@${city.slug}.com`;
          
          try {
            const user = await prisma.user.create({
              data: {
                username: username,
                email: email,
                password: password,
                role: role,
                cityId: city.id,
                bio: `${role === 'citizen' ? 'Resident' : 'Authority Officer'} of ${city.name}`
              }
            });
            users.push(user);
            console.log(`✅ Created ${role} user for ${city.name}: ${username}`);
          } catch (error) {
            if (error.code === 'P2002') {
              console.log(`⚠️ User ${username} already exists, skipping...`);
            } else {
              console.error(`❌ Error creating user ${username}:`, error.message);
            }
          }
          
          userIndex++;
        }
      }
    }
    
    // Create realistic reports
    console.log('📝 Creating realistic reports...');
    const existingReports = await prisma.report.count();
    
    if (existingReports < 100) {
      const reportCategories = [
        'Infrastructure', 'Traffic', 'Water Supply', 'Electricity', 'Waste Management',
        'Road Maintenance', 'Public Safety', 'Healthcare', 'Education', 'Environment'
      ];
      
      const reportTitles = [
        'Broken Street Light on Main Road',
        'Pothole Near Bus Stop',
        'Water Leakage in Residential Area',
        'Garbage Not Collected for 3 Days',
        'Damaged Footpath',
        'Traffic Signal Not Working',
        'Sewage Overflow',
        'Broken Bench in Park',
        'Street Dog Menace',
        'Illegal Parking Issue',
        'Noise Pollution from Construction',
        'Missing Manhole Cover',
        'Overgrown Trees Blocking Road',
        'Public Toilet Not Clean',
        'Broken Fence Around School'
      ];
      
      const reportDescriptions = [
        'This issue has been affecting the local residents for several days. The street light has been broken for over a week now, making it unsafe for pedestrians and vehicles at night.',
        'There is a large pothole near the bus stop that has been getting bigger with each rain. It is causing damage to vehicles and is dangerous for two-wheelers.',
        'Water is continuously leaking from the main pipeline, causing water wastage and creating a muddy area around the leak.',
        'The garbage collection has been irregular in our area. The bins are overflowing and creating unhygienic conditions.',
        'The footpath is damaged and has uneven surfaces, making it difficult for elderly people and those with mobility issues to walk safely.',
        'The traffic signal at the main intersection has been malfunctioning for the past few days, causing traffic congestion and safety concerns.',
        'Sewage water is overflowing onto the main road, creating a health hazard and unpleasant smell in the area.',
        'One of the benches in the local park is broken and needs immediate repair for the safety of park visitors.',
        'There are several stray dogs in the area that are becoming aggressive and posing a threat to children and elderly residents.',
        'Vehicles are being parked illegally on the main road, blocking traffic and causing inconvenience to residents.'
      ];
      
      const statuses = ['open', 'in_progress', 'resolved'];
      const statusWeights = [0.4, 0.3, 0.3]; // 40% open, 30% in_progress, 30% resolved
      
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const cityUsers = users.filter(u => u.cityId === city.id && u.role === 'citizen');
        
        if (cityUsers.length === 0) continue;
        
        // Create 15-25 reports per city
        const reportCount = Math.floor(Math.random() * 11) + 15;
        
        for (let j = 0; j < reportCount; j++) {
          const randomUser = cityUsers[Math.floor(Math.random() * cityUsers.length)];
          const randomCategory = reportCategories[Math.floor(Math.random() * reportCategories.length)];
          const randomTitle = reportTitles[Math.floor(Math.random() * reportTitles.length)];
          const randomDescription = reportDescriptions[Math.floor(Math.random() * reportDescriptions.length)];
          
          // Weighted random status selection
          const rand = Math.random();
          let status = 'open';
          if (rand > 0.7) status = 'resolved';
          else if (rand > 0.4) status = 'in_progress';
          
          const createdAt = new Date(Date.now() - Math.random() * (180 * 24 * 60 * 60 * 1000)); // Last 6 months
          
          try {
            const report = await prisma.report.create({
              data: {
                title: randomTitle,
                description: randomDescription,
                category: randomCategory,
                status: status,
                priority: Math.floor(Math.random() * 5) + 1, // 1-5 priority
                location: `${city.name} Area ${j + 1}`,
                latitude: city.latitude + (Math.random() - 0.5) * 0.1,
                longitude: city.longitude + (Math.random() - 0.5) * 0.1,
                userId: randomUser.id,
                cityId: city.id,
                createdAt: createdAt,
                updatedAt: createdAt
              }
            });
            
            console.log(`✅ Created report for ${city.name}: ${randomTitle} (${status})`);
            
            // Add 2-5 comments to each report
            const commentCount = Math.floor(Math.random() * 4) + 2;
            const commentTexts = [
              'Thanks for reporting this issue. I have also noticed this problem.',
              'This has been an ongoing issue in our area. Hope it gets resolved soon.',
              'I can confirm this issue. It has been affecting our daily commute.',
              'Good catch! This needs immediate attention from the authorities.',
              'I have been facing the same problem. Thanks for bringing it to notice.',
              'This is a serious issue that needs to be addressed urgently.',
              'I agree with this report. The situation is getting worse day by day.',
              'Hope the authorities take action on this soon.',
              'This is a common problem in our locality. Thanks for reporting.',
              'I have also experienced this issue. It needs immediate attention.'
            ];
            
            for (let k = 0; k < commentCount; k++) {
              const randomCommenter = cityUsers[Math.floor(Math.random() * cityUsers.length)];
              const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)];
              const commentDate = new Date(report.createdAt.getTime() + Math.random() * (Date.now() - report.createdAt.getTime()));
              
              try {
                await prisma.comment.create({
                  data: {
                    content: randomComment,
                    userId: randomCommenter.id,
                    reportId: report.id,
                    createdAt: commentDate
                  }
                });
              } catch (error) {
                // Skip if comment creation fails
              }
            }
            
          } catch (error) {
            console.error(`❌ Error creating report:`, error.message);
          }
        }
      }
    }
    
    // Create alerts
    console.log('🔔 Creating alerts...');
    const existingAlerts = await prisma.alert.count();
    
    if (existingAlerts < 20) {
      const alertTitles = [
        'Heavy Rain Warning',
        'Traffic Diversion Notice',
        'Water Supply Interruption',
        'Power Outage Scheduled',
        'Road Closure for Maintenance',
        'Health Advisory',
        'Festival Traffic Alert',
        'Construction Work Notice',
        'Emergency Services Update',
        'Public Transport Changes'
      ];
      
      const alertDescriptions = [
        'Heavy rainfall is expected in the next 24 hours. Please avoid unnecessary travel and stay indoors.',
        'Traffic will be diverted on MG Road due to construction work. Please use alternative routes.',
        'Water supply will be interrupted in Sector 5 from 9 AM to 3 PM for pipeline maintenance.',
        'Scheduled power outage in the area from 10 AM to 2 PM for transformer maintenance.',
        'Main Road will be closed for 2 days for resurfacing work. Please use alternative routes.',
        'Health advisory: Increase in dengue cases reported. Please take necessary precautions.',
        'Festival traffic alert: Heavy traffic expected in city center. Plan your travel accordingly.',
        'Construction work will begin on Monday. Expect noise and dust in the area.',
        'Emergency services are fully operational. Contact helpline numbers for assistance.',
        'Bus routes 15 and 23 have been temporarily changed. Check updated schedules.'
      ];
      
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const alertCount = Math.floor(Math.random() * 3) + 2; // 2-4 alerts per city
        
        for (let j = 0; j < alertCount; j++) {
          const randomTitle = alertTitles[Math.floor(Math.random() * alertTitles.length)];
          const randomDescription = alertDescriptions[Math.floor(Math.random() * alertDescriptions.length)];
          const createdAt = new Date(Date.now() - Math.random() * (30 * 24 * 60 * 60 * 1000)); // Last 30 days
          
          try {
            await prisma.alert.create({
              data: {
                title: randomTitle,
                description: randomDescription,
                priority: Math.floor(Math.random() * 3) + 1, // 1-3 priority
                cityId: city.id,
                createdAt: createdAt
              }
            });
            
            console.log(`✅ Created alert for ${city.name}: ${randomTitle}`);
          } catch (error) {
            console.error(`❌ Error creating alert:`, error.message);
          }
        }
      }
    }
    
    // Create events
    console.log('🎉 Creating events...');
    const existingEvents = await prisma.event.count();
    
    if (existingEvents < 15) {
      const eventTitles = [
        'Clean City Drive',
        'Health Camp',
        'Traffic Awareness Program',
        'Tree Plantation Drive',
        'Blood Donation Camp',
        'Digital Literacy Workshop',
        'Women Safety Awareness',
        'Senior Citizen Meet',
        'Youth Sports Tournament',
        'Cultural Festival'
      ];
      
      const eventDescriptions = [
        'Join us for a city-wide cleanliness drive. Volunteers needed for cleaning public spaces.',
        'Free health checkup camp for all residents. Blood pressure, diabetes, and general health screening available.',
        'Traffic awareness program for school children and drivers. Learn about road safety rules.',
        'Tree plantation drive to increase green cover in the city. Saplings will be provided.',
        'Blood donation camp organized by Red Cross. Your contribution can save lives.',
        'Digital literacy workshop for senior citizens. Learn basic computer and smartphone usage.',
        'Women safety awareness program with self-defense training and safety tips.',
        'Monthly meet for senior citizens with health talks and social activities.',
        'Annual youth sports tournament with various games and competitions.',
        'Cultural festival showcasing local talent and traditional arts.'
      ];
      
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const eventCount = Math.floor(Math.random() * 3) + 2; // 2-4 events per city
        
        for (let j = 0; j < eventCount; j++) {
          const randomTitle = eventTitles[Math.floor(Math.random() * eventTitles.length)];
          const randomDescription = eventDescriptions[Math.floor(Math.random() * eventDescriptions.length)];
          const eventDate = new Date(Date.now() + Math.random() * (30 * 24 * 60 * 60 * 1000)); // Next 30 days
          const createdAt = new Date(Date.now() - Math.random() * (7 * 24 * 60 * 60 * 1000)); // Last 7 days
          
          try {
            await prisma.event.create({
              data: {
                title: randomTitle,
                description: randomDescription,
                eventDate: eventDate,
                location: `${city.name} Community Center`,
                cityId: city.id,
                createdAt: createdAt
              }
            });
            
            console.log(`✅ Created event for ${city.name}: ${randomTitle}`);
          } catch (error) {
            console.error(`❌ Error creating event:`, error.message);
          }
        }
      }
    }
    
    console.log('\n🎉 Realistic data addition completed successfully!');
    console.log('\n📊 Final Summary:');
    console.log(`🏙️ Cities: ${await prisma.city.count()}`);
    console.log(`👥 Users: ${await prisma.user.count()}`);
    console.log(`📝 Reports: ${await prisma.report.count()}`);
    console.log(`💬 Comments: ${await prisma.comment.count()}`);
    console.log(`🔔 Alerts: ${await prisma.alert.count()}`);
    console.log(`🎉 Events: ${await prisma.event.count()}`);
    console.log(`🔔 Notifications: ${await prisma.notification.count()}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@citywatch.com / admin123');
    console.log('Authority: authority_[city]_1@citywatch.com / authority123');
    console.log('Citizens: [name]@[city].com / password123');
    
  } catch (error) {
    console.error('❌ Error adding realistic data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
