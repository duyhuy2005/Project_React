import React from "react";
import { Card, Tag, Rate, Button } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../data/products";
import { formatPrice } from "../../data/products";
import { useCartStore } from "../../stores/cartStore";

const { Meta } = Card;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      className="product-card premium-card"
      cover={
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6 h-72 flex items-center justify-center">
          <img
            alt={product.name}
            src={product.image}
            className="h-full w-auto object-contain transition-all duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isBestSeller && (
              <Tag
                style={{
                  background: 'linear-gradient(135deg, #c9a96e, #d4af37)',
                  border: 'none',
                  color: '#1a1a2e',
                  fontWeight: 700,
                  fontSize: 11,
                  padding: '4px 12px',
                  borderRadius: 20,
                }}
              >
                BÁN CHẠY
              </Tag>
            )}
            {product.isNew && (
              <Tag color="blue" style={{ fontWeight: 700, fontSize: 11, borderRadius: 20 }}>
                MỚI
              </Tag>
            )}
            {discount > 0 && (
              <Tag color="red" style={{ fontWeight: 700, fontSize: 11, borderRadius: 20 }}>
                -{discount}%
              </Tag>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="text"
              shape="circle"
              icon={<HeartOutlined />}
              className="glass-white"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined />}
              className="glass-white"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
            />
          </div>
        </div>
      }
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <Meta
        title={
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase mb-1">
              {product.brand}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </div>
        }
        description={
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Rate disabled defaultValue={product.rating} allowHalf className="!text-sm" />
              <span className="text-xs text-gray-500">({product.rating})</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: '#c9a96e' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <Button
              type="primary"
              block
              icon={<ShoppingCartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              style={{
                height: 42,
                borderRadius: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #c9a96e, #d4af37)',
                border: 'none',
              }}
              className="btn-premium"
            >
              Thêm vào giỏ
            </Button>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
