import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { products, Category } from "@/data/products";

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const categories = [
    { id: "all", name: "전체" },
    { id: "desk-mats", name: "데스크 매트/패드" },
    { id: "storage", name: "수납/정리" },
    { id: "lighting", name: "조명" },
    { id: "stands", name: "스탠드/받침대" },
    { id: "accessories", name: "전자기기/액세서리" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section id="products" className="py-20 sm:py-28">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            쇼핑
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            당신의 책상을 완성하는 프리미엄 데스크 액세서리 컬렉션
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as Category)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted-foreground">
              선택한 카테고리에 상품이 없습니다.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
