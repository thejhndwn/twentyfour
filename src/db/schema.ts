import { 
	pgTable, 
	uuid, 
	varchar, 
	integer, 
	text, 
	foreignKey, 
	timestamp, 
	date 
  } from "drizzle-orm/pg-core";
  import { sql } from "drizzle-orm";
  
  
  export const users = pgTable("users", {
	id: uuid().notNull(),
	email: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
  });
  
  
  export const problems = pgTable("problems", {
	id: varchar({ length: 50 }).notNull(),
	nums: integer().array(),
	solution: text().array(),
  });
  
  
  export const games = pgTable("games", {
	gameid: uuid().notNull(),
	userid: uuid(),
	problemIds: varchar("problem_ids", { length: 50 }).array(),
	problemIndex: integer("problem_index"),
	problemStartTimes: timestamp("problem_start_times", { mode: 'date' }).array(),
	problemEndTimes: timestamp("problem_end_times", { mode: 'date' }).array(),
	problemTimes: integer("problem_times").array(),
	problemScores: integer("problem_scores").array(),
  }, (table) => {
	return {
	  gamesUseridFkey: foreignKey({
		columns: [table.userid],
		foreignColumns: [users.id],
		name: "games_userid_fkey"
	  }),
	}});
  
  
  export const leaderboard = pgTable("leaderboard", {
	gameid: uuid(),
	score: integer(),
	userid: uuid().notNull(),
	yearmonth: date().notNull(),
  }, (table) => {
	return {
	  leaderboardUseridFkey: foreignKey({
		columns: [table.userid],
		foreignColumns: [users.id],
		name: "leaderboard_userid_fkey"
	  }),
	}});
