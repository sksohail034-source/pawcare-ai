import React from 'react';
import { useCart } from '../context/CartContext';
import { FiX, FiTrash2, FiShoppingCart, FiMinus, FiPlus, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
        animation: 'slideIn 0.3s forwards'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.2rem', 
          borderBottom: '1px solid #e2e8f0', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <FiShoppingCart color="#22c55e" /> Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b' }}>
              <FiShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155' }}>Your Amazon Cart is empty</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Check your Saved for later items below or continue shopping.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f1111', margin: '0 0 0.4rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#B12704', marginBottom: '0.5rem' }}>
                      ₹{item.price}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '20px', padding: '2px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                        >
                          <FiMinus size={14} color="#0f1111" />
                        </button>
                        <span style={{ margin: '0 12px', fontSize: '0.9rem', fontWeight: '700', color: '#0f1111' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                        >
                          <FiPlus size={14} color="#0f1111" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', color: '#0f1111' }}>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#B12704' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <button 
              onClick={() => {
                toast.success('Redirecting to Amazon to complete purchase...');
                // Open the first item's affiliate link
                if(cartItems.length > 0) {
                  window.open(cartItems[0].affiliateUrl, '_blank');
                }
              }}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                background: '#ffd814',
                color: '#0f1111',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
               Proceed to Checkout
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#15803d', fontSize: '0.8rem', fontWeight: '600' }}>
              <FiLock size={12} /> Secure transaction via Amazon
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
