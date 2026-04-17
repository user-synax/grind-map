import 'dotenv/config';
import { db } from './index';
import { roadmaps, topics } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Seeding default roadmaps...');

  // Check if default roadmaps already exist
  const existingRoadmaps = await db.select().from(roadmaps).where(eq(roadmaps.isDefault, true));
  
  if (existingRoadmaps.length > 0) {
    console.log('Default roadmaps already exist. Skipping seed.');
    return;
  }

  // Insert Roadmap 1: DSA with JavaScript
  const dsaRoadmap = await db.insert(roadmaps).values({
    title: 'DSA with JavaScript',
    category: 'dsa',
    isDefault: true,
    createdBy: null, // System created
  }).returning();

  const dsaTopics = [
    'Time & Space Complexity',
    'Arrays',
    'Strings',
    'Hashing',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Queue',
    'Linked List',
    'Recursion',
    'Binary Search',
    'Sorting Algorithms',
    'Trees',
    'BST',
    'Heaps',
    'Graphs - BFS/DFS',
    'Dynamic Programming - 1D',
    'Dynamic Programming - 2D',
    'Greedy Algorithms',
    'Backtracking',
  ];

  await db.insert(topics).values(
    dsaTopics.map((title, index) => ({
      roadmapId: dsaRoadmap[0].id,
      title,
      orderIndex: index + 1,
    }))
  );

  console.log(`Created DSA roadmap with ${dsaTopics.length} topics`);

  // Insert Roadmap 2: Frontend Roadmap
  const frontendRoadmap = await db.insert(roadmaps).values({
    title: 'Frontend Roadmap',
    category: 'frontend',
    isDefault: true,
    createdBy: null, // System created
  }).returning();

  const frontendTopics = [
    'HTML Fundamentals',
    'CSS Fundamentals',
    'Flexbox & Grid',
    'JavaScript Basics',
    'DOM Manipulation',
    'Fetch API & Promises',
    'React Basics',
    'React Hooks',
    'State Management',
    'React Router',
    'Next.js App Router',
    'Tailwind CSS',
    'TypeScript Basics',
    'Git & GitHub',
    'Web Performance',
  ];

  await db.insert(topics).values(
    frontendTopics.map((title, index) => ({
      roadmapId: frontendRoadmap[0].id,
      title,
      orderIndex: index + 1,
    }))
  );

  console.log(`Created Frontend roadmap with ${frontendTopics.length} topics`);
  console.log('Seed completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
