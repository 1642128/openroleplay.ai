import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    chatId: v.id("chats"),
    characterId: v.optional(v.id("characters")),
    personaId: v.optional(v.id("personas")),
    text: v.string(),
  })
    .index("byCharacterId", ["characterId"])
    .index("byChatId", ["chatId"]),
  users: defineTable({
    name: v.string(),
    primaryPersonaId: v.optional(v.id("personas")),
    crystals: v.optional(v.number()),
    tokenIdentifier: v.string(),
  }).index("byToken", ["tokenIdentifier"]),
  characters: defineTable({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    instructions: v.optional(v.string()),
    cardImageUrl: v.optional(v.string()),
    greetings: v.optional(v.array(v.string())),
    knowledge: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    creatorId: v.id("users"),
    remixId: v.optional(v.id("characters")),
    isDraft: v.boolean(),
    isBlacklisted: v.boolean(),
    isNSFW: v.optional(v.boolean()), // NSFW characters are filtered unless the adult user has explicitly opted in.
    isArchived: v.optional(v.boolean()),
    visibility: v.optional(v.union(v.literal("private"), v.literal("public"))),
    numChats: v.optional(v.number()),
    embedding: v.optional(v.array(v.float64())),
    model: v.optional(
      v.union(
        v.literal("gpt-3.5-turbo-1106"),
        v.literal("gpt-4-1106-preview"),
        v.literal("mistral-7b-instruct"),
        v.literal("mixtral-8x7b-instruct"),
        v.literal("pplx-7b-chat"),
        v.literal("pplx-7b-online"),
        v.literal("pplx-70b-chat"),
        v.literal("pplx-70b-online"),
        v.literal("accounts/fireworks/models/qwen-14b-chat"),
        v.literal("mistral-tiny"),
        v.literal("mistral-small"),
        v.literal("mistral-medium")
      )
    ),
    updatedAt: v.string(),
  })
    .index("byUserId", ["creatorId"])
    .index("byNumChats", ["numChats"])
    .vectorIndex("byEmbedding", {
      vectorField: "embedding",
      dimensions: 512,
      filterFields: ["name", "description", "instructions"],
    }),
  personas: defineTable({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    cardImageUrl: v.optional(v.string()),
    isPrivate: v.boolean(),
    isBlacklisted: v.boolean(),
    creatorId: v.id("users"),
    updatedAt: v.string(),
  }).index("byUserId", ["creatorId"]),
  chats: defineTable({
    chatName: v.optional(v.string()),
    updatedAt: v.string(),
    userId: v.optional(v.id("users")),
    characterId: v.optional(v.id("characters")),
    joinedAt: v.string(),
  })
    .index("byUserId", ["userId"])
    .index("byCharacterId", ["characterId"])
    .index("byUpdatedAt", ["updatedAt"]),
  followUps: defineTable({
    chatId: v.optional(v.id("chats")),
    followUp1: v.optional(v.string()),
    followUp2: v.optional(v.string()),
    followUp3: v.optional(v.string()),
    chosen: v.optional(v.string()),
    isStale: v.optional(v.boolean()),
  }).index("byChatId", ["chatId"]),
  usage: defineTable({
    userId: v.id("users"),
    name: v.string(),
  }).index("byUserId", ["userId"]),
  payments: defineTable({
    numCrystals: v.number(),
    stripeId: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("byStripeId", ["stripeId"])
    .index("byUserId", ["userId"]),
});
