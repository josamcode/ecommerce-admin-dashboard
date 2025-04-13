"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";
import { ToastContainer, toast } from "react-toastify";
import {
  FilePlus,
  DollarSign,
  Tag,
  ShoppingCart,
  Star,
  MessageCircle,
  ImagePlus,
  GripVertical,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const category = [
  { label: "Men's Watches", value: "mens-watches" },
  { label: "Women's Watches", value: "womens-watches" },
  { label: "Smart Watches", value: "smart-watches" },
  { label: "Classic Watches", value: "classic-watches" },
  { label: "Watch Accessories", value: "watch-accessories" },
  { label: "Global Brands", value: "global-brands" },
];

function SortableItem({ id, image, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
    >
      <div {...attributes} {...listeners}>
        <GripVertical className="text-gray-400" />
      </div>
      <img
        src={image.preview}
        alt={`Preview ${index + 1}`}
        className="w-16 h-16 object-cover rounded"
      />
      <span className="text-sm text-gray-600">Image {index + 1}</span>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="ml-auto text-red-500 hover:text-red-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

const ProductForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/collections?lang=en`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((collection) => ({
          id: collection.id,
          name: collection.name, // Convert a name to an object
          image: collection.image,
          description: collection.description, // Convert a description to an object
          value: collection.value,
        }));
        setCollections(formattedData);
      });
  }, []);

  // get collictions value
  const collectionValues = collections.map((collection) => ({
    label: collection.name,
    value: collection.value,
  }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviewImages([...previewImages, ...newPreviewImages]);
    setValue("images", [...previewImages.map((img) => img.file), ...files]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPreviewImages((items) => {
        const oldIndex = items.findIndex(
          (_, index) => `image-${index}` === active.id
        );
        const newIndex = items.findIndex(
          (_, index) => `image-${index}` === over.id
        );

        const newItems = arrayMove(items, oldIndex, newIndex);
        setValue(
          "images",
          newItems.map((img) => img.file)
        );
        return newItems;
      });
    }
  };

  const removeImage = (index) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    setValue(
      "images",
      newImages.map((img) => img.file)
    );
  };

  const onSubmit = async (data) => {
    // Format productCollection to lowercase with underscores
    const formattedCollection = data.productCollection
      ? data.productCollection
          .map((item) => item.value.toLowerCase().replace(/\s+/g, "_"))
          .join(",")
      : "";

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          formData.append("images", value[i]);
        }
      } else if (key === "category") {
        formData.append(
          "category",
          JSON.stringify(value.map((cat) => cat.value))
        );
      } else if (key === "productCollection") {
        formData.append("productCollection", formattedCollection);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/products", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status === "success") {
        toast.success("Product added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/dashboard/products");
      } else {
        toast.error(result.message || "Failed to add product.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg space-y-6"
        >
          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
            <FilePlus size={24} className="text-indigo-600" />
            Add New Product
          </h1>

          {/* Rest of the form remains unchanged */}
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag size={16} className="text-indigo-600" />
              Product Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Product name is required" })}
              placeholder="Enter product name"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Price and Discount Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-600" />
                Price
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                placeholder="Enter price"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-600" />
                Discount Price
              </label>
              <input
                type="number"
                {...register("discountPrice")}
                placeholder="Enter discount price"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageCircle size={16} className="text-indigo-600" />
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Enter product description"
              rows="4"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ShoppingCart size={16} className="text-indigo-600" />
              Brand
            </label>
            <input
              type="text"
              {...register("brand")}
              placeholder="Enter brand name"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag size={16} className="text-indigo-600" />
              Category
            </label>
            <Controller
              name="category"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <MultiSelect
                  options={category}
                  value={field.value}
                  onChange={field.onChange}
                  labelledBy="Select category"
                  className="mt-1"
                />
              )}
            />
          </div>

          {/* Product Collection */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag size={16} className="text-indigo-600" />
              Product Collection (Optional)
            </label>
            <Controller
              name="productCollection"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <MultiSelect
                  options={collectionValues}
                  value={field.value}
                  onChange={field.onChange}
                  labelledBy="Select product collection"
                  className="mt-1"
                />
              )}
            />
          </div>

          {/* Stock and Sold */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ShoppingCart size={16} className="text-indigo-600" />
                Stock
              </label>
              <input
                type="number"
                {...register("stock", { required: "Stock is required" })}
                placeholder="Enter stock quantity"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.stock && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ShoppingCart size={16} className="text-indigo-600" />
                Sold
              </label>
              <input
                type="number"
                {...register("sold")}
                placeholder="Enter sold quantity"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Rating and Reviews Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Star size={16} className="text-indigo-600" />
                Rating (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register("rating")}
                placeholder="Enter rating"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageCircle size={16} className="text-indigo-600" />
                Reviews Count
              </label>
              <input
                type="number"
                {...register("reviewsCount")}
                placeholder="Enter reviews count"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ImagePlus size={16} className="text-indigo-600" />
              Images
            </label>
            <input
              type="file"
              multiple
              required
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />

            {/* Image Preview and Reordering */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop to reorder images
              </p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={previewImages.map((_, index) => `image-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {previewImages.map((image, index) => (
                      <SortableItem
                        key={`image-${index}`}
                        id={`image-${index}`}
                        image={image}
                        index={index}
                        onRemove={removeImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
          >
            <FilePlus size={20} />
            Create Product
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
