/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `vehicle_id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `worker_id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - The primary key for the `orders_services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `order_id` on the `orders_services` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `service_id` on the `orders_services` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - The primary key for the `vehicles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vehicles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `user_id` on the `vehicles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_worker_id_fkey";

-- DropForeignKey
ALTER TABLE "orders_services" DROP CONSTRAINT "orders_services_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders_services" DROP CONSTRAINT "orders_services_service_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_user_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP CONSTRAINT "orders_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "vehicle_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "worker_id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orders_services" DROP CONSTRAINT "orders_services_pkey",
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "service_id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "orders_services_pkey" PRIMARY KEY ("order_id", "service_id");

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_services" ADD CONSTRAINT "orders_services_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_services" ADD CONSTRAINT "orders_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
