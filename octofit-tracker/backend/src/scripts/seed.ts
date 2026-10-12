import mongoose from 'mongoose';
import { randomBytes, scryptSync } from 'node:crypto';
import { connectDatabase } from '../config/database.js';
import { Activity } from '../models/Activity.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Workout } from '../models/Workout.js';

async function seedDatabase(): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Refusing to seed demo data in production');
    }

    const seedPassword = process.env.OCTOFIT_SEED_PASSWORD;
    if (!seedPassword || seedPassword.length < 12) {
      throw new Error('Set OCTOFIT_SEED_PASSWORD to a value at least 12 characters long');
    }

    await connectDatabase();

    console.log('Seed the octofit_db database with test data');

    const users = [
      {
        username: 'maya-chen',
        email: 'maya.chen@example.com',
        profile: { displayName: 'Maya Chen' },
      },
      {
        username: 'leo-martinez',
        email: 'leo.martinez@example.com',
        profile: { displayName: 'Leo Martinez' },
      },
      {
        username: 'amina-patel',
        email: 'amina.patel@example.com',
        profile: { displayName: 'Amina Patel' },
      },
    ];
    const userIds = new Map<string, mongoose.Types.ObjectId>();

    for (const user of users) {
      const salt = randomBytes(16).toString('hex');
      const passwordHash = `scrypt$${salt}$${scryptSync(seedPassword, salt, 64).toString('hex')}`;
      const savedUser = await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: { ...user, email: user.email.toLowerCase(), passwordHash },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();

      if (!savedUser) {
        throw new Error(`Failed to seed user ${user.email}`);
      }
      userIds.set(user.email, savedUser._id);
    }

    const teams = [
      { name: 'Trailblazers', members: ['maya.chen@example.com', 'leo.martinez@example.com'] },
      { name: 'Morning Movers', members: ['amina.patel@example.com'] },
    ];
    const teamIds = new Map<string, mongoose.Types.ObjectId>();

    for (const team of teams) {
      const members = team.members.map((email) => {
        const userId = userIds.get(email);
        if (!userId) {
          throw new Error(`Cannot find seeded user ${email} for team ${team.name}`);
        }
        return userId;
      });
      const savedTeam = await Team.findOneAndUpdate(
        { name: team.name },
        { $set: { members } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();

      if (!savedTeam) {
        throw new Error(`Failed to seed team ${team.name}`);
      }
      teamIds.set(team.name, savedTeam._id);
    }

    const activities = [
      {
        email: 'maya.chen@example.com',
        type: 'Outdoor run',
        durationMinutes: 36,
        distanceKilometers: 5.2,
        recordedAt: new Date('2026-10-10T07:30:00.000Z'),
      },
      {
        email: 'leo.martinez@example.com',
        type: 'Cycling',
        durationMinutes: 52,
        distanceKilometers: 18.4,
        recordedAt: new Date('2026-10-10T08:00:00.000Z'),
      },
      {
        email: 'amina.patel@example.com',
        type: 'Strength training',
        durationMinutes: 44,
        recordedAt: new Date('2026-10-11T06:45:00.000Z'),
      },
      {
        email: 'maya.chen@example.com',
        type: 'Yoga',
        durationMinutes: 30,
        recordedAt: new Date('2026-10-12T06:30:00.000Z'),
      },
    ];

    for (const activity of activities) {
      const userId = userIds.get(activity.email);
      if (!userId) {
        throw new Error(`Cannot find seeded user ${activity.email} for activity`);
      }
      await Activity.findOneAndUpdate(
        { user: userId, type: activity.type, recordedAt: activity.recordedAt },
        {
          $set: {
            user: userId,
            type: activity.type,
            durationMinutes: activity.durationMinutes,
            distanceKilometers: activity.distanceKilometers,
            recordedAt: activity.recordedAt,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec();
    }

    const leaderboardEntries = [
      { email: 'maya.chen@example.com', team: 'Trailblazers' },
      { email: 'leo.martinez@example.com', team: 'Trailblazers' },
      { email: 'amina.patel@example.com', team: 'Morning Movers' },
    ];

    for (const entry of leaderboardEntries) {
      const userId = userIds.get(entry.email);
      const teamId = teamIds.get(entry.team);
      if (!userId || !teamId) {
        throw new Error(`Cannot resolve leaderboard references for ${entry.email}`);
      }
      const points = activities
        .filter((activity) => activity.email === entry.email)
        .reduce(
          (total, activity) =>
            total +
            activity.durationMinutes +
            Math.round((activity.distanceKilometers ?? 0) * 10),
          0,
        );
      await Leaderboard.findOneAndUpdate(
        { user: userId },
        { $set: { user: userId, team: teamId, points } },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec();
    }

    const workouts = [
      {
        name: 'Beginner Full-Body Circuit',
        description: 'A balanced circuit with bodyweight squats, push-ups, and core work.',
        category: 'Strength',
        durationMinutes: 30,
        difficulty: 'beginner',
      },
      {
        name: 'Tempo Run Intervals',
        description: 'Warm up, alternate steady tempo intervals with recovery, then cool down.',
        category: 'Cardio',
        durationMinutes: 40,
        difficulty: 'intermediate',
      },
      {
        name: 'Mobility and Recovery Flow',
        description: 'A gentle full-body mobility sequence for rest and recovery days.',
        category: 'Mobility',
        durationMinutes: 25,
        difficulty: 'beginner',
      },
    ];

    for (const workout of workouts) {
      await Workout.findOneAndUpdate(
        { name: workout.name },
        { $set: workout },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec();
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedDatabase();
