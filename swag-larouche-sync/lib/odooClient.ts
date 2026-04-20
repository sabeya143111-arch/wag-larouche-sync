import { OdooClient } from "@tapni/odoo-xmlrpc";

const odoo = new OdooClient({
  url: process.env.ODOO_URL || "",
  db: process.env.ODOO_DB || "",
  username: process.env.ODOO_USERNAME || "",
  password: process.env.ODOO_PASSWORD || "",
});

export async function fetchSaleOrders(fromDate: string, toDate: string) {
  if (!process.env.ODOO_URL) {
    throw new Error("ODOO_URL env not set");
  }

  await odoo.connect();

  const domain = [
    ["state", "in", ["sale", "done"]],
    ["date_order", ">=", fromDate],
    ["date_order", "<=", toDate],
  ];

  const fields = [
    "name",
    "date_order",
    "partner_id",
    "amount_total",
    "warehouse_id",
  ];

  const saleOrders = await odoo.search_read("sale.order", domain, fields);
  return saleOrders;
}
