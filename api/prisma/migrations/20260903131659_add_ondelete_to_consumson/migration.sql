-- DropForeignKey
ALTER TABLE "consumption_plans" DROP CONSTRAINT "consumption_plans_category_id_fkey";

-- AddForeignKey
ALTER TABLE "consumption_plans" ADD CONSTRAINT "consumption_plans_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
