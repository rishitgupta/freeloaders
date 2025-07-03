import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  await prisma.comment.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.organization.deleteMany();

  console.log("Seeding new data...");

  // Create sample organization
  const org1 = await prisma.organization.create({
    data: {
      display_name: "CS Club",
      organization_email: "org1@calpoly.edu",
      password: "securepassword", // Replace with a hashed password in production
      point_of_contact: "Bobby L",
      description: "Computer Science Club at Cal Poly.",
      profile_photo: null,
      cover_photo: null,
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      display_name: "Math Club",
      organization_email: "org2@calpoly.edu",
      password: "securepassword", // Replace with a hashed password in production
      point_of_contact: "Stacy P",
      description: "Math Club at Cal Poly.",
      profile_photo: null,
      cover_photo: null,
    },
  });

  // Create sample students
  const student1 = await prisma.student.create({
    data: {
      display_name: "John Doe",
      password: "securepassword", // Replace with a hashed password in production
      calpoly_email: "jdoe@calpoly.edu",
      profile_photo: null,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      display_name: "Jane Smith",
      password: "securepassword", // Replace with a hashed password in production
      calpoly_email: "jsmith@calpoly.edu",
      profile_photo: null,
    },
  });

  // Create sample events, each associated with an organization
  const event1 = await prisma.event.create({
    data: {
      name: "CS Club with Donuts!",
      description: "Free donuts for all. Drop by to hear about our goals!",
      food_type: "Donuts",
      quantity: "2 dozen",
      location: "table at the center",
      location_select: "Dexter Lawn",
      latitude: 35.30062062312402,
      longitude:  -120.66311314432491,
      start_time: new Date("2023-11-15T21:06:00"),
      end_time: new Date("2023-11-15T21:08:00"),
      photo: null,
      organizationId: org1.id, // Associated with CS Club
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: "Looking for New Members",
      description: "We are really cool. We have oreos of all flavors.",
      food_type: "Oreos",
      quantity: "20 packs",
      location: "at a tent!",
      location_select: "Dexter Lawn",
      latitude: 35.300537,
      longitude: -120.662926,
      start_time: new Date("2023-11-15T21:06:00"),
      end_time: new Date("2023-11-15T21:08:00"),
      photo: null,
      organizationId: org2.id, // Associated with Math Club
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: "Boba Bonanza",
      description: "Come grab some boba at the University Union!",
      food_type: "Boba",
      quantity: "10",
      location: "Second Floor",
      location_select: "University Union",
      latitude: 35.30020781967596,
      longitude: -120.65862545768086,
      start_time: new Date("2023-11-15T21:06:00"),
      end_time: new Date("2023-11-15T21:08:00"),
      photo: null,
      organizationId: org1.id, // Associated with CS Club
    },
  });

  const event4 = await prisma.event.create({
    data: {
      name: "Hamburger Party",
      description: "Come see our new projects before the break and enjoy some food!",
      food_type: "Hamburgers, cola",
      quantity: "$50 bucks worth",
      location: "We'll have a table set up",
      location_select: "ONeill Lawn",
      latitude: 35.29958668112798,
      longitude: -120.6656795868098,
      start_time: new Date("2024-12-06T18:00:00"),
      end_time: new Date("2024-12-06T20:08:00"),
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSluzk600jTjhWBQPnK4670YevZ3nA7MJx9uQ&s',
      organizationId: org1.id, // Associated with CS Club
    },
  });

  const event5 = await prisma.event.create({
    data: {
      name: "Study Center",
      description: "a forever ongoing event...",
      food_type: "energy drinks, energy bars",
      quantity: "infinitely many",
      location: "first floor",
      location_select: "Kennedy Library",
      latitude: 35.30189704216254,
      longitude: -120.6634694465816,
      start_time: new Date("2024-12-02T15:00:00"),
      end_time: new Date("2025-01-16T15:00:00"),
      photo: 'https://lib.calpoly.edu/wp-content/uploads/2015/03/Library-Front-Entrance-e1427481948509.jpg',
      organizationId: org1.id, // Associated with CS Club
    },
  });

  const event6 = await prisma.event.create({
  data: {
    name: "COOKIES",
    description: "FREE COOKIES",
    food_type: "WARM COOKIES",
    quantity: "WILL BAKE THROUGHOUT THE DAY",
    location: "CS Lab",
    location_select: "Computer Science Building",
    latitude: 35.30032651216707,
    longitude: -120.6623844042322,
    start_time: new Date("2024-12-06T13:00:00"),
    end_time: new Date("2024-12-06T17:30:00"),
    photo: 'https://lib.calpoly.edu/wp-content/uploads/2015/03/Library-Front-Entrance-e1427481948509.jpg',
    organizationId: org1.id, // Associated with CS Club
  },
});

  // Create sample comments
  await prisma.comment.createMany({
    data: [
      {
        text: "This event sounds amazing!",
        studentId: student1.id,
        eventId: event1.id,
      },
      {
        text: "I'll be there!",
        studentId: student2.id,
        eventId: event2.id,
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
