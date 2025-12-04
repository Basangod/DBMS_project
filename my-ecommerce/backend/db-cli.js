import readline from "readline-sync";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("db.json");
const db = new Low(adapter, { products: [] });

await db.read();

function showMenu() {
  console.log("\n=== LOWDB CLI MENU ===");
  console.log("1. View all products");
  console.log("2. Insert a new product");
  console.log("3. Update a product");
  console.log("4. Delete a product");
  console.log("5. Exit");
}

async function viewProducts() {
  console.log("\n--- All Products ---");
  console.log(db.data.products);
}

async function insertProduct() {
  const id = Date.now();
  const name = readline.question("Enter product name: ");
  const price = Number(readline.question("Enter price: "));
  const category = readline.question("Enter category: ");
  const image = readline.question("Enter image path or URL: ");

  db.data.products.push({ id, name, price, category, image });
  await db.write();

  console.log("Product inserted successfully!");
}

async function updateProduct() {
  const id = Number(readline.question("Enter ID of product to update: "));
  let product = db.data.products.find(p => p.id === id);

  if (!product) {
    console.log("Product not found.");
    return;
  }

  const name = readline.question(`Enter new name (${product.name}): `);
  const price = Number(readline.question(`Enter new price (${product.price}): `));
  const image = readline.question(`Enter new image (${product.image}): `);

  if (name) product.name = name;
  if (price) product.price = price;
  if (image) product.image = image;

  await db.write();
  console.log("Product updated successfully!");
}

async function deleteProduct() {
  const id = Number(readline.question("Enter ID to delete: "));

  db.data.products = db.data.products.filter(p => p.id !== id);
  await db.write();

  console.log("Product deleted successfully!");
}

async function main() {
  while (true) {
    showMenu();
    const choice = readline.question("Choose an option: ");

    switch (choice) {
      case "1":
        await viewProducts();
        break;
      case "2":
        await insertProduct();
        break;
      case "3":
        await updateProduct();
        break;
      case "4":
        await deleteProduct();
        break;
      case "5":
        console.log("Goodbye!");
        process.exit();
        break;
      default:
        console.log("Invalid choice");
    }
  }
}

main();
