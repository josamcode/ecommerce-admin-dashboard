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
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {message && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Collection Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
          <button
            onClick={toggleFormVisibility}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
          >
            {isFormVisible ? (
              <>
                <ChevronUp className="h-5 w-5 mr-2" />
                Hide Form
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5 mr-2" />
                Show Form
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div
        className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 mb-8 ${
          isFormVisible ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingId ? "Edit Collection" : "Add New Collection"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                placeholder="Enter English name"
                value={newCollection.name.en}
                onChange={(e) =>
                  setNewCollection({
                    ...newCollection,
                    name: { ...newCollection.name, en: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name (Arabic)</label>
              <input
                type="text"
                placeholder="Enter Arabic name"
                value={newCollection.name.ar}
                onChange={(e) =>
                  setNewCollection({
                    ...newCollection,
                    name: { ...newCollection.name, ar: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              placeholder="Enter image URL"
              value={newCollection.image}
              onChange={(e) =>
                setNewCollection({ ...newCollection, image: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description (English)</label>
              <textarea
                placeholder="Enter English description"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
              <textarea
                placeholder="Enter Arabic description"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              placeholder="Enter value"
              value={newCollection.value}
              onChange={(e) =>
                setNewCollection({ ...newCollection, value: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={editingId ? handleUpdateCollection : handleAddCollection}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
            >
              {editingId ? "Save Changes" : "Add Collection"}
            </button>
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {collections.map((collection, index) => (
                <tr key={collection.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{collection.name[lang] || ""}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={"https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/collections/" + collection.image}
                        alt={collection.name[lang] || ""}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {collection.description[lang] || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{collection.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => startEdit(collection.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-150"
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
    </div>
  );
}
