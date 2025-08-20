import type { Company } from "@prisma/client";
export type CompanyPlain = Omit<Company, "price"> & { price: number };