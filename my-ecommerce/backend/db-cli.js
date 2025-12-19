import readline from "readline-sync";
import mongoose from "mongoose";

// MongoDB connection
await mongoose.connect("mongodb://localhost:27017/ecommerce");

// Product schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model("Product", productSchema);

function showMenu() {
  console.log("\n=== MONGODB CLI MENU ===");
  console.log("1. View all products");
  console.log("2. Insert a new product");
  console.log("3. Update a product");
  console.log("4. Delete a product");
  console.log("5. Exit");
}

async function viewProducts() {
  console.log("\n--- All Products ---");
  try {
    const products = await Product.find();
    console.log(products);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

async function insertProduct() {
  const id = Date.now();
  const name = readline.question("Enter product name: ");
  const price = Number(readline.question("Enter price: "));
  const category = readline.question("Enter category: ");
  const image = readline.question("Enter image path or URL: ");

  try {
    const product = new Product({ id, name, price, category, image });
    await product.save();
    console.log("Product inserted successfully!");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

async function updateProduct() {
  const id = Number(readline.question("Enter ID of product to update: "));

  try {
    let product = await Product.findOne({ id });

    if (!product) {
      console.log("Product not found.");
      return;
    }

    const name = readline.question(`Enter new name (${product.name}): `);
    const priceStr = readline.question(`Enter new price (${product.price}): `);
    const image = readline.question(`Enter new image (${product.image}): `);

    if (name) product.name = name;
    if (priceStr) product.price = Number(priceStr);
    if (image) product.image = image;

    await product.save();
    console.log("Product updated successfully!");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

async function deleteProduct() {
  const id = Number(readline.question("Enter ID to delete: "));

  try {
    await Product.deleteOne({ id });
    console.log("Product deleted successfully!");
  } catch (error) {
    console.log("Error:", error.message);
  }
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
        await mongoose.disconnect();
        process.exit();
        break;
      default:
        console.log("Invalid choice");
    }
  }
}

main();
