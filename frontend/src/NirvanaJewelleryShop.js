import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NirvanaJewelleryShop() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    weight: "",
    price: "",
    quantity: "",
    image: null
  });
  const [bill, setBill] = useState({ customer: "", itemId: "", qty: "" });

  // Fetch inventory
  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const handleAddItem = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    await fetch("/api/inventory", { method: "POST", body: formData });
    alert("Item added!");
  };

  const handleGenerateBill = async () => {
    await fetch("/api/bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill)
    });
    alert("Bill generated!");
  };

  return (
    <div className="min-h-screen bg-[#F5E9DA] text-[#3B2F2F] p-6">
      <h1 className="text-4xl font-serif text-center mb-8 text-[#8B5E3C]">
        Nirvana Jewellery Shop
      </h1>

      {/* Inventory List */}
      <Card className="mb-10 bg-[#fffaf0] shadow-xl rounded-2xl border-[#C49A6C]">
        <CardContent className="p-6">
          <h2 className="text-2xl mb-4 font-semibold">Current Inventory</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="border border-[#C49A6C] rounded-xl p-4 bg-[#FDF5E6]"
              >
                {it.image_url && (
                  <img
                    src={it.image_url}
                    alt={it.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                )}
                <p className="font-bold">{it.name}</p>
                <p>Type: {it.type}</p>
                <p>Weight: {it.weight} g</p>
                <p>Price/g: ₹{it.price_per_gram}</p>
                <p>Qty: {it.quantity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Item Form */}
      <Card className="mb-10 bg-[#fffaf0] shadow-xl rounded-2xl border-[#C49A6C]">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-2xl mb-4 font-semibold">Add New Item</h2>
          <input
            className="border p-2 w-full"
            placeholder="Item Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Type"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Weight (grams)"
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Price per gram"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Quantity"
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          <Button className="bg-[#8B5E3C] text-white" onClick={handleAddItem}>
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Billing Section */}
      <Card className="bg-[#fffaf0] shadow-xl rounded-2xl border-[#C49A6C]">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-2xl mb-4 font-semibold">Generate Bill</h2>
          <input
            className="border p-2 w-full"
            placeholder="Customer Name"
            onChange={(e) => setBill({ ...bill, customer: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Item ID"
            onChange={(e) => setBill({ ...bill, itemId: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Quantity"
            onChange={(e) => setBill({ ...bill, qty: e.target.value })}
          />
          <Button className="bg-[#8B5E3C] text-white" onClick={handleGenerateBill}>
            Generate Bill
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
