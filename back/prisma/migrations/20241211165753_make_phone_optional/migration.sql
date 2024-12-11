-- DropForeignKey
ALTER TABLE "orders_services" DROP CONSTRAINT "orders_services_service_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "vehicle_id" DROP NOT NULL,
ALTER COLUMN "worker_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders_services" ADD CONSTRAINT "orders_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
