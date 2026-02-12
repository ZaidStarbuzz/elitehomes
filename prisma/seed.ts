import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Super Admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@elitehomes.com" },
    update: {},
    create: {
      supabaseId: "seed_super_admin_001",
      email: "admin@elitehomes.com",
      name: "Super Admin",
      phone: "+91-9876543210",
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });
  console.log("✅ Super admin created:", superAdmin.email);

  // Create Hostel Admin
  const hostelAdmin = await prisma.user.upsert({
    where: { email: "owner@elitehomes.com" },
    update: {},
    create: {
      supabaseId: "seed_hostel_admin_001",
      email: "owner@elitehomes.com",
      name: "Zaid Ahmad",
      phone: "+91-9876543211",
      role: "HOSTEL_ADMIN",
      isVerified: true,
    },
  });
  console.log("✅ Hostel admin created:", hostelAdmin.email);

  // Create Guest users
  const guest1 = await prisma.user.upsert({
    where: { email: "guest1@example.com" },
    update: {},
    create: {
      supabaseId: "seed_guest_001",
      email: "guest1@example.com",
      name: "Rahul Verma",
      phone: "+91-9876543212",
      role: "GUEST",
      gender: "MALE",
      city: "Mumbai",
      state: "Maharashtra",
    },
  });

  const guest2 = await prisma.user.upsert({
    where: { email: "guest2@example.com" },
    update: {},
    create: {
      supabaseId: "seed_guest_002",
      email: "guest2@example.com",
      name: "Priya Singh",
      phone: "+91-9876543213",
      role: "GUEST",
      gender: "FEMALE",
      city: "Delhi",
      state: "Delhi",
    },
  });

  const guest3 = await prisma.user.upsert({
    where: { email: "guest3@example.com" },
    update: {},
    create: {
      supabaseId: "seed_guest_003",
      email: "guest3@example.com",
      name: "Amit Patel",
      phone: "+91-9876543214",
      role: "GUEST",
      gender: "MALE",
      city: "Ahmedabad",
      state: "Gujarat",
    },
  });
  console.log("✅ Guest users created");

  // Create Staff user
  const staffUser = await prisma.user.upsert({
    where: { email: "warden@elitehomes.com" },
    update: {},
    create: {
      supabaseId: "seed_staff_001",
      email: "warden@elitehomes.com",
      name: "Suresh Kumar",
      phone: "+91-9876543215",
      role: "STAFF",
      isVerified: true,
    },
  });
  console.log("✅ Staff user created");

  // Create Hostel
  const hostel = await prisma.hostel.upsert({
    where: { slug: "elite-boys-hostel-mumbai" },
    update: {},
    create: {
      name: "Elite Boys Hostel",
      slug: "elite-boys-hostel-mumbai",
      description:
        "Premium boys hostel in the heart of Mumbai with modern amenities and 24/7 security. Close to major colleges and business districts.",
      address: "42, Carter Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400050",
      phone: "+91-22-26543210",
      email: "mumbai@elitehomes.com",
      gender: "MALE",
      amenities: [
        "WiFi",
        "AC",
        "Hot Water",
        "Laundry",
        "Parking",
        "TV Room",
        "Gym",
        "Study Room",
        "CCTV",
        "Security",
        "Power Backup",
        "Water Purifier",
        "Mess/Canteen",
      ],
      rules: [
        "No smoking inside the premises",
        "Visitors allowed only in common areas between 10 AM - 8 PM",
        "Night curfew at 11 PM",
        "Maintain silence after 10 PM",
        "Keep your room and common areas clean",
        "Report any maintenance issues immediately",
        "Monthly rent must be paid by 5th of each month",
      ],
      adminId: hostelAdmin.id,
      totalCapacity: 0,
    },
  });
  console.log("✅ Hostel created:", hostel.name);

  // Create second hostel
  const hostel2 = await prisma.hostel.upsert({
    where: { slug: "elite-girls-hostel-pune" },
    update: {},
    create: {
      name: "Elite Girls Hostel",
      slug: "elite-girls-hostel-pune",
      description:
        "Safe and comfortable girls hostel in Pune with all modern facilities.",
      address: "15, FC Road, Shivajinagar",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      zipCode: "411005",
      phone: "+91-20-26543210",
      email: "pune@elitehomes.com",
      gender: "FEMALE",
      amenities: [
        "WiFi",
        "AC",
        "Hot Water",
        "Laundry",
        "CCTV",
        "Security",
        "Power Backup",
        "Water Purifier",
        "Mess/Canteen",
        "Elevator",
      ],
      rules: [
        "No male visitors beyond the reception area",
        "Night curfew at 10 PM",
        "Keep rooms clean",
        "No loud music after 9 PM",
      ],
      adminId: hostelAdmin.id,
      totalCapacity: 0,
    },
  });
  console.log("✅ Hostel 2 created:", hostel2.name);

  // Add admin as hostel member
  await prisma.hostelMember.upsert({
    where: {
      hostelId_userId: { hostelId: hostel.id, userId: hostelAdmin.id },
    },
    update: {},
    create: {
      hostelId: hostel.id,
      userId: hostelAdmin.id,
      role: "HOSTEL_ADMIN",
    },
  });

  await prisma.hostelMember.upsert({
    where: {
      hostelId_userId: { hostelId: hostel2.id, userId: hostelAdmin.id },
    },
    update: {},
    create: {
      hostelId: hostel2.id,
      userId: hostelAdmin.id,
      role: "HOSTEL_ADMIN",
    },
  });

  // Create Floors for Hostel 1
  const floors = [];
  for (let i = 0; i <= 3; i++) {
    const floor = await prisma.floor.upsert({
      where: {
        hostelId_floorNumber: { hostelId: hostel.id, floorNumber: i },
      },
      update: {},
      create: {
        name: i === 0 ? "Ground Floor" : `Floor ${i}`,
        floorNumber: i,
        description:
          i === 0
            ? "Reception, common area, and dining hall"
            : `Residential floor ${i} with rooms`,
        hostelId: hostel.id,
      },
    });
    floors.push(floor);
  }
  console.log("✅ Floors created:", floors.length);

  // Create Rooms and Beds
  const roomConfigs = [
    // Floor 1
    {
      floorIdx: 1,
      rooms: [
        { number: "101", type: "DOUBLE" as const, capacity: 2, rent: 8000 },
        { number: "102", type: "DOUBLE" as const, capacity: 2, rent: 8000 },
        { number: "103", type: "TRIPLE" as const, capacity: 3, rent: 6500 },
        { number: "104", type: "TRIPLE" as const, capacity: 3, rent: 6500 },
        { number: "105", type: "SINGLE" as const, capacity: 1, rent: 12000 },
      ],
    },
    // Floor 2
    {
      floorIdx: 2,
      rooms: [
        { number: "201", type: "DOUBLE" as const, capacity: 2, rent: 8500 },
        { number: "202", type: "DOUBLE" as const, capacity: 2, rent: 8500 },
        { number: "203", type: "QUAD" as const, capacity: 4, rent: 5500 },
        { number: "204", type: "TRIPLE" as const, capacity: 3, rent: 7000 },
        { number: "205", type: "SINGLE" as const, capacity: 1, rent: 13000 },
      ],
    },
    // Floor 3
    {
      floorIdx: 3,
      rooms: [
        { number: "301", type: "DOUBLE" as const, capacity: 2, rent: 9000 },
        { number: "302", type: "DOUBLE" as const, capacity: 2, rent: 9000 },
        { number: "303", type: "TRIPLE" as const, capacity: 3, rent: 7500 },
        { number: "304", type: "QUAD" as const, capacity: 4, rent: 6000 },
      ],
    },
  ];

  let totalBeds = 0;

  for (const config of roomConfigs) {
    const floor = floors[config.floorIdx];
    for (const roomData of config.rooms) {
      const room = await prisma.room.upsert({
        where: {
          hostelId_roomNumber: {
            hostelId: hostel.id,
            roomNumber: roomData.number,
          },
        },
        update: {},
        create: {
          roomNumber: roomData.number,
          type: roomData.type,
          capacity: roomData.capacity,
          monthlyRent: roomData.rent,
          deposit: roomData.rent,
          status: "AVAILABLE",
          hostelId: hostel.id,
          floorId: floor.id,
          amenities: ["WiFi", "AC", "Hot Water"],
        },
      });

      // Create beds for each room
      for (let b = 1; b <= roomData.capacity; b++) {
        await prisma.bed.upsert({
          where: {
            roomId_bedNumber: {
              roomId: room.id,
              bedNumber: `${roomData.number}-B${b}`,
            },
          },
          update: {},
          create: {
            bedNumber: `${roomData.number}-B${b}`,
            status: "AVAILABLE",
            monthlyRent: roomData.rent,
            hostelId: hostel.id,
            roomId: room.id,
          },
        });
        totalBeds++;
      }
    }
  }

  // Update hostel capacity
  await prisma.hostel.update({
    where: { id: hostel.id },
    data: { totalCapacity: totalBeds },
  });
  console.log("✅ Rooms and beds created. Total beds:", totalBeds);

  // Create Employee
  await prisma.employee.upsert({
    where: {
      hostelId_userId: { hostelId: hostel.id, userId: staffUser.id },
    },
    update: {},
    create: {
      employeeRole: "WARDEN",
      salary: 25000,
      department: "Operations",
      hostelId: hostel.id,
      userId: staffUser.id,
    },
  });

  await prisma.hostelMember.upsert({
    where: {
      hostelId_userId: { hostelId: hostel.id, userId: staffUser.id },
    },
    update: {},
    create: {
      hostelId: hostel.id,
      userId: staffUser.id,
      role: "STAFF",
    },
  });
  console.log("✅ Employee created");

  // Get some beds for bookings
  const availableBeds = await prisma.bed.findMany({
    where: { hostelId: hostel.id, status: "AVAILABLE" },
    take: 3,
  });

  // Create Bookings
  if (availableBeds.length >= 3) {
    // Booking 1 - Checked In
    const booking1 = await prisma.booking.create({
      data: {
        bookingNumber: "BK-SEED001",
        status: "CHECKED_IN",
        checkInDate: new Date("2025-01-15"),
        actualCheckIn: new Date("2025-01-15"),
        monthlyRent: 8000,
        deposit: 8000,
        totalPaid: 16000,
        hostelId: hostel.id,
        guestId: guest1.id,
        bedId: availableBeds[0].id,
      },
    });

    await prisma.bed.update({
      where: { id: availableBeds[0].id },
      data: { status: "OCCUPIED" },
    });

    await prisma.hostelMember.upsert({
      where: {
        hostelId_userId: { hostelId: hostel.id, userId: guest1.id },
      },
      update: {},
      create: { hostelId: hostel.id, userId: guest1.id, role: "GUEST" },
    });

    // Booking 2 - Approved
    await prisma.booking.create({
      data: {
        bookingNumber: "BK-SEED002",
        status: "APPROVED",
        checkInDate: new Date("2025-02-01"),
        monthlyRent: 6500,
        deposit: 6500,
        hostelId: hostel.id,
        guestId: guest2.id,
        bedId: availableBeds[1].id,
      },
    });

    await prisma.bed.update({
      where: { id: availableBeds[1].id },
      data: { status: "RESERVED" },
    });

    // Booking 3 - Pending
    await prisma.booking.create({
      data: {
        bookingNumber: "BK-SEED003",
        status: "PENDING",
        checkInDate: new Date("2025-02-15"),
        monthlyRent: 8500,
        hostelId: hostel.id,
        guestId: guest3.id,
      },
    });

    console.log("✅ Bookings created");

    // Create Transactions
    await prisma.transaction.createMany({
      data: [
        {
          type: "INCOME",
          category: "ROOM_FEE",
          amount: 8000,
          description: "January rent - Rahul Verma (Room 101)",
          paymentStatus: "COMPLETED",
          paymentMethod: "UPI",
          hostelId: hostel.id,
          bookingId: booking1.id,
          date: new Date("2025-01-05"),
        },
        {
          type: "INCOME",
          category: "DEPOSIT",
          amount: 8000,
          description: "Security deposit - Rahul Verma",
          paymentStatus: "COMPLETED",
          paymentMethod: "Bank Transfer",
          hostelId: hostel.id,
          bookingId: booking1.id,
          date: new Date("2025-01-05"),
        },
        {
          type: "EXPENSE",
          category: "SALARY",
          amount: 25000,
          description: "Warden salary - January",
          paymentStatus: "COMPLETED",
          paymentMethod: "Bank Transfer",
          hostelId: hostel.id,
          date: new Date("2025-01-31"),
        },
        {
          type: "EXPENSE",
          category: "UTILITIES",
          amount: 15000,
          description: "Electricity bill - January",
          paymentStatus: "COMPLETED",
          paymentMethod: "Online",
          hostelId: hostel.id,
          date: new Date("2025-01-28"),
        },
        {
          type: "EXPENSE",
          category: "MAINTENANCE_COST",
          amount: 5000,
          description: "Plumbing repair - 2nd floor bathroom",
          paymentStatus: "COMPLETED",
          paymentMethod: "Cash",
          hostelId: hostel.id,
          date: new Date("2025-01-20"),
        },
        {
          type: "INCOME",
          category: "ROOM_FEE",
          amount: 8000,
          description: "February rent - Rahul Verma (Room 101)",
          paymentStatus: "COMPLETED",
          paymentMethod: "UPI",
          hostelId: hostel.id,
          bookingId: booking1.id,
          date: new Date("2025-02-05"),
        },
        {
          type: "EXPENSE",
          category: "FOOD",
          amount: 35000,
          description: "Mess supplies - February",
          paymentStatus: "COMPLETED",
          paymentMethod: "Cash",
          hostelId: hostel.id,
          date: new Date("2025-02-03"),
        },
      ],
    });
    console.log("✅ Transactions created");
  }

  // Create Complaints
  await prisma.complaint.createMany({
    data: [
      {
        ticketNumber: "TK-SEED001",
        title: "Water leakage in bathroom",
        description:
          "There is continuous water leakage from the ceiling of the bathroom on the 2nd floor. It has been happening for 2 days now.",
        category: "PLUMBING",
        priority: "HIGH",
        status: "IN_PROGRESS",
        hostelId: hostel.id,
        authorId: guest1.id,
        assigneeId: staffUser.id,
      },
      {
        ticketNumber: "TK-SEED002",
        title: "WiFi not working in Room 201",
        description:
          "The WiFi connection in Room 201 has been very slow for the past week. Unable to attend online classes.",
        category: "MAINTENANCE",
        priority: "MEDIUM",
        status: "OPEN",
        hostelId: hostel.id,
        authorId: guest1.id,
      },
      {
        ticketNumber: "TK-SEED003",
        title: "Noisy neighbors in Room 103",
        description:
          "The residents of Room 103 play loud music late at night, making it difficult to sleep.",
        category: "NOISE",
        priority: "LOW",
        status: "RESOLVED",
        resolution: "Spoke to the residents and issued a warning.",
        hostelId: hostel.id,
        authorId: guest1.id,
        resolvedAt: new Date("2025-01-25"),
      },
    ],
  });
  console.log("✅ Complaints created");

  // Create Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Monthly Rent Due Reminder",
        content:
          "This is a reminder that the monthly rent for February is due by 5th February. Please make the payment on time to avoid late fees.",
        isPublished: true,
        publishedAt: new Date("2025-02-01"),
        hostelId: hostel.id,
      },
      {
        title: "Maintenance Work Schedule",
        content:
          "The water supply will be disrupted on 10th February from 10 AM to 2 PM due to scheduled maintenance. Please store water accordingly.",
        isPublished: true,
        publishedAt: new Date("2025-02-08"),
        hostelId: hostel.id,
      },
    ],
  });
  console.log("✅ Announcements created");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Seed Data Summary:");
  console.log("   - 1 Super Admin (admin@elitehomes.com)");
  console.log("   - 1 Hostel Admin (owner@elitehomes.com)");
  console.log("   - 3 Guest Users");
  console.log("   - 1 Staff User (warden@elitehomes.com)");
  console.log("   - 2 Hostels");
  console.log("   - 4 Floors (Hostel 1)");
  console.log("   - 14 Rooms with beds");
  console.log("   - 3 Bookings (1 checked-in, 1 approved, 1 pending)");
  console.log("   - 7 Transactions");
  console.log("   - 3 Complaints");
  console.log("   - 2 Announcements");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
