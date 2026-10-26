import {
  mysqlTable,
  varchar,
  int,
  boolean,
  text,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const products = mysqlTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  pricePerNight: int("price_per_night").notNull(),
  stock: int("stock").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  iconName: varchar("icon_name", { length: 255 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  isBundle: boolean("is_bundle").default(false).notNull(),
  description: text("description"),
});

export const productsRelations = relations(products, ({ many }) => ({
  bundleItems: many(bundleItems, { relationName: "bundleToItems" }),
  partOfBundles: many(bundleItems, { relationName: "itemToBundles" }),
}));

export const bundleItems = mysqlTable("bundle_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  bundleId: varchar("bundle_id", { length: 255 }).notNull().references(() => products.id),
  productId: varchar("product_id", { length: 255 }).notNull().references(() => products.id),
  quantity: int("quantity").notNull(),
});

export const bundleItemsRelations = relations(bundleItems, ({ one }) => ({
  bundle: one(products, {
    fields: [bundleItems.bundleId],
    references: [products.id],
    relationName: "bundleToItems",
  }),
  product: one(products, {
    fields: [bundleItems.productId],
    references: [products.id],
    relationName: "itemToBundles",
  }),
}));

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookings = mysqlTable("bookings", {
  id: varchar("id", { length: 255 }).primaryKey(), // e.g., POS-XXXXXX
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  startDate: datetime("start_date").notNull(),
  endDate: datetime("end_date").notNull(),
  nightCount: int("night_count").notNull(),
  totalPrice: int("total_price").notNull(),
  status: mysqlEnum("status", ["PENDING", "DP_PAID", "PAID", "CANCELLED", "COMPLETED"]).default("PENDING").notNull(),
  notes: text("notes"),
  paymentUrl: varchar("payment_url", { length: 1024 }),
  createdAt: datetime("created_at").default(new Date()).notNull(),
  updatedAt: datetime("updated_at").default(new Date()).notNull(),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  items: many(bookingItems),
}));

export const bookingItems = mysqlTable("booking_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  bookingId: varchar("booking_id", { length: 255 }).notNull().references(() => bookings.id),
  productId: varchar("product_id", { length: 255 }).notNull().references(() => products.id),
  quantity: int("quantity").notNull(),
  pricePerNight: int("price_per_night").notNull(),
});

export const bookingItemsRelations = relations(bookingItems, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingItems.bookingId],
    references: [bookings.id],
  }),
  product: one(products, {
    fields: [bookingItems.productId],
    references: [products.id],
  }),
}));

export const admins = mysqlTable("admins", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
});
