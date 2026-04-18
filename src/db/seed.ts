import 'dotenv/config';
import { db } from './index';
import { roadmaps, topics } from './schema';

async function main() {
  console.log('Seeding default roadmaps...');

  // Delete existing roadmaps and topics to avoid duplicates
  console.log('Deleting existing roadmaps and topics...');
  await db.delete(topics);
  await db.delete(roadmaps);
  console.log('Deleted existing data');

  // Insert Roadmap 1: DSA with JavaScript
  const dsaRoadmap = await db.insert(roadmaps).values({
    title: 'DSA with JavaScript',
    category: 'dsa',
    isDefault: true,
    createdBy: null, // System created
  }).returning();

  const dsaTopics = [
    { title: 'Time & Space Complexity', resourceUrl: 'https://www.bigocheatsheet.com', timeToLearnDays: 2 },
    { title: 'Arrays', resourceUrl: 'https://leetcode.com/explore/learn/card/fun-with-arrays', timeToLearnDays: 3 },
    { title: 'Strings', resourceUrl: 'https://leetcode.com/explore/learn/card/array-and-string', timeToLearnDays: 3 },
    { title: 'Hashing', resourceUrl: 'https://www.geeksforgeeks.org/hashing-data-structure', timeToLearnDays: 3 },
    { title: 'Two Pointers', resourceUrl: 'https://leetcode.com/tag/two-pointers', timeToLearnDays: 2 },
    { title: 'Sliding Window', resourceUrl: 'https://leetcode.com/tag/sliding-window', timeToLearnDays: 2 },
    { title: 'Stack', resourceUrl: 'https://leetcode.com/explore/learn/card/queue-stack', timeToLearnDays: 2 },
    { title: 'Queue', resourceUrl: 'https://leetcode.com/explore/learn/card/queue-stack', timeToLearnDays: 2 },
    { title: 'Linked List', resourceUrl: 'https://leetcode.com/explore/learn/card/linked-list', timeToLearnDays: 4 },
    { title: 'Recursion', resourceUrl: 'https://leetcode.com/explore/learn/card/recursion-i', timeToLearnDays: 4 },
    { title: 'Binary Search', resourceUrl: 'https://leetcode.com/explore/learn/card/binary-search', timeToLearnDays: 3 },
    { title: 'Sorting Algorithms', resourceUrl: 'https://www.geeksforgeeks.org/sorting-algorithms', timeToLearnDays: 3 },
    { title: 'Trees', resourceUrl: 'https://leetcode.com/explore/learn/card/data-structure-tree', timeToLearnDays: 5 },
    { title: 'BST', resourceUrl: 'https://leetcode.com/explore/learn/card/introduction-to-data-structure-binary-search-tree', timeToLearnDays: 4 },
    { title: 'Heaps', resourceUrl: 'https://www.geeksforgeeks.org/heap-data-structure', timeToLearnDays: 3 },
    { title: 'Graphs BFS/DFS', resourceUrl: 'https://leetcode.com/explore/learn/card/graph', timeToLearnDays: 6 },
    { title: 'Dynamic Programming 1D', resourceUrl: 'https://leetcode.com/explore/learn/card/dynamic-programming', timeToLearnDays: 7 },
    { title: 'Dynamic Programming 2D', resourceUrl: 'https://leetcode.com/tag/dynamic-programming', timeToLearnDays: 7 },
    { title: 'Greedy Algorithms', resourceUrl: 'https://www.geeksforgeeks.org/greedy-algorithms', timeToLearnDays: 4 },
    { title: 'Backtracking', resourceUrl: 'https://leetcode.com/tag/backtracking', timeToLearnDays: 5 },
  ];

  await db.insert(topics).values(
    dsaTopics.map((topic, index) => ({
      roadmapId: dsaRoadmap[0].id,
      title: topic.title,
      resourceUrl: topic.resourceUrl,
      timeToLearnDays: topic.timeToLearnDays,
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
    { title: 'HTML Fundamentals', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', timeToLearnDays: 3 },
    { title: 'CSS Fundamentals', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/CSS', timeToLearnDays: 4 },
    { title: 'Flexbox & Grid', resourceUrl: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox', timeToLearnDays: 2 },
    { title: 'JavaScript Basics', resourceUrl: 'https://javascript.info', timeToLearnDays: 7 },
    { title: 'DOM Manipulation', resourceUrl: 'https://javascript.info/document', timeToLearnDays: 3 },
    { title: 'Fetch API & Promises', resourceUrl: 'https://javascript.info/async', timeToLearnDays: 3 },
    { title: 'React Basics', resourceUrl: 'https://react.dev/learn', timeToLearnDays: 5 },
    { title: 'React Hooks', resourceUrl: 'https://react.dev/reference/react', timeToLearnDays: 4 },
    { title: 'State Management', resourceUrl: 'https://zustand-demo.pmnd.rs', timeToLearnDays: 3 },
    { title: 'React Router', resourceUrl: 'https://reactrouter.com/en/main', timeToLearnDays: 2 },
    { title: 'Next.js App Router', resourceUrl: 'https://nextjs.org/docs', timeToLearnDays: 5 },
    { title: 'Tailwind CSS', resourceUrl: 'https://tailwindcss.com/docs', timeToLearnDays: 3 },
    { title: 'TypeScript Basics', resourceUrl: 'https://www.typescriptlang.org/docs/handbook/intro.html', timeToLearnDays: 5 },
    { title: 'Git & GitHub', resourceUrl: 'https://learngitbranching.js.org', timeToLearnDays: 3 },
    { title: 'Web Performance', resourceUrl: 'https://web.dev/performance', timeToLearnDays: 3 },
  ];

  await db.insert(topics).values(
    frontendTopics.map((topic, index) => ({
      roadmapId: frontendRoadmap[0].id,
      title: topic.title,
      resourceUrl: topic.resourceUrl,
      timeToLearnDays: topic.timeToLearnDays,
      orderIndex: index + 1,
    }))
  );

  console.log(`Created Frontend roadmap with ${frontendTopics.length} topics`);

  // Insert Roadmap 3: Backend Roadmap
  const backendRoadmap = await db.insert(roadmaps).values({
    title: 'Backend Roadmap',
    category: 'backend',
    isDefault: true,
    createdBy: null, // System created
  }).returning();

  const backendTopics = [
    { title: 'HTTP & REST APIs', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', timeToLearnDays: 3 },
    { title: 'Node.js Basics', resourceUrl: 'https://nodejs.org/en/docs', timeToLearnDays: 5 },
    { title: 'Express.js', resourceUrl: 'https://expressjs.com/en/guide/routing.html', timeToLearnDays: 4 },
    { title: 'PostgreSQL Basics', resourceUrl: 'https://www.postgresqltutorial.com', timeToLearnDays: 5 },
    { title: 'SQL Queries & Joins', resourceUrl: 'https://sqlzoo.net', timeToLearnDays: 4 },
    { title: 'Database Design & Normalization', resourceUrl: 'https://www.geeksforgeeks.org/database-normalization-normal-forms', timeToLearnDays: 3 },
    { title: 'Authentication & JWT', resourceUrl: 'https://jwt.io/introduction', timeToLearnDays: 3 },
    { title: 'Drizzle ORM', resourceUrl: 'https://orm.drizzle.team/docs/overview', timeToLearnDays: 3 },
    { title: 'REST API Best Practices', resourceUrl: 'https://restfulapi.net', timeToLearnDays: 2 },
    { title: 'Error Handling & Middleware', resourceUrl: 'https://expressjs.com/en/guide/error-handling.html', timeToLearnDays: 2 },
    { title: 'File Uploads', resourceUrl: 'https://www.npmjs.com/package/multer', timeToLearnDays: 2 },
    { title: 'Caching with Redis', resourceUrl: 'https://redis.io/docs/manual/client-side-caching', timeToLearnDays: 4 },
    { title: 'Rate Limiting & Security', resourceUrl: 'https://www.npmjs.com/package/express-rate-limit', timeToLearnDays: 2 },
    { title: 'WebSockets', resourceUrl: 'https://socket.io/docs/v4', timeToLearnDays: 4 },
    { title: 'Deployment & Docker Basics', resourceUrl: 'https://docs.docker.com/get-started', timeToLearnDays: 5 },
  ];

  await db.insert(topics).values(
    backendTopics.map((topic, index) => ({
      roadmapId: backendRoadmap[0].id,
      title: topic.title,
      resourceUrl: topic.resourceUrl,
      timeToLearnDays: topic.timeToLearnDays,
      orderIndex: index + 1,
    }))
  );

  console.log(`Created Backend roadmap with ${backendTopics.length} topics`);

  // Insert Roadmap 4: System Design Basics
  const systemDesignRoadmap = await db.insert(roadmaps).values({
    title: 'System Design Basics',
    category: 'system_design',
    isDefault: true,
    createdBy: null, // System created
  }).returning();

  const systemDesignTopics = [
    { title: 'What is System Design', resourceUrl: 'https://github.com/donnemartin/system-design-primer', timeToLearnDays: 2 },
    { title: 'Client-Server Architecture', resourceUrl: 'https://www.geeksforgeeks.org/client-server-model', timeToLearnDays: 1 },
    { title: 'DNS & How Web Works', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work', timeToLearnDays: 2 },
    { title: 'Load Balancing', resourceUrl: 'https://www.nginx.com/resources/glossary/load-balancing', timeToLearnDays: 2 },
    { title: 'Caching Strategies', resourceUrl: 'https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one', timeToLearnDays: 3 },
    { title: 'Database Scaling', resourceUrl: 'https://www.geeksforgeeks.org/database-sharding', timeToLearnDays: 3 },
    { title: 'SQL vs NoSQL', resourceUrl: 'https://www.mongodb.com/nosql-explained/nosql-vs-sql', timeToLearnDays: 2 },
    { title: 'CAP Theorem', resourceUrl: 'https://www.ibm.com/topics/cap-theorem', timeToLearnDays: 2 },
    { title: 'Message Queues', resourceUrl: 'https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html', timeToLearnDays: 3 },
    { title: 'API Design', resourceUrl: 'https://swagger.io/resources/articles/best-practices-in-api-design', timeToLearnDays: 2 },
    { title: 'Microservices vs Monolith', resourceUrl: 'https://www.atlassian.com/microservices/microservices-architecture/microservices-vs-monolith', timeToLearnDays: 2 },
    { title: 'CDN', resourceUrl: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn', timeToLearnDays: 1 },
    { title: 'Design URL Shortener', resourceUrl: 'https://github.com/donnemartin/system-design-primer#design-pastebin-com-or-bit-ly', timeToLearnDays: 3 },
    { title: 'Design Twitter Feed', resourceUrl: 'https://github.com/donnemartin/system-design-primer#design-the-twitter-timeline-and-search', timeToLearnDays: 4 },
    { title: 'Design WhatsApp', resourceUrl: 'https://github.com/donnemartin/system-design-primer#design-a-chat-app', timeToLearnDays: 4 },
  ];

  await db.insert(topics).values(
    systemDesignTopics.map((topic, index) => ({
      roadmapId: systemDesignRoadmap[0].id,
      title: topic.title,
      resourceUrl: topic.resourceUrl,
      timeToLearnDays: topic.timeToLearnDays,
      orderIndex: index + 1,
    }))
  );

  console.log(`Created System Design roadmap with ${systemDesignTopics.length} topics`);

  // Insert Roadmap 5: DevOps Basics
  const devopsRoadmap = await db.insert(roadmaps).values({
    title: 'DevOps Basics',
    category: 'devops',
    isDefault: true,
    createdBy: null, // System created
  }).returning();

  const devopsTopics = [
    { title: 'Linux Command Line', resourceUrl: 'https://linuxcommand.org/lc3_learning_the_shell.php', timeToLearnDays: 5 },
    { title: 'Git Advanced', resourceUrl: 'https://learngitbranching.js.org', timeToLearnDays: 3 },
    { title: 'Docker Basics', resourceUrl: 'https://docs.docker.com/get-started', timeToLearnDays: 5 },
    { title: 'Docker Compose', resourceUrl: 'https://docs.docker.com/compose/gettingstarted', timeToLearnDays: 3 },
    { title: 'CI/CD Concepts', resourceUrl: 'https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment', timeToLearnDays: 2 },
    { title: 'GitHub Actions', resourceUrl: 'https://docs.github.com/en/actions', timeToLearnDays: 4 },
    { title: 'Cloud Basics AWS/GCP', resourceUrl: 'https://aws.amazon.com/getting-started', timeToLearnDays: 5 },
    { title: 'Nginx Basics', resourceUrl: 'https://nginx.org/en/docs/beginners_guide.html', timeToLearnDays: 3 },
    { title: 'Environment Variables & Secrets', resourceUrl: 'https://12factor.net/config', timeToLearnDays: 1 },
    { title: 'Monitoring & Logging', resourceUrl: 'https://grafana.com/docs/grafana/latest/getting-started', timeToLearnDays: 3 },
    { title: 'Kubernetes Basics', resourceUrl: 'https://kubernetes.io/docs/tutorials/kubernetes-basics', timeToLearnDays: 7 },
    { title: 'Infrastructure as Code', resourceUrl: 'https://developer.hashicorp.com/terraform/intro', timeToLearnDays: 5 },
  ];

  await db.insert(topics).values(
    devopsTopics.map((topic, index) => ({
      roadmapId: devopsRoadmap[0].id,
      title: topic.title,
      resourceUrl: topic.resourceUrl,
      timeToLearnDays: topic.timeToLearnDays,
      orderIndex: index + 1,
    }))
  );

  console.log(`Created DevOps roadmap with ${devopsTopics.length} topics`);
  console.log('Seed completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
