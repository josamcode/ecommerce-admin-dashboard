"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ManageCollections() {
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({
    name: { en: "", ar: "" },
    image: "",
    description: { en: "", ar: "" },
    value: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [lang, setLang] = useState("en");
  const [message, setMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true); // State for form visibility

  // Function to toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  //Fetch all collections from API
  useEffect(() => {
    fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((collection) => ({
          id: collection.id,
          name: { [lang]: collection.name }, // Convert a name to an object
          image: collection.image,
          description: { [lang]: collection.description }, // Convert a description to an object
          value: collection.value,
        }));
        setCollections(formattedData);
      });
  }, [lang]);

  // add new collection
  const handleAddCollection = () => {
    fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCollection),
    })
      .then((res) => res.json())
      .then((data) => {
        setCollections([...collections, data]);
        setNewCollection({
          name: { en: "", ar: "" },
          image: "",
          description: { en: "", ar: "" },
          value: "",
        });
        setMessage("Collection added successfully!");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const startEdit = (id) => {
    toggleFormVisibility();

    Promise.all([
      fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections/${id}?lang=en`).then((res) =>
        res.json()
      ),
      fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections/${id}?lang=ar`).then((res) =>
        res.json()
      ),
    ]).then(([enData, arData]) => {
      setNewCollection({
        name: {
          en: enData.name || "",
          ar: arData.name || "",
        },
        image: enData.image || "",
        description: {
          en: enData.description || "",
          ar: arData.description || "",
        },
        value: enData.value || "",
      });
      setEditingId(id);
    });
  };

  // save changes
  const handleUpdateCollection = () => {
    fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCollection),
    })
      .then((res) => res.json())
      .then((data) => {
        setCollections(collections.map((c) => (c.id === editingId ? data : c)));
        setNewCollection({
          name: { en: "", ar: "" },
          image: "",
          description: { en: "", ar: "" },
          value: "",
        });
        setEditingId(null);
        setMessage("Collection updated successfully!");
        setTimeout(() => setMessage(""), 3000); 
      });
  };

  // حذف مجموعة
  const handleDeleteCollection = (id) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections/${id}`, {
        method: "DELETE",
      }).then(() => {
        setCollections(collections.filter((c) => c.id !== id));
        setMessage("Collection deleted successfully!");
        setTimeout(() => setMessage(""), 3000); 
      });
    }
  };

  return (
    <div className="p-8">
      {/* suc message*/}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          {message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Manage Collections</h1>

      {/* choosing language */}
      <div className="mb-6">
        <label className="mr-2">Language:</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
      </div>

      {/* Toggle Icon */}
      {/* <div className="flex justify-end p-2">
        <button
          onClick={toggleFormVisibility}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {isFormVisible ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </button>
      </div> */}

      {/* Form Container */}
      <div
        className={`bg-white shadow-md rounded-lg transition-all duration-300 mb-10 ${
          isFormVisible ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Form Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Collection" : "Add New Collection"}
          </h2>
          <input
            type="text"
            placeholder="Name (English)"
            value={newCollection.name.en}
            onChange={(e) =>
              setNewCollection({
                ...newCollection,
                name: { ...newCollection.name, en: e.target.value },
              })
            }
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Name (Arabic)"
            value={newCollection.name.ar}
            onChange={(e) =>
              setNewCollection({
                ...newCollection,
                name: { ...newCollection.name, ar: e.target.value },
              })
            }
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newCollection.image}
            onChange={(e) =>
              setNewCollection({ ...newCollection, image: e.target.value })
            }
            className="w-full p-3 border rounded"
          />
          <textarea
            placeholder="Description (English)"
            value={newCollection.description.en}
            onChange={(e) =>
              setNewCollection({
                ...newCollection,
                description: {
                  ...newCollection.description,
                  en: e.target.value,
                },
              })
            }
            className="w-full p-3 border rounded"
          />
          <textarea
            placeholder="Description (Arabic)"
            value={newCollection.description.ar}
            onChange={(e) =>
              setNewCollection({
                ...newCollection,
                description: {
                  ...newCollection.description,
                  ar: e.target.value,
                },
              })
            }
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Value"
            value={newCollection.value}
            onChange={(e) =>
              setNewCollection({ ...newCollection, value: e.target.value })
            }
            className="w-full p-3 border rounded"
          />
          <button
            onClick={editingId ? handleUpdateCollection : handleAddCollection}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 w-full cursor-pointer"
          >
            {editingId ? "Save Changes" : "Add Collection"}
          </button>
        </div>
      </div>

      {/* Table to display collections */}
      <div className="bg-white shadow-md rounded-lg overflow-auto">
        <h2 className="text-xl font-semibold p-4 border-b">Collections List</h2>
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Value</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collections.map((collection, index) => (
              <tr key={collection.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6">{collection.name[lang] || ""}</td>
                <td className="py-4 px-6">
                  <img
                    src={collection.image}
                    alt={collection.name[lang] || ""}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-4 px-6">
                  {collection.description[lang] || ""}
                </td>
                <td className="py-4 px-6">{collection.value}</td>
                <td className="py-4 px-6 space-x-2">
                  <button
                    onClick={() => startEdit(collection.id)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
