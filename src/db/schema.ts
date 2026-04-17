import { pgTable, text, uuid, boolean, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  clerkId: text('clerkId').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const roadmaps = pgTable('roadmaps', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  isDefault: boolean('isDefault').default(false),
  createdBy: text('createdBy').references(() => users.clerkId),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  roadmapId: uuid('roadmapId').references(() => roadmaps.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('orderIndex').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const userProgress = pgTable('userProgress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('userId').references(() => users.clerkId, { onDelete: 'cascade' }),
  topicId: uuid('topicId').references(() => topics.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('not_started'),
  lastReviewedAt: timestamp('lastReviewedAt'),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdTopicIdUnique: {
    columns: [table.userId, table.topicId],
    name: 'userProgress_userId_topicId_unique',
  },
}));

export const streaks = pgTable('streaks', {
  userId: text('userId').primaryKey().references(() => users.clerkId),
  currentStreak: integer('currentStreak').default(0),
  longestStreak: integer('longestStreak').default(0),
  lastActiveDate: date('lastActiveDate'),
});

export const usersRelations = relations(users, ({ many }) => ({
  roadmaps: many(roadmaps),
  userProgress: many(userProgress),
  streaks: many(streaks),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [roadmaps.createdBy],
    references: [users.clerkId],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  roadmap: one(roadmaps, {
    fields: [topics.roadmapId],
    references: [roadmaps.id],
  }),
  userProgress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.clerkId],
  }),
  topic: one(topics, {
    fields: [userProgress.topicId],
    references: [topics.id],
  }),
}));

export const streaksRelations = relations(streaks, ({ one }) => ({
  user: one(users, {
    fields: [streaks.userId],
    references: [users.clerkId],
  }),
}));
