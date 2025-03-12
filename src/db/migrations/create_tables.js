export const createUsersTable = `CREATE TABLE IF NOT EXISTS "users" (
	"user_id" varchar(6) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"user_type" varchar(255) NOT NULL,
	PRIMARY KEY ("user_id")
);`;

export const createProductsTable = `CREATE TABLE IF NOT EXISTS "products" (
	"product_id" varchar(6) NOT NULL UNIQUE,
	"product_name" varchar(255) NOT NULL,
	"product_description" varchar(255)  NOT NULL,
	"product_category" varchar(255) NOT NULL,
	"product_weight" numeric(12,2) NOT NULL,
	"product_price" numeric(12,2) NOT NULL,
	"stock_quantity" bigint NOT NULL,
	"stock_updated_at" timestamp without time zone NOT NULL,
	PRIMARY KEY ("product_id")
);`;

export const createOrderItemsTable = `CREATE TABLE IF NOT EXISTS "order_items" (
	"order_item_id" varchar(6) NOT NULL UNIQUE,
	"order_id" varchar(6) NOT NULL,
	"product_id" varchar(6) NOT NULL,
	"item_quantity" bigint NOT NULL,
	PRIMARY KEY ("order_item_id")
);`;

export const createOrdersTable = `CREATE TABLE IF NOT EXISTS "orders" (
	"order_id" varchar(6) NOT NULL UNIQUE,
	"customer_name" varchar(255) NOT NULL,
	"customer_address" varchar(255) NOT NULL,
	"discount" numeric(12,2) NOT NULL,
	"shipping_fee" numeric(12,2) NOT NULL,
	"order_date" timestamp without time zone NOT NULL,
	PRIMARY KEY ("order_id")
);`;

export const createPurchaseItemsTable = `CREATE TABLE IF NOT EXISTS "purchase_items" (
	"purchase_item_id" varchar(6) NOT NULL UNIQUE,
	"purchase_id" varchar(6) NOT NULL,
	"product_id" varchar(6) NOT NULL,
	"item_quantity" bigint NOT NULL,
	PRIMARY KEY ("purchase_item_id")
);`;

export const createPurchasesTable = `CREATE TABLE IF NOT EXISTS "purchases" (
	"purchase_id" varchar(6) NOT NULL UNIQUE,
	"supplier_name" varchar(255) NOT NULL,
	"supplier_address" varchar(255) NOT NULL,
	"discount" numeric(12,2) NOT NULL,
	"shipping_fee" numeric(12,2) NOT NULL,
	"purchase_date" timestamp without time zone NOT NULL,
	PRIMARY KEY ("purchase_id")
);`;

export const addForeignKeys = `ALTER TABLE "order_items" ADD CONSTRAINT "order_items_fk1" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_fk2" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE;

ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_fk1" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("purchase_id") ON DELETE CASCADE;

ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_fk2" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE;
`;

// export const addForeignKeys = `
// ALTER TABLE order_items DROP CONSTRAINT order_items_fk1;

// ALTER TABLE order_items DROP CONSTRAINT order_items_fk2;

// ALTER TABLE purchase_items DROP CONSTRAINT purchase_items_fk1;

// ALTER TABLE purchase_items DROP CONSTRAINT purchase_items_fk2;
// ;`;
