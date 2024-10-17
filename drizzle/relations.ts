import { relations } from "drizzle-orm/relations";
import { users, games, leaderboard } from "./schema";

export const gamesRelations = relations(games, ({one}) => ({
	user: one(users, {
		fields: [games.userid],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	games: many(games),
	leaderboards: many(leaderboard),
}));

export const leaderboardRelations = relations(leaderboard, ({one}) => ({
	user: one(users, {
		fields: [leaderboard.userid],
		references: [users.id]
	}),
}));