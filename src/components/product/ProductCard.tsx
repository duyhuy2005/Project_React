import React from "react";
import { Tag, Rate, Button } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../data/products";
import { formatPrice } from "../../data/products";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="premium-card group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#f8f7f4] to-[#f0ede6] p-6 h-72 flex items-center justify-center">
        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          alt={product.name}
          src={product.image}
          className="h-[85%] w-auto object-contain transition-all duration-700 group-hover:scale-110 drop-shadow-lg group-hover:drop-shadow-2xl"
        />

        {/* Hover action buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              size="large"
              className="!bg-white/90 backdrop-blur-md !shadow-lg hover:!bg-accent hover:!text-white !border-none transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
            />
            <Button
              shape="circle"
              icon={<HeartOutlined />}
              size="large"
              className="!bg-white/90 backdrop-blur-md !shadow-lg hover:!bg-red-500 hover:!text-white !border-none transition-all duration-300 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              shape="circle"
              icon={<ShoppingCartOutlined />}
              size="large"
              className="!bg-white/90 backdrop-blur-md !shadow-lg hover:!bg-accent hover:!text-white !border-none transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.isNew && (
            <Tag className="!m-0 !rounded-full !text-[10px] !font-bold !px-3 !py-0.5 !bg-blue-500 !text-white !border-none !shadow-md">
              MỚI
            </Tag>
          )}
          {product.isBestSeller && (
            <Tag className="!m-0 !rounded-full !text-[10px] !font-bold !px-3 !py-0.5 !bg-gradient-to-r !from-accent !to-accent-dark !text-white !border-none !shadow-md">
              BÁN CHẠY
            </Tag>
          )}
          {discount > 0 && (
            <Tag className="!m-0 !rounded-full !text-[10px] !font-bold !px-3 !py-0.5 !bg-red-500 !text-white !border-none !shadow-md">
              -{discount}%
            </Tag>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="p-5">
        <p className="text-[11px] text-accent font-bold tracking-[0.2em] uppercase m-0">
          {product.brand}
        </p>
        <h3 className="text-base font-bold text-primary mt-1.5 mb-2.5 leading-snug line-clamp-1 group-hover:text-accent transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <Rate disabled defaultValue={product.rating} allowHalf className="!text-xs !text-accent" />
          <span className="text-[11px] text-gray-400">({product.reviews})</span>
        </div>

        {/* Price + Quick add */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gradient-gold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
