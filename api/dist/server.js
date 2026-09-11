var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server.ts
import express from "express";
import cors from "cors";

// routes/user.routes.ts
import { Router } from "express";

// repository/user.repository.ts
import { z } from "zod";
import bcrypt from "bcrypt";

// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.9.1",
  "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id               Int               @id @default(autoincrement())\n  name             String?\n  username         String            @unique @default("empty")\n  password         String            @default("empty")\n  consumptionPlans ConsumptionPlan[]\n  consumptions     Consumption[]\n  categories       Category[]\n  credits          Credit[]\n}\n\nmodel Category {\n  id       Int     @id @default(autoincrement())\n  name     String\n  editable Boolean @default(true)\n\n  userId Int  @map("user_id")\n  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  consumptionPlans ConsumptionPlan[]\n  consumptions     Consumption[]\n\n  @@unique([userId, name])\n  @@map("categories")\n}\n\nmodel ConsumptionPlan {\n  id         Int     @id @default(autoincrement())\n  amount     Decimal @db.Decimal(10, 2)\n  month      Int\n  year       Int\n  userId     Int     @map("user_id")\n  categoryId Int     @map("category_id")\n\n  // Relationships\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, categoryId, month, year])\n  @@map("consumption_plans")\n}\n\nmodel Consumption {\n  id          Int     @id @default(autoincrement())\n  amount      Decimal @db.Decimal(10, 2)\n  description String?\n  month       Int\n  year        Int\n  userId      Int     @map("user_id")\n  categoryId  Int     @map("category_id")\n\n  // Relationships\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@map("consumptions")\n}\n\nmodel Credit {\n  id          Int     @id @default(autoincrement())\n  title       String\n  amount      Decimal @db.Decimal(10, 2)\n  isActive    Boolean @default(true) @map("is_active")\n  description String?\n  userId      Int     @map("user_id")\n\n  // Relationships\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("credits")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"consumptionPlans","kind":"object","type":"ConsumptionPlan","relationName":"ConsumptionPlanToUser"},{"name":"consumptions","kind":"object","type":"Consumption","relationName":"ConsumptionToUser"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"credits","kind":"object","type":"Credit","relationName":"CreditToUser"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"editable","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"consumptionPlans","kind":"object","type":"ConsumptionPlan","relationName":"CategoryToConsumptionPlan"},{"name":"consumptions","kind":"object","type":"Consumption","relationName":"CategoryToConsumption"}],"dbName":"categories"},"ConsumptionPlan":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"month","kind":"scalar","type":"Int"},{"name":"year","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"user","kind":"object","type":"User","relationName":"ConsumptionPlanToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToConsumptionPlan"}],"dbName":"consumption_plans"},"Consumption":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"description","kind":"scalar","type":"String"},{"name":"month","kind":"scalar","type":"Int"},{"name":"year","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"categoryId","kind":"scalar","type":"Int","dbName":"category_id"},{"name":"user","kind":"object","type":"User","relationName":"ConsumptionToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToConsumption"}],"dbName":"consumptions"},"Credit":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"description","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"user","kind":"object","type":"User","relationName":"CreditToUser"}],"dbName":"credits"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","consumptionPlans","category","consumptions","_count","categories","credits","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_avg","_sum","_min","_max","User.groupBy","User.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","ConsumptionPlan.findUnique","ConsumptionPlan.findUniqueOrThrow","ConsumptionPlan.findFirst","ConsumptionPlan.findFirstOrThrow","ConsumptionPlan.findMany","ConsumptionPlan.createOne","ConsumptionPlan.createMany","ConsumptionPlan.createManyAndReturn","ConsumptionPlan.updateOne","ConsumptionPlan.updateMany","ConsumptionPlan.updateManyAndReturn","ConsumptionPlan.upsertOne","ConsumptionPlan.deleteOne","ConsumptionPlan.deleteMany","ConsumptionPlan.groupBy","ConsumptionPlan.aggregate","Consumption.findUnique","Consumption.findUniqueOrThrow","Consumption.findFirst","Consumption.findFirstOrThrow","Consumption.findMany","Consumption.createOne","Consumption.createMany","Consumption.createManyAndReturn","Consumption.updateOne","Consumption.updateMany","Consumption.updateManyAndReturn","Consumption.upsertOne","Consumption.deleteOne","Consumption.deleteMany","Consumption.groupBy","Consumption.aggregate","Credit.findUnique","Credit.findUniqueOrThrow","Credit.findFirst","Credit.findFirstOrThrow","Credit.findMany","Credit.createOne","Credit.createMany","Credit.createManyAndReturn","Credit.updateOne","Credit.updateMany","Credit.updateManyAndReturn","Credit.upsertOne","Credit.deleteOne","Credit.deleteMany","Credit.groupBy","Credit.aggregate","AND","OR","NOT","id","title","amount","isActive","description","userId","equals","in","notIn","lt","lte","gt","gte","contains","startsWith","endsWith","not","month","year","categoryId","name","editable","username","password","every","some","none","userId_name","userId_categoryId_month_year","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "1AI1UAsEAACkAQAgBgAApQEAIAgAAKYBACAJAACnAQAgYgAAoAEAMGMAABwAEGQAAKABADBlAgAAAAF5AQCiAQAhewEAAAABfAEAowEAIQEAAAABACALAwAAqwEAIAUAAK8BACBiAACxAQAwYwAAAwAQZAAAsQEAMGUCAKEBACFnEACpAQAhagIAoQEAIXYCAKEBACF3AgChAQAheAIAoQEAIQIDAACvAgAgBQAAsAIAIAwDAACrAQAgBQAArwEAIGIAALEBADBjAAADABBkAACxAQAwZQIAAAABZxAAqQEAIWoCAKEBACF2AgChAQAhdwIAoQEAIXgCAKEBACGBAQAAsAEAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgDAMAAKsBACAFAACvAQAgYgAArgEAMGMAAAgAEGQAAK4BADBlAgChAQAhZxAAqQEAIWkBAKIBACFqAgChAQAhdgIAoQEAIXcCAKEBACF4AgChAQAhAwMAAK8CACAFAACwAgAgaQAAsgEAIAwDAACrAQAgBQAArwEAIGIAAK4BADBjAAAIABBkAACuAQAwZQIAAAABZxAAqQEAIWkBAKIBACFqAgChAQAhdgIAoQEAIXcCAKEBACF4AgChAQAhAwAAAAgAIAEAAAkAMAIAAAoAIAEAAAADACABAAAACAAgAwAAAAgAIAEAAAkAMAIAAAoAIAoDAACrAQAgBAAApAEAIAYAAKUBACBiAACtAQAwYwAADwAQZAAArQEAMGUCAKEBACFqAgChAQAheQEAowEAIXogAKoBACEDAwAArwIAIAQAAKsCACAGAACsAgAgCwMAAKsBACAEAACkAQAgBgAApQEAIGIAAK0BADBjAAAPABBkAACtAQAwZQIAAAABagIAoQEAIXkBAKMBACF6IACqAQAhgAEAAKwBACADAAAADwAgAQAAEAAwAgAAEQAgCgMAAKsBACBiAACoAQAwYwAAEwAQZAAAqAEAMGUCAKEBACFmAQCjAQAhZxAAqQEAIWggAKoBACFpAQCiAQAhagIAoQEAIQIDAACvAgAgaQAAsgEAIAoDAACrAQAgYgAAqAEAMGMAABMAEGQAAKgBADBlAgAAAAFmAQCjAQAhZxAAqQEAIWggAKoBACFpAQCiAQAhagIAoQEAIQMAAAATACABAAAUADACAAAV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-AAADACB_AAADACADfQAACAAgfgAACAAgfwAACAAgA30AAA8AIH4AAA8AIH8AAA8AIAN9AAATACB-AAATACB_AAATACAKAwAAqwEAIGIAAKgBADBjAAATABBkAACoAQAwZQIAoQEAIWYBAKMBACFnEACpAQAhaCAAqgEAIWkBAKIBACFqAgChAQAhCGsQAAAAAWwQAAAABG0QAAAABG4QAAAAAW8QAAAAAXAQAAAAAXEQAAAAAXUQAJcBACECayAAAAABdSAAlQEAIQ0EAACkAQAgBgAApQEAIAgAAKYBACAJAACnAQAgYgAAoAEAMGMAABwAEGQAAKABADBlAgChAQAheQEAogEAIXsBAKMBACF8AQCjAQAhggEAABwAIIMBAAAcACACagIAAAABeQEAAAABCgMAAKsBACAEAACkAQAgBgAApQEAIGIAAK0BADBjAAAPABBkAACtAQAwZQIAoQEAIWoCAKEBACF5AQCjAQAheiAAqgEAIQwDAACrAQAgBQAArwEAIGIAAK4BADBjAAAIABBkAACuAQAwZQIAoQEAIWcQAKkBACFpAQCiAQAhagIAoQEAIXYCAKEBACF3AgChAQAheAIAoQEAIQwDAACrAQAgBAAApAEAIAYAAKUBACBiAACtAQAwYwAADwAQZAAArQEAMGUCAKEBACFqAgChAQAheQEAowEAIXogAKoBACGCAQAADwAggwEAAA8AIARqAgAAAAF2AgAAAAF3AgAAAAF4AgAAAAELAwAAqwEAIAUAAK8BACBiAACxAQAwYwAAAwAQZAAAsQEAMGUCAKEBACFnEACpAQAhagIAoQEAIXYCAKEBACF3AgChAQAheAIAoQEAIQAAAAAAAAGHAQEAAAABBYcBEAAAAAGNARAAAAABjgEQAAAAAY8BEAAAAAGQARAAAAABAYcBIAAAAAEBhwEBAAAAAQWHAQIAAAABjQECAAAAAY4BAgAAAAGPAQIAAAABkAECAAAAAQUWAADQAgAgFwAA0wIAIIQBAADRAgAghQEAANICACCKAQAAAQAgAxYAANACACCEAQAA0QIAIIoBAAABACAAAAAAAAUWAADIAgAgFwAAzgIAIIQBAADJAgAghQEAAM0CACCKAQAAAQAgBRYAAMYCACAXAADLAgAghAEAAMcCACCFAQAAygIAIIoBAAARACADFgAAyAIAIIQBAADJAgAgigEAAAEAIAMWAADGAgAghAEAAMcCACCKAQAAEQAgAAAAAAAFFgAAvgIAIBcAAMQCACCEAQAAvwIA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_wEAMIYBAACAAgAghwEAAIECADCIAQAAgQIAMIkBAACBAgAwigEAAIECADCLAQAAgwIAMIwBAACEAgAwBWUCAAAAAWYBAAAAAWcQAAAAAWggAAAAAWkBAAAAAQIAAAAVACAWAACIAgAgAwAAABUAIBYAAIgCACAXAACHAgAgAQ8AALQCADAKAwAAqwEAIGIAAKgBADBjAAATABBkAACoAQAwZQIAAAABZgEAowEAIWcQAKkBACFoIACqAQAhaQEAogEAIWoCAKEBACECAAAAFQAgDwAAhwIAIAIAAACFAgAgDwAAhgIAIAliAACEAgAwYwAAhQIAEGQAAIQCADBlAgChAQAhZgEAowEAIWcQAKkBACFoIACqAQAhaQEAogEAIWoCAKEBACEJYgAAhAIAMGMAAIUCABBkAACEAgAwZQIAoQEAIWYBAKMBACFnEACpAQAhaCAAqgEAIWkBAKIBACFqAgChAQAhBWUCALwBACFmAQC4AQAhZxAAuQEAIWggALoBACFpAQC7AQAhBWUCALwBACFmAQC4AQAhZxAAuQEAIWggALoBACFpAQC7AQAhBWUCAAAAAWYBAAAAAWcQAAAAAWggAAAAAWkBAAAAAQUEAADyAQAgBgAA8wEAIGUCAAAAAXkBAAAAAXogAAAAAQIAAAARACAWAACUAgAgAwAAABEAIBYAAJQCACAXAACTAgAgAQ8AALMCADALAwAAqwEAIAQAAKQBACAGAAClAQAgYgAArQEAMGMAAA8AEGQAAK0BADBlAgAAAAFqAgChAQAheQEAowEAIXogAKoBACGAAQAArAEAIAIAAAARACAPAACTAgAgAgAAAJECACAPAACSAgAgB2IAAJACADBjAACRAgAQZAAAkAIAMGUCAKEBACFqAgChAQAheQEAowEAIXogAKoBACEHYgAAkAIAMGMAAJECABBkAACQAgAwZQIAoQEAIWoCAKEBACF5AQCjAQAheiAAqgEAIQNlAgC8AQAheQEAuAEAIXogALoBACEFBAAA1wEAIAYAANgBACBlAgC8AQAheQEAuAEAIXogALoBACEFBAAA8gEAIAYAAPMBACBlAgAAAAF5AQAAAAF6IAAAAAEHBQAAxwEAIGUCAAAAAWcQAAAAAWkBAAAAAXYCAAAAAXcCAAAAAXgCAAAAAQIAAAAKACAWAACdAgAgAwAAAAoAIBYAAJ0CACAXAACcAgAgAQ8AALICADACAAAACgAgDwAAnAIAIAIAAADhAQAgDwAAmwIAIAZlAgC8AQAhZxAAuQEAIWkBALsBACF2AgC8AQAhdwIAvAEAIXgCALwBACEHBQAAxQEAIGUCALwBACFnEAC5AQAhaQEAuwEAIXYCALwBACF3AgC8AQAheAIAvAEAIQcFAADHAQAgZQIAAAABZxAAAAABaQEAAAABdgIAAAABdwIAAAABeAIAAAABBgUAANABACBlAgAAAAFnEAAAAAF2AgAAAAF3AgAAAAF4AgAAAAECAAAABQAgFgAApgIAIAMAAAAFACAWAACmAgAgFwAApQIAIAEPAACxAgAwAgAAAAUAIA8AAKUCACACAAAA7QEAIA8AAKQCACAFZQIAvAEAIWcQALkBACF2AgC8AQAhdwIAvAEAIXgCALwBACEGBQAAzgEAIGUCALwBACFnEAC5AQAhdgIAvAEAIXcCALwBACF4AgC8AQAhBgUAANABACBlAgAAAAFnEAAAAAF2AgAAAAF3AgAAAAF4AgAAAAEEFgAAngIAMIQBAACfAgAwhgEAAKECACCKAQAA6QEAMAQWAACVAgAwhAEAAJYCADCGAQAAmAIAIIoBAADdAQAwBBYAAIkCADCEAQAAigIAMIYBAACMAgAgigEAAI0CADAEFgAA_QEAMIQBAAD-AQAwhgEAAIACACCKAQAAgQIAMAAAAAAFBAAAqwIAIAYAAKwCACAIAACtAgAgCQAArgIAIHkAALIBACADAwAArwIAIAQAAKsCACAGAACsAgAgBWUCAAAAAWcQAAAAAXYCAAAAAXcCAAAAAXgCAAAAAQZlAgAAAAFnEAAAAAFpAQAAAAF2AgAAAAF3AgAAAAF4AgAAAAEDZQIAAAABeQEAAAABeiAAAAABBWUCAAAAAWYBAAAAAWcQAAAAAWggAAAAAWkBAAAAAQcEAACnAgAgBgAAqAIAIAkAAKoCACBlAgAAAAF5AQAAAAF7AQAAAAF8AQAAAAECAAAAAQAgFgAAtQIAIAVlAgAAAAFnEAAAAAFqAgAAAAF2AgAAAAF3AgAAAAEGZQIAAAABZxAAAAABaQEAAAABagIAAAABdgIAAAABdwIAAAABAwAAABwAIBYAALUCACAXAAC7AgAgCQAAABwAIAQAAPkBACAGAAD6AQAgCQAA_AEAIA8AALsCACBlAgC8AQAheQEAuwEAIXsBALgBACF8AQC4AQAhBwQAAPkBACAGAAD6AQAgCQAA_AEAIGUCALwBACF5AQC7AQAhewEAuAEAIXwBALgBACEGAwAA8QEAIAYAAPMBACBlAgAAAAFqAgAAAAF5AQAAAAF6IAAAAAECAAAAEQAgFgAAvAIAIAcGAACoAgAgCAAAqQIAIAkAAKoCACBlAgAAAAF5AQAAAAF7AQAAAAF8AQAAAAECAAAAAQAgFgAAvgIAIAMAAAAPACAWAAC8AgAgFwAAwgIAIAgAAAAPACADAADWAQAgBgAA2AEAIA8AAMICACBlAgC8AQAhagIAvAEAIXkBALgBACF6IAC6AQAhBgMAANYBACAGAADYAQAgZQIAvAEAIWoCALwBACF5AQC4AQAheiAAugEAIQMAAAAcACAWAAC-AgAgFwAAxQIAIAkAAAAcACAGAAD6AQAgCAAA-wEAIAkAAPwBACAPAADFAgAgZQIAvAEAIXkBALsBACF7AQC4AQAhfAEAuAEAIQcGAAD6AQAgCAAA-wEAIAkAAPwBACBlAgC8AQAheQEAuwEAIXsBALgBACF8AQC4AQAhBgMAAPEBACAEAADyAQAgZQIAAAABagIAAAABeQEAAAABeiAAAAABAgAAABEAIBYAAMYCACAHBAAApwIAIAgAAKkCACAJAACqAgAgZQIAAAABeQEAAAABewEAAAABfAEAAAABAgAAAAEAIBYAAMgCACADAAAADwAgFgAAxgIAIBcAAMwCACAIAAAADwAgAwAA1gEAIAQAANcBACAPAADMAgAgZQIAvAEAIWoCALwBACF5AQC4AQAheiAAugEAIQYDAADWAQAgBAAA1wEAIGUCALwBACFqAgC8AQAheQEAuAEAIXogALoBACEDAAAAHAAgFgAAyAIAIBcAAM8CACAJAAAAHAAgBAAA-QEAIAgAAPsBACAJAAD8AQAgDwAAzwIAIGUCALwBACF5AQC7AQAhewEAuAEAIXwBALgBACEHBAAA-QEAIAgAAPsBACAJAAD8AQAgZQIAvAEAIXkBALsBACF7AQC4AQAhfAEAuAEAIQcEAACnAgAgBgAAqAIAIAgAAKkCACBlAgAAAAF5AQAAAAF7AQAAAAF8AQAAAAECAAAAAQAgFgAA0AIAIAMAAAAcACAWAADQAgAgFwAA1AIAIAkAAAAcACAEAAD5AQAgBgAA-gEAIAgAAPsBACAPAADUAgAgZQIAvAEAIXkBALsBACF7AQC4AQAhfAEAuAEAIQcEAAD5AQAgBgAA-gEAIAgAAPsBACBlAgC8AQAheQEAuwEAIXsBALgBACF8AQC4AQAhBQQGAgYOBAcABwgSAwkWBgIDAAEFAAMEAwABBAcCBgsEBwAFAgMAAQUAAwIEDAAGDQABAwABBAQXAAYYAAgZAAkaAAAAAAUHAAwcAA0dAA4eAA8fABAAAAAAAAUHAAwcAA0dAA4eAA8fABABAwABAQMAAQUHABUcABYdABceABgfABkAAAAAAAUHABUcABYdABceABgfABkCAwABBQADAgMAAQUAAwUHAB4cAB8dACAeACEfACIAAAAAAAUHAB4cAB8dACAeACEfACICAwABBQADAgMAAQUAAwUHACccACgdACkeACofACsAAAAAAAUHACccACgdACkeACofACsBAwABAQMAAQUHADAcADEdADIeADMfADQAAAAAAAUHADAcADEdADIeADMfADQKAgELGwEMHgENHwEOIAEQIgERJAgSJQkTJwEUKQgVKgoYKwEZLAEaLQggMAshMREiMgMjMwMkNAMlNQMmNgMnOAMoOggpOxIqPQMrPwgsQBMtQQMuQgMvQwgwRhQxRxoySAIzSQI0SgI1SwI2TAI3TgI4UAg5URs6UwI7VQg8Vhw9VwI-WAI_WQhAXB1BXSNCXgRDXwREYARFYQRGYgRHZARIZghJZyRKaQRLawhMbCVNbQRObgRPbwhQciZRcyxSdAZTdQZUdgZVdwZWeAZXegZYfAhZfS1afwZbgQEIXIIBLl2DAQZehAEGX4UBCGCIAS9hiQE1"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  ConsumptionPlanScalarFieldEnum: () => ConsumptionPlanScalarFieldEnum,
  ConsumptionScalarFieldEnum: () => ConsumptionScalarFieldEnum,
  CreditScalarFieldEnum: () => CreditScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.9.1",
  engine: "e922089b7d7502aff4249d5da3420f6fa55fc6ad"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Category: "Category",
  ConsumptionPlan: "ConsumptionPlan",
  Consumption: "Consumption",
  Credit: "Credit"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  username: "username",
  password: "password"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  editable: "editable",
  userId: "userId"
};
var ConsumptionPlanScalarFieldEnum = {
  id: "id",
  amount: "amount",
  month: "month",
  year: "year",
  userId: "userId",
  categoryId: "categoryId"
};
var ConsumptionScalarFieldEnum = {
  id: "id",
  amount: "amount",
  description: "description",
  month: "month",
  year: "year",
  userId: "userId",
  categoryId: "categoryId"
};
var CreditScalarFieldEnum = {
  id: "id",
  title: "title",
  amount: "amount",
  isActive: "isActive",
  description: "description",
  userId: "userId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// repository/base/crud.repository.ts
var Crud = class {
  constructor(defaultModel, schemas) {
    this.defaultModel = defaultModel;
    this.schemas = schemas;
  }
  defaultModel;
  schemas;
  getModel(model) {
    const activeModel = model || this.defaultModel;
    if (!activeModel) {
      throw new Error("Nenhum modelo Prisma foi especificado.");
    }
    return activeModel;
  }
  parseId(id) {
    if (typeof id === "number") return id;
    const isPureNumber = /^\d+$/.test(id);
    return isPureNumber ? Number(id) : id;
  }
  async beforeCreate(data) {
    return data;
  }
  async beforeUpdate(data) {
    return data;
  }
  async create(data, model, customSchema) {
    const schema = customSchema || this.schemas?.create;
    let validatedData = schema ? schema.parseAsync(data) : data;
    validatedData = await this.beforeCreate(validatedData);
    const m = this.getModel(model);
    return prisma[m].create({
      data: validatedData
    });
  }
  async list(model) {
    const m = this.getModel(model);
    return prisma[m].findMany();
  }
  async find(id, model) {
    const m = this.getModel(model);
    const parsedId = this.parseId(id);
    const item = await prisma[m].findUnique({
      where: { id: parsedId }
    });
    if (!item) {
      throw new Error("NOT_FOUND");
    }
    return item;
  }
  async update(id, data, model, customSchema) {
    await this.find(id, model);
    const schema = customSchema || this.schemas?.update;
    let validatedData = schema ? schema.parseAsync(data) : data;
    validatedData = await this.beforeUpdate(validatedData);
    const m = this.getModel(model);
    const parsedId = this.parseId(id);
    return prisma[m].update({
      where: { id: parsedId },
      data: validatedData
    });
  }
  async delete(id, model) {
    await this.find(id, model);
    const m = this.getModel(model);
    const parsedId = this.parseId(id);
    return prisma[m].delete({
      where: { id: parsedId }
    });
  }
};

// repository/user.repository.ts
var createUserSchema = z.object({
  name: z.string().transform((v) => v === "" ? void 0 : v).optional(),
  username: z.string().min(3, "Nome de utilizador \xE9 obrigat\xF3rio").refine(async (username) => {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    return !existingUser;
  }, {
    message: "Este nome de utilizador j\xE1 est\xE1 em uso, escolha um outro"
  }),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres")
});
var updateUserSchema = createUserSchema.partial();
var loginUserSchema = z.object({
  username: z.string().min(1, "O nome de utilizador \xE9 obrigat\xF3rio"),
  password: z.string().min(1, "A palavra-passe \xE9 obrigat\xF3ria")
});
var UserRepository = class extends Crud {
  constructor() {
    super("user", {
      create: createUserSchema,
      update: updateUserSchema
    });
  }
  async create(data) {
    const validatedData = await createUserSchema.parseAsync(data);
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      10
    );
    return await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword
      }
    });
  }
  async update(id, data) {
    const validatedData = await updateUserSchema.parseAsync(data);
    const updateData = {
      ...validatedData
    };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        10
      );
    }
    return await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: updateData
    });
  }
  async login(data, customSchema) {
    const schema = customSchema || loginUserSchema;
    const { username, password } = schema.parse(data);
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
var userRepository = new UserRepository();

// repository/base/errorHandler.repository.ts
import { ZodError } from "zod";
function errorReport(res, error) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Verifique os campos do formul\xE1rio",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = error.meta?.target;
        const field = Array.isArray(target) ? target.join(", ") : target;
        const model = error.meta?.modelName || "Registo";
        return res.status(409).json({
          message: field ? `J\xE1 existe um(a) ${model} com este(a) ${field}.` : "J\xE1 existe um registo com estes dados."
        });
      }
      case "P2025": {
        return res.status(404).json({
          message: "Registo n\xE3o encontrado no sistema"
        });
      }
      case "P2003": {
        return res.status(400).json({
          message: "Falha na rela\xE7\xE3o entre dados (Chave estrangeira inv\xE1lida)."
        });
      }
      default:
        return res.status(400).json({
          message: "Erro na opera\xE7\xE3o de base de dados",
          code: error.code
        });
    }
  }
  if (error instanceof Error && error.message === "NOT_FOUND") {
    return res.status(404).json({ message: "Registo n\xE3o encontrado" });
  }
  return res.status(500).json({ message: "Erro interno do servidor" });
}

// routes/user.routes.ts
import jwt from "jsonwebtoken";
var userRoutes = Router();
var JWT_SECRET = String(process.env.JWT_SECRET);
userRoutes.post("/users/login", async (req, res) => {
  try {
    const user = await userRepository.login(req.body);
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    return res.status(200).json({
      token,
      user
    });
  } catch (error) {
    return errorReport(res, error);
  }
});
userRoutes.post("/users", async (req, res) => {
  try {
    const newUser = await userRepository.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return errorReport(res, error);
  }
});
userRoutes.get("/users", async (_req, res) => {
  try {
    const users = await userRepository.list();
    return res.status(200).json(users);
  } catch (error) {
    return errorReport(res, error);
  }
});
userRoutes.get("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await userRepository.find(id);
    return res.status(200).json(user);
  } catch (error) {
    return errorReport(res, error);
  }
});
userRoutes.put("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updatedUser = await userRepository.update(id, req.body);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return errorReport(res, error);
  }
});
userRoutes.delete("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await userRepository.delete(id);
    return res.status(200).json({ message: "Registo apagado com sucesso" });
  } catch (error) {
    return errorReport(res, error);
  }
});

// routes/category.routes.ts
import { Router as Router2 } from "express";

// repository/category.repository.ts
import { z as z2 } from "zod";
var CategoryRepository = class extends Crud {
  constructor() {
    super("Category", {
      create: createCategorySchema,
      update: updateCategorySchema
    });
  }
  async listByUserId(userId) {
    const list = await this.list();
    return list.filter((category) => category.userId === userId);
  }
  async findAndVerifyUser(id, userId) {
    const item = await this.find(id);
    if (!item || item.userId !== userId) {
      throw new Error("Categoria n\xE3o encontrada ou acesso n\xE3o autorizado.");
    }
    return item;
  }
};
function requiredNumber(requiredMsg, invalidMsg) {
  return z2.number({
    error: (issue) => {
      if (issue.input === void 0) return requiredMsg;
      return invalidMsg;
    }
  });
}
var createCategorySchema = z2.object({
  name: z2.string({
    error: (issue) => {
      if (issue.input === void 0) return "O nome da categoria \xE9 obrigat\xF3rio";
      return "Informe um nome v\xE1lido para a categoria";
    }
  }).trim().min(1, "O nome da categoria \xE9 obrigat\xF3rio").max(255, "O nome da categoria deve ter no m\xE1ximo 255 caracteres"),
  editable: z2.boolean(
    "O campo editable deve ser um booleano"
  ).optional().default(true),
  userId: requiredNumber(
    "O utilizador \xE9 obrigat\xF3rio",
    "Selecione um utilizador v\xE1lido"
  ).int("Identificador de utilizador inv\xE1lido").positive("Selecione um utilizador v\xE1lido")
});
var updateCategorySchema = createCategorySchema.partial();
var categoryRepository = new CategoryRepository();

// services/crypto.service.ts
import CryptoJS from "crypto-js";
var CRYPTO_SECRET_KEY = String(process.env.CRYPTO_SECRET_KEY || "secret");
var CryptoService = class {
  constructor() {
    console.log("api: " + process.env.CRYPTO_SECRET_KEY);
  }
  encryptId(text) {
    const encryptedText = CryptoJS.AES.encrypt(String(text), CRYPTO_SECRET_KEY).toString();
    return encodeURIComponent(encryptedText);
  }
  decryptId(text) {
    const safeText = decodeURIComponent(text);
    const bytes = CryptoJS.AES.decrypt(safeText, CRYPTO_SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return Number(decryptedText) || 0;
  }
};
var crypto_service_default = new CryptoService();

// routes/category.routes.ts
var categoryRoutes = Router2();
categoryRoutes.post("/categories", async (req, res) => {
  try {
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const newCategory = await categoryRepository.create({ ...req.body, userId });
    return res.status(201).json(newCategory);
  } catch (error) {
    return errorReport(res, error);
  }
});
categoryRoutes.get("/categories", async (req, res) => {
  try {
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const categories = await categoryRepository.listByUserId(userId);
    return res.status(200).json(categories);
  } catch (error) {
    return errorReport(res, error);
  }
});
categoryRoutes.get("/categories/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const category = await categoryRepository.findAndVerifyUser(id, userId);
    return res.status(200).json(category);
  } catch (error) {
    return errorReport(res, error);
  }
});
categoryRoutes.put("/categories/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    await categoryRepository.findAndVerifyUser(id, userId);
    const updatedCategory = await categoryRepository.update(id, req.body);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return errorReport(res, error);
  }
});
categoryRoutes.delete("/categories/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    await categoryRepository.findAndVerifyUser(id, userId);
    await categoryRepository.delete(id);
    return res.status(200).json({ message: "Registo apagado com sucesso" });
  } catch (error) {
    return errorReport(res, error);
  }
});

// routes/consumption-plan.routes.ts
import { Router as Router3 } from "express";

// repository/consumption-plan.repository.ts
import { z as z3 } from "zod";
var ConsumptionPlanRepository = class extends Crud {
  constructor() {
    super("ConsumptionPlan", {
      create: createConsumptionPlanSchema,
      update: updateConsumptionPlanSchema
    });
  }
  async listByUserId(userId) {
    const list = await this.list();
    return list.filter((plan) => plan.userId === userId);
  }
  async findAndVerifyUser(id, userId) {
    const item = await this.find(id);
    if (!item || item.userId !== userId) {
      throw new Error("Plano de consumo n\xE3o encontrado ou acesso n\xE3o autorizado.");
    }
    return item;
  }
};
function requiredNumber2(requiredMsg, invalidMsg) {
  return z3.number({
    error: (issue) => {
      if (issue.input === void 0) return requiredMsg;
      return invalidMsg;
    }
  });
}
var createConsumptionPlanSchema = z3.object({
  amount: requiredNumber2(
    "O montante planeado \xE9 obrigat\xF3rio",
    "O montante deve ser um valor num\xE9rico"
  ).positive("O montante planeado deve ser superior a zero").max(9999999999e-2, "O montante n\xE3o pode ultrapassar 99.999.999,99"),
  month: requiredNumber2(
    "O m\xEAs \xE9 obrigat\xF3rio",
    "Selecione um m\xEAs v\xE1lido"
  ).int("O m\xEAs deve ser um n\xFAmero inteiro").min(1, "O m\xEAs deve estar entre 1 e 12").max(12, "O m\xEAs deve estar entre 1 e 12"),
  year: requiredNumber2(
    "O ano \xE9 obrigat\xF3rio",
    "Informe um ano v\xE1lido"
  ).int("O ano deve ser um n\xFAmero inteiro").min(2e3, "O ano deve ser igual ou superior a 2000").max(2100, "O ano deve ser inferior a 2100"),
  userId: requiredNumber2(
    "O utilizador \xE9 obrigat\xF3rio",
    "Selecione um utilizador v\xE1lido"
  ).int("Identificador de utilizador inv\xE1lido").positive("Selecione um utilizador v\xE1lido"),
  categoryId: requiredNumber2(
    "A categoria \xE9 obrigat\xF3ria",
    "Selecione uma categoria v\xE1lida"
  ).int("Identificador de categoria inv\xE1lido").positive("Selecione uma categoria v\xE1lida")
});
var updateConsumptionPlanSchema = createConsumptionPlanSchema.partial();
var consumptionPlanRepository = new ConsumptionPlanRepository();

// routes/consumption-plan.routes.ts
var consumptionPlanRoutes = Router3();
consumptionPlanRoutes.post("/consumption-plans", async (req, res) => {
  try {
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const newPlan = await consumptionPlanRepository.create({ ...req.body, userId });
    return res.status(201).json(newPlan);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionPlanRoutes.get("/consumption-plans", async (req, res) => {
  try {
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const plans = await consumptionPlanRepository.listByUserId(userId);
    return res.status(200).json(plans);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionPlanRoutes.get("/consumption-plans/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const plan = await consumptionPlanRepository.findAndVerifyUser(id, userId);
    return res.status(200).json(plan);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionPlanRoutes.put("/consumption-plans/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    await consumptionPlanRepository.findAndVerifyUser(id, userId);
    const updatedPlan = await consumptionPlanRepository.update(id, req.body);
    return res.status(200).json(updatedPlan);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionPlanRoutes.delete("/consumption-plans/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    await consumptionPlanRepository.findAndVerifyUser(id, userId);
    await consumptionPlanRepository.delete(id);
    return res.status(200).json({ message: "Registo apagado com sucesso" });
  } catch (error) {
    return errorReport(res, error);
  }
});

// routes/consumption.routes.ts
import { Router as Router4 } from "express";

// repository/consumption.repository.ts
import { z as z4 } from "zod";
var ConsumptionRepository = class extends Crud {
  constructor() {
    super("Consumption", {
      create: createConsumptionSchema,
      update: updateConsumptionSchema
    });
  }
  async listByUserId(userId) {
    const list = await this.list();
    return list.filter((consumption) => consumption.userId === userId);
  }
  async findAndVerifyUser(id, userId) {
    const item = await this.find(id);
    if (!item || item.userId !== userId) {
      throw new Error("Consumo n\xE3o encontrado ou acesso n\xE3o autorizado.");
    }
    return item;
  }
};
function requiredNumber3(requiredMsg, invalidMsg) {
  return z4.number({
    error: (issue) => {
      if (issue.input === void 0) return requiredMsg;
      return invalidMsg;
    }
  });
}
var createConsumptionSchema = z4.object({
  amount: requiredNumber3(
    "O montante \xE9 obrigat\xF3rio",
    "O montante deve ser um valor num\xE9rico"
  ).positive("O montante deve ser superior a zero").max(9999999999e-2, "O montante n\xE3o pode ultrapassar 99.999.999,99"),
  description: z4.string().nullable().optional(),
  month: requiredNumber3(
    "O m\xEAs \xE9 obrigat\xF3rio",
    "Selecione um m\xEAs v\xE1lido"
  ).int("O m\xEAs deve ser um n\xFAmero inteiro").min(1, "O m\xEAs deve estar entre 1 e 12").max(12, "O m\xEAs deve estar entre 1 e 12"),
  year: requiredNumber3(
    "O ano \xE9 obrigat\xF3rio",
    "Informe um ano v\xE1lido"
  ).int("O ano deve ser um n\xFAmero inteiro").min(2e3, "O ano deve ser igual ou superior a 2000").max(2100, "O ano deve ser inferior a 2100"),
  userId: requiredNumber3(
    "O utilizador \xE9 obrigat\xF3rio",
    "Selecione um utilizador v\xE1lido"
  ).int("Identificador de utilizador inv\xE1lido").positive("Selecione um utilizador v\xE1lido"),
  categoryId: requiredNumber3(
    "A categoria \xE9 obrigat\xF3ria",
    "Selecione uma categoria v\xE1lida"
  ).int("Identificador de categoria inv\xE1lido").positive("Selecione uma categoria v\xE1lida")
});
var updateConsumptionSchema = createConsumptionSchema.partial();
var consumptionRepository = new ConsumptionRepository();

// routes/consumption.routes.ts
var consumptionRoutes = Router4();
consumptionRoutes.post("/consumptions", async (req, res) => {
  try {
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const newConsumption = await consumptionRepository.create({ ...req.body, userId });
    return res.status(201).json(newConsumption);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionRoutes.get("/consumptions", async (req, res) => {
  try {
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const consumptions = await consumptionRepository.listByUserId(userId);
    return res.status(200).json(consumptions);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionRoutes.get("/consumptions/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    const consumption = await consumptionRepository.findAndVerifyUser(id, userId);
    return res.status(200).json(consumption);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionRoutes.put("/consumptions/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    await consumptionRepository.findAndVerifyUser(id, userId);
    const updatedConsumption = await consumptionRepository.update(id, req.body);
    return res.status(200).json(updatedConsumption);
  } catch (error) {
    return errorReport(res, error);
  }
});
consumptionRoutes.delete("/consumptions/:id", async (req, res) => {
  try {
    const id = crypto_service_default.decryptId(String(req.params.id));
    const userId = crypto_service_default.decryptId(String(req.query.userId));
    await consumptionRepository.findAndVerifyUser(id, userId);
    await consumptionRepository.delete(id);
    return res.status(200).json({ message: "Registo apagado com sucesso" });
  } catch (error) {
    return errorReport(res, error);
  }
});

// server.ts
var app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", consumptionPlanRoutes);
app.use("/api", consumptionRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "API rodando!",
    environment: process.env.NODE_ENV
  });
});
if (process.env.NODE_ENV !== "production") {
  app.listen(3e3, () => {
    console.log("Servidor a rodar na porta 3000");
  });
}
var server_default = app;
export {
  server_default as default
};
