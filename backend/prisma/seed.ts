import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.savedProperty.deleteMany()
  await prisma.property.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.user.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.location.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  console.log('📁 Creating categories...')
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Apartment',
        slug: 'apartment',
        description: 'Modern apartments in prime locations',
        icon: '🏢',
      },
      {
        name: 'House',
        slug: 'house',
        description: 'Beautiful houses with spacious yards',
        icon: '🏡',
      },
      {
        name: 'Villa',
        slug: 'villa',
        description: 'Luxurious villas with premium amenities',
        icon: '🏰',
      },
      {
        name: 'Commercial',
        slug: 'commercial',
        description: 'Commercial spaces for businesses',
        icon: '🏬',
      },
    ],
  })

  // Create locations
  console.log('📍 Creating locations...')
  const locations = await prisma.location.createMany({
    data: [
      {
        name: 'Downtown',
        slug: 'downtown',
        description: 'Heart of the city with urban lifestyle',
        image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
      },
      {
        name: 'Suburbs',
        slug: 'suburbs',
        description: 'Peaceful suburban neighborhoods',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      },
      {
        name: 'Beachfront',
        slug: 'beachfront',
        description: 'Stunning waterfront properties',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      },
    ],
  })

  // Create agents
  console.log('👨‍💼 Creating agents...')
  const agents = await prisma.agent.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@arsarealestate.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        bio: 'Expert real estate agent with 10+ years experience',
        license: 'RE123456',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@arsarealestate.com',
        phone: '+1 (555) 234-5678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        bio: 'Luxury property specialist',
        license: 'RE234567',
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@arsarealestate.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        bio: 'Commercial property expert',
        license: 'RE345678',
      },
    ],
  })

  // Create admin user
  console.log('👤 Creating admin user...')
  const adminPassword = await hashPassword('Admin@123')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@arsarealestate.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+1 (555) 000-0000',
    },
  })

  // Create regular users
  console.log('👥 Creating regular users...')
  const userPassword = await hashPassword('User@123')
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'buyer1@example.com',
        password: userPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'USER',
        phone: '+1 (555) 111-1111',
      },
      {
        email: 'buyer2@example.com',
        password: userPassword,
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'USER',
        phone: '+1 (555) 222-2222',
      },
    ],
  })

  // Get all created data for associations
  const allCategories = await prisma.category.findMany()
  const allLocations = await prisma.location.findMany()
  const allAgents = await prisma.agent.findMany()

  // Create properties
  console.log('🏠 Creating properties...')
  const properties = await prisma.property.createMany({
    data: [
      {
        title: 'Luxury Penthouse in Downtown',
        description: 'Beautiful 3-bedroom penthouse with panoramic city views, modern kitchen, and high-end finishes.',
        price: 950000,
        type: 'APARTMENT',
        status: 'AVAILABLE',
        address: '123 Main Street',
        city: 'Downtown',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 2800,
        yearBuilt: 2022,
        categoryId: allCategories[0].id,
        locationId: allLocations[0].id,
        agentId: allAgents[0].id,
        ownerId: admin.id,
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        featured: true,
      },
      {
        title: 'Cozy Family Home',
        description: 'Perfect family home with 4 bedrooms, spacious backyard, and top-rated schools nearby.',
        price: 550000,
        type: 'HOUSE',
        status: 'AVAILABLE',
        address: '456 Oak Avenue',
        city: 'Suburbs',
        state: 'CA',
        zipCode: '90211',
        country: 'USA',
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2200,
        yearBuilt: 2015,
        categoryId: allCategories[1].id,
        locationId: allLocations[1].id,
        agentId: allAgents[1].id,
        ownerId: admin.id,
        thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
        featured: true,
      },
      {
        title: 'Beachfront Villa',
        description: 'Stunning beachfront villa with direct ocean access, infinity pool, and luxury amenities.',
        price: 2500000,
        type: 'VILLA',
        status: 'AVAILABLE',
        address: '789 Beach Road',
        city: 'Beachfront',
        state: 'CA',
        zipCode: '90212',
        country: 'USA',
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 4500,
        yearBuilt: 2020,
        categoryId: allCategories[2].id,
        locationId: allLocations[2].id,
        agentId: allAgents[2].id,
        ownerId: admin.id,
        thumbnail: 'https://images.unsplash.com/photo-1512917774080-9a485dc7005d?w=400',
        images: ['https://images.unsplash.com/photo-1512917774080-9a485dc7005d?w=800'],
        featured: true,
      },
    ],
  })

  // Create testimonials
  console.log('⭐ Creating testimonials...')
  await prisma.testimonial.createMany({
    data: [
      {
        content: 'ARSA Real Estate helped me find my dream home! The agents were professional and supportive throughout the process.',
        rating: 5,
        authorId: users[0].id,
        featured: true,
      },
      {
        content: 'Great experience with excellent customer service. Highly recommended!',
        rating: 5,
        authorId: users[1].id,
        featured: true,
      },
    ],
  })

  // Create settings
  console.log('⚙️ Creating settings...')
  await prisma.settings.createMany({
    data: [
      {
        key: 'site_name',
        value: 'ARSA Real Estate',
        description: 'Website name',
      },
      {
        key: 'site_description',
        value: 'Luxury Real Estate Platform',
        description: 'Website description',
      },
      {
        key: 'contact_email',
        value: 'contact@arsarealestate.com',
        description: 'Primary contact email',
      },
      {
        key: 'contact_phone',
        value: '+1 (555) 123-4567',
        description: 'Primary contact phone',
      },
      {
        key: 'logo_url',
        value: 'https://via.placeholder.com/200x50?text=ARSA',
        description: 'Logo URL',
      },
    ],
  })

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
